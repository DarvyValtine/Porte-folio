"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { siteContent } from "@/lib/db/schema"
import { auth } from "@/lib/auth"

export type ActionState = { error?: string } | undefined

const publicPages: Record<string, string> = {
  home_hero: "/",
  home_intro: "/",
  home_focus_areas: "/",
  home_cta: "/",
  a_propos: "/a-propos",
  parcours: "/parcours",
}

async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Non autorisé")
  return session.user.id
}

export async function updateSiteContent(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireUserId()

  const key = String(formData.get("_key") || "").trim()
  if (!key) return { error: "Clé manquante." }

  const raw = String(formData.get("value") || "").trim()
  if (!raw) return { error: "Le contenu est requis." }

  let value: unknown
  try {
    value = JSON.parse(raw)
  } catch {
    return { error: "JSON invalide." }
  }

  const existing = await db.select().from(siteContent).where(eq(siteContent.key, key)).limit(1)

  if (existing.length > 0) {
    await db.update(siteContent).set({ value, updatedAt: new Date() }).where(eq(siteContent.key, key))
  } else {
    await db.insert(siteContent).values({ key, value })
  }

  revalidatePath(publicPages[key] ?? "/")
  revalidatePath("/admin/contenu")
  return undefined
}
