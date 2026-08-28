import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { SiteFooter } from "@/components/site-footer"

describe("SiteFooter", () => {
  it("renders the site name, tagline and navigation links", () => {
    render(<SiteFooter />)
    expect(screen.getByText("Grâce Estia")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Accueil" })).toHaveAttribute("href", "/")
    expect(screen.getByRole("link", { name: "Articles" })).toHaveAttribute("href", "/articles")
  })

  it("renders the contact links", () => {
    render(<SiteFooter />)
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("target", "_blank")
  })

  it("shows the current year in the copyright notice", () => {
    render(<SiteFooter />)
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()}`))).toBeInTheDocument()
  })
})