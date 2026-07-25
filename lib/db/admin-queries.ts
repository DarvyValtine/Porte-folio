import "server-only"
import { db } from "@/lib/db"
import { articles, pressItems, galleryItems, appointments, appointmentTypes, articleLikes, articleComments } from "@/lib/db/schema"
import { desc, eq, sql } from "drizzle-orm"

// Articles
export async function getAllArticlesAdmin() {
  return db
    .select({
      id: articles.id,
      title: articles.title,
      slug: articles.slug,
      category: articles.category,
      published: articles.published,
      views: articles.views,
      createdAt: articles.createdAt,
      likes: sql<number>`COALESCE((SELECT COUNT(*) FROM ${articleLikes} WHERE ${articleLikes.articleId} = ${articles.id}), 0)`,
      comments: sql<number>`COALESCE((SELECT COUNT(*) FROM ${articleComments} WHERE ${articleComments.articleId} = ${articles.id}), 0)`,
    })
    .from(articles)
    .orderBy(desc(articles.createdAt))
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
  return db
    .select({
      id: appointments.id,
      name: appointments.name,
      email: appointments.email,
      phone: appointments.phone,
      preferredDate: appointments.preferredDate,
      typeId: appointments.typeId,
      typeName: appointmentTypes.name,
      subject: appointments.subject,
      message: appointments.message,
      status: appointments.status,
      createdAt: appointments.createdAt,
    })
    .from(appointments)
    .leftJoin(appointmentTypes, eq(appointments.typeId, appointmentTypes.id))
    .orderBy(desc(appointments.createdAt))
}
