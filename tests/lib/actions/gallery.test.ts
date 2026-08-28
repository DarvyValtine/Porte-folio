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
vi.mock("@/lib/db/schema", () => ({ galleryItems: {} }))
vi.mock("@/lib/auth", () => ({ auth: { api: { getSession: vi.fn() } } }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("next/headers", () => ({ headers: async () => new Headers() }))

import { createGalleryItem, deleteGalleryItem } from "@/lib/actions/gallery"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

function fd(entries: Record<string, string>) {
  const form = new FormData()
  for (const [k, v] of Object.entries(entries)) form.set(k, v)
  return form
}

describe("createGalleryItem", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    db.state.insertCount = 0
    vi.mocked(auth.api.getSession).mockResolvedValue({ user: { id: "u1" } })
  })

  it("throws when unauthenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)
    await expect(createGalleryItem(undefined, fd({}))).rejects.toThrow("Non autorisé")
  })

  it("returns an error when the image URL is missing", async () => {
    const res = await createGalleryItem(undefined, fd({ title: "Photo" }))
    expect(res).toEqual({ error: "L'URL de l'image est requise." })
  })

  it("inserts and returns undefined on success", async () => {
    const res = await createGalleryItem(
      undefined,
      fd({ imageUrl: "https://utfs.io/x/abc.jpg", title: "Photo" })
    )
    expect(res).toBeUndefined()
    expect(db.state.insertCount).toBe(1)
    expect(revalidatePath).toHaveBeenCalledWith("/admin/galerie")
    expect(revalidatePath).toHaveBeenCalledWith("/galerie")
  })
})

describe("deleteGalleryItem", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    db.state.deleteCount = 0
    vi.mocked(auth.api.getSession).mockResolvedValue({ user: { id: "u1" } })
  })

  it("throws when unauthenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)
    await expect(deleteGalleryItem(1)).rejects.toThrow("Non autorisé")
  })

  it("deletes and returns success", async () => {
    const res = await deleteGalleryItem(3)
    expect(res).toEqual({ success: true })
    expect(db.state.deleteCount).toBe(1)
    expect(revalidatePath).toHaveBeenCalledWith("/admin/galerie")
  })
})
