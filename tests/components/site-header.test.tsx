import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

vi.mock("next/navigation", () => ({
  usePathname: () => "/articles",
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

import { SiteHeader } from "@/components/site-header"

describe("SiteHeader", () => {
  it("renders the site name and the navigation links", () => {
    render(<SiteHeader />)
    expect(screen.getByText("Grâce Estia")).toBeInTheDocument()
    expect(screen.getByText("Accueil")).toBeInTheDocument()
    expect(screen.getByText("À propos")).toBeInTheDocument()
    expect(screen.getByText("Articles")).toBeInTheDocument()
    expect(screen.getByText("Presse")).toBeInTheDocument()
    expect(screen.getByText("Galerie")).toBeInTheDocument()
  })

  it("marks the link matching the current pathname as active", () => {
    render(<SiteHeader />)
    expect(screen.getByRole("link", { name: "Articles" })).toHaveClass("bg-secondary")
    expect(screen.getByRole("link", { name: "Accueil" })).not.toHaveClass("bg-secondary")
  })

  it("links to the appointment page", () => {
    render(<SiteHeader />)
    expect(screen.getByRole("link", { name: /Prendre rendez-vous/ })).toHaveAttribute("href", "/rdv")
  })

  it("opens and closes the mobile menu", async () => {
    const user = userEvent.setup()
    render(<SiteHeader />)
    expect(screen.getByRole("button", { name: "Ouvrir le menu" })).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Ouvrir le menu" }))
    expect(screen.getByRole("button", { name: "Fermer le menu" })).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Fermer le menu" }))
    expect(screen.getByRole("button", { name: "Ouvrir le menu" })).toBeInTheDocument()
  })
})