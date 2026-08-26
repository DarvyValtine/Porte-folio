import { describe, expect, it, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { AdminHeader } from "@/components/admin/admin-header"

const pathname = vi.hoisted(() => ({ current: "/admin" }))

vi.mock("next/navigation", () => ({
  usePathname: () => pathname.current,
}))

describe("AdminHeader", () => {
  it("renders the brand and links to the dashboard", () => {
    render(<AdminHeader onMenuClick={() => {}} />)
    expect(screen.getByRole("link", { name: "Grâce Estia" })).toHaveAttribute("href", "/admin")
  })

  it("shows the breadcrumb matching the longest path", () => {
    pathname.current = "/admin/articles/new"
    render(<AdminHeader onMenuClick={() => {}} />)
    expect(screen.getByText("Nouvel article")).toBeInTheDocument()
  })

  it("shows the breadcrumb for a nested admin page", () => {
    pathname.current = "/admin/articles"
    render(<AdminHeader onMenuClick={() => {}} />)
    expect(screen.getByText("Articles")).toBeInTheDocument()
  })

  it("hides the breadcrumb for unknown paths", () => {
    pathname.current = "/autre"
    render(<AdminHeader onMenuClick={() => {}} />)
    expect(screen.queryByText("/")).not.toBeInTheDocument()
  })

  it("calls onMenuClick when the menu button is pressed", () => {
    pathname.current = "/admin"
    const onMenuClick = vi.fn()
    render(<AdminHeader onMenuClick={onMenuClick} />)
    fireEvent.click(screen.getByRole("button", { name: "Menu" }))
    expect(onMenuClick).toHaveBeenCalledTimes(1)
  })
})