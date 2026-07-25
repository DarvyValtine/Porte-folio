import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { articleComments } from "@/lib/db/schema"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Non autorisé")
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { id, isApproved } = await req.json()
  await db.update(articleComments).set({ isApproved }).where(eq(articleComments.id, id))
  revalidatePath("/admin/articles")
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin()
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const id = Number(req.nextUrl.searchParams.get("id"))
  await db.delete(articleComments).where(eq(articleComments.id, id))
  revalidatePath("/admin/articles")
  return NextResponse.json({ success: true })
}