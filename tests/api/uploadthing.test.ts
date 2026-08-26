import { describe, expect, it, vi } from "vitest"

vi.mock("uploadthing/next", () => ({
  createRouteHandler: vi.fn(() => ({ GET: vi.fn(), POST: vi.fn() })),
}))
vi.mock("@/lib/uploadthing", () => ({ fileRouter: {} }))

import { GET, POST } from "@/app/api/uploadthing/route"
import { createRouteHandler } from "uploadthing/next"

describe("app/api/uploadthing/route", () => {
  it("exports GET and POST handlers", () => {
    expect(GET).toBeTypeOf("function")
    expect(POST).toBeTypeOf("function")
  })

  it("creates the route handler with the file router", () => {
    expect(createRouteHandler).toHaveBeenCalledWith({ router: expect.any(Object) })
  })
})