import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

const pathname = vi.hoisted(() => ({ current: "/admin" }))
const router = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
}))
const authClient = vi.hoisted(() => ({ signOut: vi.fn() }))

vi.mock("next/navigation", () => ({
  usePathname: () => pathname.current,
  useRouter: () => router,
}))

vi.mock("@/lib/auth-client", () => ({
  authClient,
}))

const countResponse = { ok: true, json: async () => ({ pending: 3 }) }

describe("AdminSidebar", () => {
  beforeEach(() => {
    localStorage.clear()
    pathname.current = "/admin"
    router.push.mockClear()
    router.refresh.mockClear()
    authClient.signOut.mockClear()
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})))
  })

  afterEach(async () => {
    vi.unstubAllGlobals()
    await act(async () => {})
  })

  it("renders the navigation links and the sign out button", () => {
    render(<AdminSidebar mobileOpen={false} onClose={() => {}} />)
    expect(screen.getByRole("link", { name: "Tableau de bord" })).toHaveAttribute("href", "/admin")
    expect(screen.getByRole("link", { name: "Articles" })).toHaveAttribute("href", "/admin/articles")
    expect(screen.getByRole("link", { name: "Voir le site" })).toHaveAttribute("href", "/")
    expect(screen.getByRole("button", { name: "Déconnexion" })).toBeInTheDocument()
  })

  it("marks the exact link as active", () => {
    pathname.current = "/admin"
    render(<AdminSidebar mobileOpen={false} onClose={() => {}} />)
    expect(screen.getByRole("link", { name: "Tableau de bord" })).toHaveClass("bg-primary/10")
    expect(screen.getByRole("link", { name: "Articles" })).not.toHaveClass("bg-primary/10")
  })

  it("marks the parent link as active on a nested page", () => {
    pathname.current = "/admin/articles/3/edit"
    render(<AdminSidebar mobileOpen={false} onClose={() => {}} />)
    expect(screen.getByRole("link", { name: "Articles" })).toHaveClass("bg-primary/10")
    expect(screen.getByRole("link", { name: "Tableau de bord" })).not.toHaveClass("bg-primary/10")
  })

  it("restores the collapsed state from localStorage", () => {
    localStorage.setItem("admin-sidebar-collapsed", "true")
    render(<AdminSidebar mobileOpen={false} onClose={() => {}} />)
    expect(screen.getByRole("button", { name: "Développer" })).toBeInTheDocument()
  })

  it("persists the collapsed state and hides labels", () => {
    render(<AdminSidebar mobileOpen={false} onClose={() => {}} />)
    fireEvent.click(screen.getByRole("button", { name: "Réduire" }))
    expect(localStorage.getItem("admin-sidebar-collapsed")).toBe("true")
    expect(screen.getByRole("button", { name: "Développer" })).toBeInTheDocument()
    expect(screen.queryByText("Déconnexion")).not.toBeInTheDocument()
  })

  it("shows the pending appointment count badge", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(countResponse))
    render(<AdminSidebar mobileOpen={false} onClose={() => {}} />)
    expect(await screen.findByText("3")).toBeInTheDocument()
  })

  it("signs out and redirects to the sign-in page", async () => {
    authClient.signOut.mockResolvedValue(undefined)
    render(<AdminSidebar mobileOpen={false} onClose={() => {}} />)
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Déconnexion" }))
    })
    expect(authClient.signOut).toHaveBeenCalledTimes(1)
    expect(router.push).toHaveBeenCalledWith("/sign-in")
    expect(router.refresh).toHaveBeenCalled()
  })

  it("opens the mobile overlay and closes it via the backdrop", () => {
    const onClose = vi.fn()
    const { container } = render(<AdminSidebar mobileOpen onClose={onClose} />)
    const backdrop = container.querySelector('[class*="bg-black"]')
    expect(backdrop).not.toBeNull()
    fireEvent.click(backdrop as Element)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})