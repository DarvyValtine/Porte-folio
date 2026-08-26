import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { FocusAreas } from "@/components/home/focus-areas"

const data = {
  eyebrow: "Domaines",
  title: "Mes domaines",
  items: [
    { icon: "HeartHandshake", title: "Thérapie", description: "Accompagnement" },
    { icon: "Shield", title: "Protection", description: "Enfance" },
  ],
}

describe("FocusAreas", () => {
  it("renders the section heading and each focus area", () => {
    render(<FocusAreas data={data} />)
    expect(screen.getByText("Domaines")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Mes domaines" })).toBeInTheDocument()
    expect(screen.getByText("Thérapie")).toBeInTheDocument()
    expect(screen.getByText("Accompagnement")).toBeInTheDocument()
    expect(screen.getByText("Protection")).toBeInTheDocument()
  })

  it("renders an icon for each focus area", () => {
    render(<FocusAreas data={data} />)
    const cards = screen.getAllByRole("heading", { name: /Thérapie|Protection/ })
    expect(cards).toHaveLength(2)
  })
})