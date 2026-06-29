import "server-only"
import { db } from "@/lib/db"
import { articles, pressItems, galleryItems } from "@/lib/db/schema"
import { desc, eq, and } from "drizzle-orm"

export async function getPublishedArticles() {
  return db
    .select()
    .from(articles)
    .where(eq(articles.published, true))
    .orderBy(desc(articles.createdAt))
}

export async function getArticleBySlug(slug: string) {
  const rows = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.published, true)))
    .limit(1)
  return rows[0] ?? null
}

export async function getPressItems() {
  return db.select().from(pressItems).orderBy(desc(pressItems.publishedDate))
}

export async function getGalleryItems() {
  return db
    .select()
    .from(galleryItems)
    .orderBy(galleryItems.sortOrder, desc(galleryItems.createdAt))
}
