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
vi.mock("@/lib/db/schema", () => ({ appointments: {} }))
vi.mock("@/lib/auth", () => ({ auth: { api: { getSession: vi.fn() } } }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("next/headers", () => ({ headers: async () => new Headers() }))

import {
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from "@/lib/actions/appointments"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

function fd(entries: Record<string, string>) {
  const form = new FormData()
  for (const [k, v] of Object.entries(entries)) form.set(k, v)
  return form
}

describe("createAppointment", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    db.state.insertCount = 0
    vi.mocked(auth.api.getSession).mockResolvedValue({ user: { id: "u1" } } as any)
  })

  it("returns fieldErrors on invalid data", async () => {
    const res = await createAppointment(
      undefined,
      fd({ name: "a", email: "bad", message: "court" })
    )
    expect(res?.fieldErrors).toBeDefined()
    expect(db.state.insertCount).toBe(0)
  })

  it("inserts and returns success on valid data", async () => {
    const res = await createAppointment(
      undefined,
      fd({
        name: "Alice",
        email: "alice@exemple.fr",
        message: "Je souhaite prendre rendez-vous",
        typeId: "2",
      })
    )
    expect(res).toEqual({ success: true })
    expect(db.state.insertCount).toBe(1)
    expect(revalidatePath).toHaveBeenCalledWith("/admin/rdv")
  })
})

describe("updateAppointmentStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    db.state.updateCount = 0
    vi.mocked(auth.api.getSession).mockResolvedValue({ user: { id: "u1" } } as any)
  })

  it("throws when unauthenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)
    await expect(updateAppointmentStatus(1, "contacted")).rejects.toThrow("Non autorisé")
  })

  it("updates and returns success", async () => {
    const res = await updateAppointmentStatus(1, "closed")
    expect(res).toEqual({ success: true })
    expect(db.state.updateCount).toBe(1)
    expect(revalidatePath).toHaveBeenCalledWith("/admin/rdv")
  })
})

describe("deleteAppointment", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    db.state.deleteCount = 0
    vi.mocked(auth.api.getSession).mockResolvedValue({ user: { id: "u1" } } as any)
  })

  it("throws when unauthenticated", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null)
    await expect(deleteAppointment(1)).rejects.toThrow("Non autorisé")
  })

  it("deletes and returns success", async () => {
    const res = await deleteAppointment(3)
    expect(res).toEqual({ success: true })
    expect(db.state.deleteCount).toBe(1)
    expect(revalidatePath).toHaveBeenCalledWith("/admin/rdv")
  })
})
