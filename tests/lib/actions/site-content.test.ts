import { describe, expect, it, vi, beforeEach } from "vitest"

const db = vi.hoisted(() => {
  const state = {
    selectRows: [] as unknown[],
    insertRows: [] as unknown[],
    insertCount: 0,
    updateCount: 0,
    deleteCount: 0,
  }
  return {
    state,
    db: {
      select: () => ({
        from: () => ({
          where: () => ({
            limit: () => state.selectRows,
            orderBy: () => state.selectRows,
          }),
        }),
      }),
      insert: () => ({
        values: () => {
          state.insertCount++
          return { returning: () => state.insertRows }
        },
      }),
      update: () => ({
        set: () => {
          state.updateCount++
          return { where: () => {} }
        },
      }),
      delete: () => ({
        where: () => {
          state.deleteCount++
        },
      }),
    },
  }
})

vi.mock("@/lib/db", () => ({ db: db.db }))
vi.mock("@/lib/db/schema", () => ({ siteContent: {} }))
vi.mock("@/lib/auth", () => ({ auth: { api: { getSession: vi.fn() } } }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("next/headers", () => ({ headers: async () => new Headers() }))

import { updateSiteContent } from "@/lib/actions/site-content"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

function fd(entries: Record<string, string>) {
  const form = new FormData()
  for (const [k, v] of Object.entries(entries)) form.set(k, v)
  return form
}

describe("updateSiteContent", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    db.state.selectRows = []
    db.state.insertRows = []
    db.state.insertCount = 0
    db.state.updateCount = 0
    db.state.deleteCount = 0
    vi.mocked(auth.api.getSession).mockResolvedValue({ user: { id: "u1" } })
  })

  it("throws when unauthenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)
    await expect(updateSiteContent(undefined, fd({}))).rejects.toThrow("Non autorisé")
  })

  it("returns an error when the key is missing", async () => {
    const res = await updateSiteContent(undefined, fd({ value: JSON.stringify({ x: 1 }) }))
    expect(res).toEqual({ error: "Clé manquante." })
  })

  it("returns an error when the value is missing", async () => {
    const res = await updateSiteContent(undefined, fd({ _key: "home_hero" }))
    expect(res).toEqual({ error: "Le contenu est requis." })
  })

  it("returns an error on invalid JSON", async () => {
    const res = await updateSiteContent(
      undefined,
      fd({ _key: "home_hero", value: "not-json" })
    )
    expect(res).toEqual({ error: "JSON invalide." })
  })

  it("updates existing content and revalidates", async () => {
    db.state.selectRows = [{ id: 1, key: "home_hero", value: {} }]
    const res = await updateSiteContent(
      undefined,
      fd({ _key: "home_hero", value: JSON.stringify({ title: "Bonjour" }) })
    )
    expect(res).toBeUndefined()
    expect(db.state.updateCount).toBe(1)
    expect(revalidatePath).toHaveBeenCalledWith("/")
    expect(revalidatePath).toHaveBeenCalledWith("/admin/contenu")
  })

  it("inserts new content when none exists", async () => {
    db.state.selectRows = []
    const res = await updateSiteContent(
      undefined,
      fd({ _key: "home_hero", value: JSON.stringify({ title: "Bonjour" }) })
    )
    expect(res).toBeUndefined()
    expect(db.state.insertCount).toBe(1)
    expect(revalidatePath).toHaveBeenCalledWith("/")
  })
})
