import { NextRequest, NextResponse } from "next/server"
import { eq, and } from "drizzle-orm"
import { db } from "@/lib/db"
import { articleLikes } from "@/lib/db/schema"

export async function GET(req: NextRequest) {
  const articleId = Number(req.nextUrl.searchParams.get("articleId"))
  const sessionId = req.nextUrl.searchParams.get("sessionId")
  if (!articleId || !sessionId) {
    return NextResponse.json({ liked: false })
  }
  const rows = await db
    .select()
    .from(articleLikes)
    .where(and(eq(articleLikes.articleId, articleId), eq(articleLikes.sessionId, sessionId)))
    .limit(1)
  return NextResponse.json({ liked: rows.length > 0 })
}

export async function POST(req: NextRequest) {
  const { articleId, sessionId } = await req.json()
  if (!articleId || !sessionId) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 })
  }

  const existing = await db
    .select()
    .from(articleLikes)
    .where(and(eq(articleLikes.articleId, articleId), eq(articleLikes.sessionId, sessionId)))
    .limit(1)

  if (existing.length > 0) {
    await db
      .delete(articleLikes)
      .where(and(eq(articleLikes.articleId, articleId), eq(articleLikes.sessionId, sessionId)))
    return NextResponse.json({ liked: false })
  }

  await db.insert(articleLikes).values({ articleId, sessionId })
  return NextResponse.json({ liked: true })
}