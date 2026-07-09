"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { galleryItems } from "@/lib/db/schema"
import { auth } from "@/lib/auth"

export type ActionState = { error?: string } | undefined

type SimpleResult = { success: boolean; error?: string }

async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Non autorisé")
  return session.user.id
}

export async function createGalleryItem(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const userId = await requireUserId()

  const imageUrl = String(formData.get("imageUrl") || "").trim()
  if (!imageUrl) return { error: "L'URL de l'image est requise." }

  await db.insert(galleryItems).values({
    userId,
    title: String(formData.get("title") || "").trim() || null,
    caption: String(formData.get("caption") || "").trim() || null,
    imageUrl,
    sortOrder: Number(formData.get("sortOrder") || 0) || 0,
  })

  revalidatePath("/admin/galerie")
  revalidatePath("/galerie")
  return undefined
}

export async function deleteGalleryItem(id: number): Promise<SimpleResult> {
  await requireUserId()
  await db.delete(galleryItems).where(eq(galleryItems.id, id))
  revalidatePath("/admin/galerie")
  revalidatePath("/galerie")
  return { success: true }
}
