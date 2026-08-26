import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { IntroSplit } from "@/components/home/intro-split"

const data = {
  eyebrow: "À propos",
  title: "Mon approche",
  body: "Un texte d'introduction",
  stats: [
    { value: "10", label: "ans d'expérience" },
    { value: "200", label: "patients" },
  ],
  ctaLabel: "Découvrir",
  ctaLink: "/a-propos",
  image: "/uploads/atelier.jpg",
}

describe("IntroSplit", () => {
  it("renders the introduction with stats and the CTA link", () => {
    render(<IntroSplit data={data} />)
    expect(screen.getByText("À propos")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Mon approche" })).toBeInTheDocument()
    expect(screen.getByText("Un texte d'introduction")).toBeInTheDocument()
    expect(screen.getByText("10")).toBeInTheDocument()
    expect(screen.getByText("ans d'expérience")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Découvrir/ })).toHaveAttribute("href", "/a-propos")
    expect(screen.getByAltText("Atelier communautaire de soutien")).toBeInTheDocument()
  })

  it("renders without an image", () => {
    render(<IntroSplit data={{ ...data, image: "" }} />)
    expect(screen.getByRole("heading", { name: "Mon approche" })).toBeInTheDocument()
    expect(screen.queryByAltText("Atelier communautaire de soutien")).not.toBeInTheDocument()
  })
})