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
vi.mock("@/lib/db/schema", () => ({ pressItems: {} }))
vi.mock("@/lib/auth", () => ({ auth: { api: { getSession: vi.fn() } } }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("next/headers", () => ({ headers: async () => new Headers() }))

import { createPressItem, deletePressItem } from "@/lib/actions/press"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

function fd(entries: Record<string, string>) {
  const form = new FormData()
  for (const [k, v] of Object.entries(entries)) form.set(k, v)
  return form
}

describe("createPressItem", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    db.state.insertCount = 0
    vi.mocked(auth.api.getSession).mockResolvedValue({ user: { id: "u1" } } as any)
  })

  it("throws when unauthenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)
    await expect(createPressItem(undefined, fd({}))).rejects.toThrow("Non autorisé")
  })

  it("returns an error when the title is missing", async () => {
    const res = await createPressItem(undefined, fd({ outlet: "Le Monde" }))
    expect(res).toEqual({ error: "Le titre est requis." })
  })

  it("inserts and returns undefined on success", async () => {
    const res = await createPressItem(undefined, fd({ title: "Article de presse" }))
    expect(res).toBeUndefined()
    expect(db.state.insertCount).toBe(1)
    expect(revalidatePath).toHaveBeenCalledWith("/admin/presse")
    expect(revalidatePath).toHaveBeenCalledWith("/presse")
  })
})

describe("deletePressItem", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    db.state.deleteCount = 0
    vi.mocked(auth.api.getSession).mockResolvedValue({ user: { id: "u1" } } as any)
  })

  it("throws when unauthenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)
    await expect(deletePressItem(1)).rejects.toThrow("Non autorisé")
  })

  it("deletes and returns success", async () => {
    const res = await deletePressItem(3)
    expect(res).toEqual({ success: true })
    expect(db.state.deleteCount).toBe(1)
    expect(revalidatePath).toHaveBeenCalledWith("/admin/presse")
  })
})
