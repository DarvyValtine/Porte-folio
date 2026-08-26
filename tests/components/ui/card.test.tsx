import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

describe("Card primitives", () => {
  it("renders a card with every sub-component", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Titre</CardTitle>
          <CardDescription>Description</CardDescription>
          <CardAction>
            <button>Action</button>
          </CardAction>
        </CardHeader>
        <CardContent>Contenu</CardContent>
        <CardFooter>Pied</CardFooter>
      </Card>
    )
    expect(screen.getByText("Titre")).toBeInTheDocument()
    expect(screen.getByText("Description")).toBeInTheDocument()
    expect(screen.getByText("Action")).toBeInTheDocument()
    expect(screen.getByText("Contenu")).toBeInTheDocument()
    expect(screen.getByText("Pied")).toBeInTheDocument()
    expect(screen.getByText("Titre").closest("[data-slot=card]")).toHaveAttribute("data-size", "default")
  })

  it("renders a small card", () => {
    render(<Card size="sm">Petit</Card>)
    expect(screen.getByText("Petit").closest("[data-slot=card]")).toHaveAttribute("data-size", "sm")
  })
})