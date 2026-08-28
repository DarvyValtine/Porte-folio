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
vi.mock("@/lib/db/schema", () => ({ articles: {} }))
vi.mock("@/lib/auth", () => ({ auth: { api: { getSession: vi.fn() } } }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("next/headers", () => ({ headers: async () => new Headers() }))
vi.mock("next/navigation", () => ({
  redirect: vi.fn().mockImplementation((url: string) => {
    throw new Error("REDIRECT:" + url)
  }),
}))

import {
  createArticle,
  updateArticle,
  deleteArticle,
  toggleArticlePublished,
} from "@/lib/actions/articles"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

function fd(entries: Record<string, string>) {
  const form = new FormData()
  for (const [k, v] of Object.entries(entries)) form.set(k, v)
  return form
}

describe("createArticle", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    db.state.selectRows = []
    db.state.insertCount = 0
    vi.mocked(auth.api.getSession).mockResolvedValue({ user: { id: "u1" } })
    vi.mocked(redirect).mockImplementation((url: string) => {
      throw new Error("REDIRECT:" + url)
    })
  })

  it("throws when unauthenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)
    await expect(createArticle(undefined, fd({ title: "T", content: "C" }))).rejects.toThrow(
      "Non autorisé"
    )
  })

  it("returns an error when the title is missing", async () => {
    const res = await createArticle(undefined, fd({ content: "Contenu suffisant" }))
    expect(res).toEqual({ error: "Le titre est requis." })
  })

  it("returns an error when the content is missing", async () => {
    const res = await createArticle(undefined, fd({ title: "Titre" }))
    expect(res).toEqual({ error: "Le contenu est requis." })
  })

  it("returns an error when the slug already exists", async () => {
    db.state.selectRows = [{ id: 5, slug: "mon-article" }]
    const res = await createArticle(undefined, fd({ title: "Mon Article", content: "Contenu" }))
    expect(res).toEqual({ error: "Ce slug est déjà utilisé par un autre article." })
    expect(db.state.insertCount).toBe(0)
  })

  it("inserts and redirects on success", async () => {
    db.state.selectRows = []
    await expect(
      createArticle(undefined, fd({ title: "Mon Article", content: "Contenu" }))
    ).rejects.toThrow()
    expect(redirect).toHaveBeenCalledWith("/admin/articles")
    expect(db.state.insertCount).toBe(1)
  })
})

describe("updateArticle", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    db.state.selectRows = []
    db.state.updateCount = 0
    vi.mocked(auth.api.getSession).mockResolvedValue({ user: { id: "u1" } })
    vi.mocked(redirect).mockImplementation((url: string) => {
      throw new Error("REDIRECT:" + url)
    })
  })

  it("throws when unauthenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)
    await expect(updateArticle(1, undefined, fd({ title: "T", content: "C" }))).rejects.toThrow(
      "Non autorisé"
    )
  })

  it("returns an error when the title is missing", async () => {
    const res = await updateArticle(1, undefined, fd({ content: "Contenu" }))
    expect(res).toEqual({ error: "Le titre est requis." })
  })

  it("returns an error when the slug exists for another article", async () => {
    db.state.selectRows = [{ id: 9, slug: "autre" }]
    const res = await updateArticle(1, undefined, fd({ title: "Autre", content: "Contenu" }))
    expect(res).toEqual({ error: "Ce slug est déjà utilisé par un autre article." })
  })

  it("updates and redirects on success", async () => {
    db.state.selectRows = []
    await expect(
      updateArticle(1, undefined, fd({ title: "Titre", content: "Contenu" }))
    ).rejects.toThrow()
    expect(redirect).toHaveBeenCalledWith("/admin/articles")
    expect(db.state.updateCount).toBe(1)
  })
})

describe("deleteArticle", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    db.state.deleteCount = 0
    vi.mocked(auth.api.getSession).mockResolvedValue({ user: { id: "u1" } })
  })

  it("throws when unauthenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)
    await expect(deleteArticle(1)).rejects.toThrow("Non autorisé")
  })

  it("deletes and returns success", async () => {
    const res = await deleteArticle(3)
    expect(res).toEqual({ success: true })
    expect(db.state.deleteCount).toBe(1)
    expect(revalidatePath).toHaveBeenCalledWith("/admin/articles")
  })
})

describe("toggleArticlePublished", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    db.state.updateCount = 0
    vi.mocked(auth.api.getSession).mockResolvedValue({ user: { id: "u1" } })
  })

  it("throws when unauthenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)
    await expect(toggleArticlePublished(1, true)).rejects.toThrow("Non autorisé")
  })

  it("updates the published flag and returns success", async () => {
    const res = await toggleArticlePublished(3, true)
    expect(res).toEqual({ success: true })
    expect(db.state.updateCount).toBe(1)
    expect(revalidatePath).toHaveBeenCalledWith("/admin/articles")
  })
})
