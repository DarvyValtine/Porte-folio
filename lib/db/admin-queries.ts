import "server-only"
import { db } from "@/lib/db"
import { articles, pressItems, galleryItems, appointments, appointmentTypes, articleLikes, articleComments } from "@/lib/db/schema"
import { desc, eq, sql } from "drizzle-orm"

// Articles
export async function getAllArticlesAdmin() {
  const rows = await db
    .select()
    .from(articles)
    .orderBy(desc(articles.createdAt))

  const articleIds = rows.map((a) => a.id)

  const [allLikes, allComments] = await Promise.all([
    articleIds.length > 0
      ? db.select({ articleId: articleLikes.articleId }).from(articleLikes)
      : Promise.resolve([]),
    articleIds.length > 0
      ? db.select({ articleId: articleComments.articleId }).from(articleComments)
      : Promise.resolve([]),
  ])

  const likeMap: Record<number, number> = {}
  const commentMap: Record<number, number> = {}
  for (const l of allLikes) likeMap[l.articleId] = (likeMap[l.articleId] ?? 0) + 1
  for (const c of allComments) commentMap[c.articleId] = (commentMap[c.articleId] ?? 0) + 1

  return rows.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    category: a.category,
    published: a.published,
    views: a.views,
    createdAt: a.createdAt,
    likes: likeMap[a.id] ?? 0,
    comments: commentMap[a.id] ?? 0,
  }))
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
