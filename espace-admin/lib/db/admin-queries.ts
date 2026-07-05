import "server-only"
import { db } from "@/lib/db"
import { articles, pressItems, galleryItems, appointments } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"

// Articles
export async function getAllArticlesAdmin() {
  return db.select().from(articles).orderBy(desc(articles.createdAt))
}

export async function getArticleByIdAdmin(id: number) {
  const rows = await db.select().from(articles).where(eq(articles.id, id)).limit(1)
  return rows[0] ?? null
}

// Gallery
export async function getAllGalleryItemsAdmin() {
  return db
    .select()
    .from(galleryItems)
    .orderBy(galleryItems.sortOrder, desc(galleryItems.createdAt))
}

// Press
export async function getAllPressItemsAdmin() {
  return db.select().from(pressItems).orderBy(desc(pressItems.publishedDate))
}

export async function getPressItemByIdAdmin(id: number) {
  const rows = await db.select().from(pressItems).where(eq(pressItems.id, id)).limit(1)
  return rows[0] ?? null
}

// Appointments / messages
export async function getAllAppointmentsAdmin() {
  return db.select().from(appointments).orderBy(desc(appointments.createdAt))
}
