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
vi.mock("@/lib/db/schema", () => ({ articleLikes: {} }))

import { GET, POST } from "@/app/api/likes/route"

function resetState() {
  db.state.selectRows = []
  db.state.insertRows = []
  db.state.updateCount = 0
  db.state.deleteCount = 0
}

describe("GET /api/likes", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetState()
  })

  it("returns liked false when the params are missing", async () => {
    const res = await GET(new NextRequest("http://localhost/api/likes"))
    expect(await res.json()).toEqual({ liked: false })
  })

  it("returns liked true when a matching row exists", async () => {
    db.state.selectRows = [{ id: 1 }]
    const res = await GET(
      new NextRequest("http://localhost/api/likes?articleId=1&sessionId=abc")
    )
    expect(await res.json()).toEqual({ liked: true })
  })

  it("returns liked false when no row matches", async () => {
    const res = await GET(
      new NextRequest("http://localhost/api/likes?articleId=1&sessionId=abc")
    )
    expect(await res.json()).toEqual({ liked: false })
  })
})

describe("POST /api/likes", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetState()
  })

  it("returns 400 when the params are missing", async () => {
    const res = await POST(
      new NextRequest("http://localhost/api/likes", {
        method: "POST",
        body: JSON.stringify({}),
      })
    )
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: "Paramètres manquants" })
  })

  it("deletes the like when it already exists", async () => {
    db.state.selectRows = [{ id: 1 }]
    const res = await POST(
      new NextRequest("http://localhost/api/likes", {
        method: "POST",
        body: JSON.stringify({ articleId: 1, sessionId: "abc" }),
      })
    )
    expect(db.state.deleteCount).toBe(1)
    expect(await res.json()).toEqual({ liked: false })
  })

  it("inserts a like when none exists", async () => {
    const res = await POST(
      new NextRequest("http://localhost/api/likes", {
        method: "POST",
        body: JSON.stringify({ articleId: 1, sessionId: "abc" }),
      })
    )
    expect(db.state.deleteCount).toBe(0)
    expect(await res.json()).toEqual({ liked: true })
  })
})