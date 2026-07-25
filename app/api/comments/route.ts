import { NextRequest, NextResponse } from "next/server"
import { desc, eq, and } from "drizzle-orm"
import { db } from "@/lib/db"
import { articleComments } from "@/lib/db/schema"

export async function GET(req: NextRequest) {
  const articleId = Number(req.nextUrl.searchParams.get("articleId"))
  if (!articleId) {
    return NextResponse.json({ comments: [] })
  }
  const comments = await db
    .select()
    .from(articleComments)
    .where(and(eq(articleComments.articleId, articleId), eq(articleComments.isApproved, true)))
    .orderBy(desc(articleComments.createdAt))
  return NextResponse.json({ comments })
}

export async function POST(req: NextRequest) {
  const { articleId, authorName, authorEmail, content } = await req.json()
  if (!articleId || !authorName || !content) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 })
  }

  await db.insert(articleComments).values({ articleId, authorName, authorEmail, content })
  return NextResponse.json({ success: true })
}