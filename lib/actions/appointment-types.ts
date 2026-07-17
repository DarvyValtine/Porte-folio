"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { eq, asc } from "drizzle-orm"
import { db } from "@/lib/db"
import { appointmentTypes } from "@/lib/db/schema"
import { auth } from "@/lib/auth"

async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Non autorisé")
  return session.user.id
}

export type ActionState = { error?: string } | undefined

export async function getAppointmentTypes() {
  return db
    .select()
    .from(appointmentTypes)
    .orderBy(asc(appointmentTypes.sortOrder))
}

export async function createAppointmentType(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireUserId()

  const name = String(formData.get("name") || "").trim()
  if (!name) return { error: "Le nom est requis." }

  const description = String(formData.get("description") || "").trim() || null

  await db.insert(appointmentTypes).values({
    name,
    description,
    sortOrder: await db.$count(appointmentTypes),
  })

  revalidatePath("/admin/rdv/types")
  return undefined
}

export async function updateAppointmentType(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireUserId()

  const id = Number(formData.get("id"))
  if (!id) return { error: "ID invalide." }

  const name = String(formData.get("name") || "").trim()
  if (!name) return { error: "Le nom est requis." }

  const description = String(formData.get("description") || "").trim() || null
  const isActive = formData.get("isActive") === "true"

  await db
    .update(appointmentTypes)
    .set({ name, description, isActive })
    .where(eq(appointmentTypes.id, id))

  revalidatePath("/admin/rdv/types")
  return undefined
}

export async function deleteAppointmentType(id: number): Promise<ActionState> {
  await requireUserId()
  await db.delete(appointmentTypes).where(eq(appointmentTypes.id, id))
  revalidatePath("/admin/rdv/types")
  return undefined
}

export async function reorderAppointmentTypes(
  ids: number[]
): Promise<ActionState> {
  await requireUserId()
  for (let i = 0; i < ids.length; i++) {
    await db
      .update(appointmentTypes)
      .set({ sortOrder: i })
      .where(eq(appointmentTypes.id, ids[i]))
  }
  revalidatePath("/admin/rdv/types")
  return undefined
}
