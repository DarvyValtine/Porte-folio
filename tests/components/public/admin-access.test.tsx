import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { render, fireEvent } from "@testing-library/react"
import { AdminAccess } from "@/components/admin-access"

const router = { push: vi.fn() }

vi.mock("next/navigation", () => ({
  useRouter: () => router,
}))

describe("AdminAccess", () => {
  beforeEach(() => {
    router.push.mockClear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("renders nothing", () => {
    const { container } = render(<AdminAccess />)
    expect(container).toBeEmptyDOMElement()
  })

  it("redirects to sign-in on ctrl+shift+a", () => {
    render(<AdminAccess />)
    const event = new KeyboardEvent("keydown", {
      ctrlKey: true,
      shiftKey: true,
      key: "a",
      cancelable: true,
    })
    fireEvent(window, event)
    expect(router.push).toHaveBeenCalledWith("/sign-in")
  })

  it("redirects on meta+shift+a", () => {
    render(<AdminAccess />)
    const event = new KeyboardEvent("keydown", {
      metaKey: true,
      shiftKey: true,
      key: "a",
    })
    fireEvent(window, event)
    expect(router.push).toHaveBeenCalledWith("/sign-in")
  })

  it("ignores other key combinations", () => {
    render(<AdminAccess />)
    fireEvent(
      window,
      new KeyboardEvent("keydown", { ctrlKey: true, shiftKey: true, key: "b" })
    )
    fireEvent(
      window,
      new KeyboardEvent("keydown", { ctrlKey: true, key: "a" })
    )
    expect(router.push).not.toHaveBeenCalled()
  })
})