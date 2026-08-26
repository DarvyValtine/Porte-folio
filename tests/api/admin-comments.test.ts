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
vi.mock("@/lib/db/schema", () => ({ articleComments: {} }))
vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: vi.fn() } },
}))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("next/headers", () => ({ headers: async () => new Headers() }))

import { DELETE } from "@/app/api/admin/comments/route"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

function deleteRequest(id: string) {
  return new NextRequest(`http://localhost/api/admin/comments?id=${id}`, {
    method: "DELETE",
  })
}

describe("DELETE /api/admin/comments", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    db.state.deleteCount = 0
  })

  it("returns 401 when there is no session", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)
    const res = await DELETE(deleteRequest("1"))
    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ error: "Non autorisé" })
    expect(db.state.deleteCount).toBe(0)
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it("deletes the comment and revalidates when authorized", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue({
      session: {
        id: "s1",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "1",
        expiresAt: new Date(),
        token: "tok",
      },
      user: {
        id: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
        email: "admin@exemple.fr",
        emailVerified: false,
        name: "Admin",
      },
    })
    const res = await DELETE(deleteRequest("1"))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
    expect(db.state.deleteCount).toBe(1)
    expect(revalidatePath).toHaveBeenCalledWith("/admin/articles")
  })
})