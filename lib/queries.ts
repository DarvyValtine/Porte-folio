import "server-only"
import fs from "fs/promises"
import path from "path"
import { db } from "@/lib/db"
import { articles, pressItems, galleryItems } from "@/lib/db/schema"
import { desc, eq, and } from "drizzle-orm"

async function localFileExists(url: string | null) {
  if (!url || !url.startsWith("/uploads/")) return true
  try {
    await fs.access(path.join(process.cwd(), "public", url))
    return true
  } catch {
    return false
  }
}

export async function getPublishedArticles() {
  const rows = await db
    .select()
    .from(articles)
    .where(eq(articles.published, true))
    .orderBy(desc(articles.createdAt))

  return Promise.all(
    rows.map(async (a) => {
      const exists = await localFileExists(a.coverImage)
      return { ...a, coverImage: exists ? a.coverImage : null }
    })
  )
}

export async function getArticleBySlug(slug: string) {
  const rows = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.published, true)))
    .limit(1)

  if (!rows[0]) return null

  const exists = await localFileExists(rows[0].coverImage)
  return { ...rows[0], coverImage: exists ? rows[0].coverImage : null }
}

export async function getPressItems() {
  const rows = await db.select().from(pressItems).orderBy(desc(pressItems.publishedDate))

  return Promise.all(
    rows.map(async (p) => ({
      ...p,
      coverImage: (await localFileExists(p.coverImage)) ? p.coverImage : null,
    }))
  )
}

export async function getGalleryItems() {
  const rows = await db
    .select()
    .from(galleryItems)
    .orderBy(galleryItems.sortOrder, desc(galleryItems.createdAt))

  return Promise.all(
    rows.map(async (g) => ({
      ...g,
      imageUrl: (await localFileExists(g.imageUrl)) ? g.imageUrl : "",
    }))
  )
}
