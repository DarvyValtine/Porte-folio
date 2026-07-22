import { NextRequest, NextResponse } from "next/server"
import { eq, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { articles } from "@/lib/db/schema"

export async function POST(req: NextRequest) {
  const { slug } = await req.json()
  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Slug requis" }, { status: 400 })
  }

  await db
    .update(articles)
    .set({ views: sql`${articles.views} + 1` })
    .where(eq(articles.slug, slug))

  return NextResponse.json({ ok: true })
}
