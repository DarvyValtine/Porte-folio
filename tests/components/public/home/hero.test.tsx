import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { Hero } from "@/components/home/hero"

const data = {
  badge: "Psychologue clinicienne",
  title: "Grâce Estia",
  subtitle: "Un sous-titre",
  ctaPrimary: "Prendre rendez-vous",
  ctaPrimaryLink: "/rdv",
  ctaSecondary: "En savoir plus",
  ctaSecondaryLink: "/a-propos",
  image: "/uploads/portrait.jpg",
}

describe("Hero", () => {
  it("renders the hero content and both call-to-action links", () => {
    render(<Hero data={data} />)
    expect(screen.getByText("Psychologue clinicienne")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Grâce Estia" })).toBeInTheDocument()
    expect(screen.getByText("Un sous-titre")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Prendre rendez-vous/ })).toHaveAttribute("href", "/rdv")
    expect(screen.getByRole("link", { name: "En savoir plus" })).toHaveAttribute("href", "/a-propos")
    expect(screen.getByAltText("Portrait de la psychologue")).toBeInTheDocument()
  })

  it("hides the subtitle and image when absent", () => {
    render(
      <Hero
        data={{ ...data, subtitle: "", image: "" }}
      />
    )
    expect(screen.queryByText("Un sous-titre")).not.toBeInTheDocument()
    expect(screen.queryByAltText("Portrait de la psychologue")).not.toBeInTheDocument()
  })
})