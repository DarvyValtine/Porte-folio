import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { HomeCta } from "@/components/home/cta"

const data = {
  title: "Prenez rendez-vous",
  body: "Un texte d'appel à l'action",
  buttonText: "Contacter",
  buttonLink: "/rdv",
}

describe("HomeCta", () => {
  it("renders the CTA content and links to the button destination", () => {
    render(<HomeCta data={data} />)
    expect(screen.getByRole("heading", { name: "Prenez rendez-vous" })).toBeInTheDocument()
    expect(screen.getByText("Un texte d'appel à l'action")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Contacter/ })).toHaveAttribute("href", "/rdv")
  })
})