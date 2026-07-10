"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { articles } from "@/lib/db/schema"
import { auth } from "@/lib/auth"

export type ActionState = { error?: string } | undefined

type SimpleResult = { success: boolean; error?: string }

async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Non autorisé")
  return session.user.id
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "")
}

export async function createArticle(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const userId = await requireUserId()

  const title = String(formData.get("title") || "").trim()
  const content = String(formData.get("content") || "").trim()
  if (!title) return { error: "Le titre est requis." }
  if (!content) return { error: "Le contenu est requis." }

  const coverImage = String(formData.get("coverImage") || "").trim() || null
  const slugInput = String(formData.get("slug") || "").trim()
  const slug = slugify(slugInput || title)

  const existing = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1)
  if (existing.length > 0) {
    return { error: "Ce slug est déjà utilisé par un autre article." }
  }

  await db.insert(articles).values({
    userId,
    title,
    slug,
    excerpt: String(formData.get("excerpt") || "").trim() || null,
    content,
    coverImage,
    category: String(formData.get("category") || "").trim() || null,
    published: formData.get("published") === "on",
  })

  revalidatePath("/admin/articles")
  revalidatePath("/articles")
  redirect("/admin/articles")
}

export async function updateArticle(
  id: number,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireUserId()

  const title = String(formData.get("title") || "").trim()
  const content = String(formData.get("content") || "").trim()
  if (!title) return { error: "Le titre est requis." }
  if (!content) return { error: "Le contenu est requis." }

  const coverImage = String(formData.get("coverImage") || "").trim() || null
  const slugInput = String(formData.get("slug") || "").trim()
  const slug = slugify(slugInput || title)

  const existing = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1)
  if (existing.length > 0 && existing[0].id !== id) {
    return { error: "Ce slug est déjà utilisé par un autre article." }
  }

  await db
    .update(articles)
    .set({
      title,
      slug,
      excerpt: String(formData.get("excerpt") || "").trim() || null,
      content,
      coverImage,
      category: String(formData.get("category") || "").trim() || null,
      published: formData.get("published") === "on",
      updatedAt: new Date(),
    })
    .where(eq(articles.id, id))

  revalidatePath("/admin/articles")
  revalidatePath("/articles")
  revalidatePath(`/articles/${slug}`)
  redirect("/admin/articles")
}

export async function deleteArticle(id: number): Promise<SimpleResult> {
  await requireUserId()
  await db.delete(articles).where(eq(articles.id, id))
  revalidatePath("/admin/articles")
  revalidatePath("/articles")
  return { success: true }
}

export async function toggleArticlePublished(id: number, published: boolean): Promise<SimpleResult> {
  await requireUserId()
  await db.update(articles).set({ published, updatedAt: new Date() }).where(eq(articles.id, id))
  revalidatePath("/admin/articles")
  revalidatePath("/articles")
  return { success: true }
}
