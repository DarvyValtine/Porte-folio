"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { pressItems } from "@/lib/db/schema"
import { auth } from "@/lib/auth"

export type ActionState = { error?: string } | undefined

async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Non autorisé")
  return session.user.id
}

export async function createPressItem(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const userId = await requireUserId()

  const title = String(formData.get("title") || "").trim()
  if (!title) return { error: "Le titre est requis." }

  const publishedDateRaw = String(formData.get("publishedDate") || "").trim()

  await db.insert(pressItems).values({
    userId,
    title,
    outlet: String(formData.get("outlet") || "").trim() || null,
    url: String(formData.get("url") || "").trim() || null,
    excerpt: String(formData.get("excerpt") || "").trim() || null,
    coverImage: String(formData.get("coverImage") || "").trim() || null,
    publishedDate: publishedDateRaw || null,
  })

  revalidatePath("/admin/presse")
  revalidatePath("/presse")
  return undefined
}

export async function deletePressItem(id: number) {
  await requireUserId()
  await db.delete(pressItems).where(eq(pressItems.id, id))
  revalidatePath("/admin/presse")
  revalidatePath("/presse")
}
