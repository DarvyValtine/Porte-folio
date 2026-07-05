"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { appointments } from "@/lib/db/schema"
import { auth } from "@/lib/auth"

async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Non autorisé")
  return session.user.id
}

export async function updateAppointmentStatus(id: number, status: "pending" | "contacted" | "closed") {
  await requireUserId()
  await db.update(appointments).set({ status }).where(eq(appointments.id, id))
  revalidatePath("/admin/messages")
}

export async function deleteAppointment(id: number) {
  await requireUserId()
  await db.delete(appointments).where(eq(appointments.id, id))
  revalidatePath("/admin/messages")
}
