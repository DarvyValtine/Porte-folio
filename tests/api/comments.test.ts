import { describe, expect, it, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

const db = vi.hoisted(() => {
  const state = {
    selectRows: [] as unknown[],
    insertRows: [] as unknown[],
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
        values: () => ({
          returning: () => state.insertRows,
        }),
      }),
      update: () => ({
        set: () => ({
          where: () => {
            state.updateCount++
          },
        }),
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
vi.mock("@/lib/db/schema", () => ({ articleComments: {} }))

import { GET, POST } from "@/app/api/comments/route"

function resetState() {
  db.state.selectRows = []
  db.state.insertRows = []
  db.state.updateCount = 0
  db.state.deleteCount = 0
}

describe("GET /api/comments", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetState()
  })

  it("returns an empty list when the articleId is missing", async () => {
    const res = await GET(new NextRequest("http://localhost/api/comments"))
    expect(await res.json()).toEqual({ comments: [] })
  })

  it("returns the comments for the given article", async () => {
    db.state.selectRows = [
      { id: 1, authorName: "Alice", content: "Super" },
      { id: 2, authorName: "Bob", content: "Top" },
    ]
    const res = await GET(
      new NextRequest("http://localhost/api/comments?articleId=1")
    )
    expect(await res.json()).toEqual({
      comments: [
        { id: 1, authorName: "Alice", content: "Super" },
        { id: 2, authorName: "Bob", content: "Top" },
      ],
    })
  })
})

describe("POST /api/comments", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetState()
  })

  it("returns 400 when required fields are missing", async () => {
    const res = await POST(
      new NextRequest("http://localhost/api/comments", {
        method: "POST",
        body: JSON.stringify({ articleId: 1 }),
      })
    )
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: "Champs requis manquants" })
  })

  it("creates the comment and returns it", async () => {
    db.state.insertRows = [{ id: 1, authorName: "Alice", content: "Super" }]
    const res = await POST(
      new NextRequest("http://localhost/api/comments", {
        method: "POST",
        body: JSON.stringify({ articleId: 1, authorName: "Alice", content: "Super" }),
      })
    )
    expect(await res.json()).toEqual({
      success: true,
      comment: { id: 1, authorName: "Alice", content: "Super" },
    })
  })
})