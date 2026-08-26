import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { PageHeader } from "@/components/page-header"

describe("PageHeader", () => {
  it("renders the title and the optional eyebrow and description", () => {
    render(<PageHeader eyebrow="Sur-titre" title="Titre" description="Description" />)
    expect(screen.getByText("Sur-titre")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Titre" })).toBeInTheDocument()
    expect(screen.getByText("Description")).toBeInTheDocument()
  })

  it("renders only the title when the options are absent", () => {
    render(<PageHeader title="Seul titre" />)
    expect(screen.getByRole("heading", { name: "Seul titre" })).toBeInTheDocument()
    expect(screen.queryByText("Sur-titre")).not.toBeInTheDocument()
  })
})