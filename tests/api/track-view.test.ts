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
vi.mock("@/lib/db/schema", () => ({ articles: {} }))

import { POST } from "@/app/api/track-view/route"

describe("POST /api/track-view", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    db.state.updateCount = 0
  })

  it("returns 400 when the slug is missing", async () => {
    const res = await POST(
      new NextRequest("http://localhost/api/track-view", {
        method: "POST",
        body: JSON.stringify({}),
      })
    )
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: "Slug requis" })
    expect(db.state.updateCount).toBe(0)
  })

  it("returns 400 when the slug is not a string", async () => {
    const res = await POST(
      new NextRequest("http://localhost/api/track-view", {
        method: "POST",
        body: JSON.stringify({ slug: 123 }),
      })
    )
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: "Slug requis" })
  })

  it("increments the view count for a valid slug", async () => {
    const res = await POST(
      new NextRequest("http://localhost/api/track-view", {
        method: "POST",
        body: JSON.stringify({ slug: "mon-article" }),
      })
    )
    expect(db.state.updateCount).toBe(1)
    expect(await res.json()).toEqual({ ok: true })
  })
})