"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { appointments } from "@/lib/db/schema"
import { auth } from "@/lib/auth"

const appointmentSchema = z.object({
  name: z.string().min(2, "Nom requis (min. 2 caractères)"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().optional(),
  preferredDate: z.string().optional(),
  typeId: z.coerce.number().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message requis (min. 10 caractères)"),
})

export type ActionState = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string[] | undefined>
} | undefined

type SimpleResult = { success: boolean; error?: string }

async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Non autorisé")
  return session.user.id
}

export async function createAppointment(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = appointmentSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    preferredDate: formData.get("preferredDate") || undefined,
    subject: formData.get("subject") || undefined,
    typeId: formData.get("typeId") || undefined,
    message: formData.get("message"),
  })

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  await db.insert(appointments).values({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    preferredDate: parsed.data.preferredDate ?? null,
    typeId: parsed.data.typeId ?? null,
    subject: parsed.data.subject ?? null,
    message: parsed.data.message,
  })

  revalidatePath("/admin/rdv")
  return { success: true }
}

export async function updateAppointmentStatus(id: number, status: "pending" | "contacted" | "closed"): Promise<SimpleResult> {
  await requireUserId()
  await db.update(appointments).set({ status }).where(eq(appointments.id, id))
  revalidatePath("/admin/rdv")
  return { success: true }
}

export async function deleteAppointment(id: number): Promise<SimpleResult> {
  await requireUserId()
  await db.delete(appointments).where(eq(appointments.id, id))
  revalidatePath("/admin/rdv")
  return { success: true }
}
