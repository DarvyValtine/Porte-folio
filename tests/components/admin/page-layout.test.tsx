import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { AdminPageLayout } from "@/components/admin/page-layout"

describe("AdminPageLayout", () => {
  it("renders the title and children", () => {
    render(
      <AdminPageLayout title="Titre de la page">
        <p>Contenu</p>
      </AdminPageLayout>
    )
    expect(screen.getByRole("heading", { name: "Titre de la page" })).toBeInTheDocument()
    expect(screen.getByText("Contenu")).toBeInTheDocument()
  })

  it("renders a back link when backHref is provided", () => {
    render(
      <AdminPageLayout title="Titre" backHref="/admin/articles">
        <p>Contenu</p>
      </AdminPageLayout>
    )
    expect(screen.getByRole("link")).toHaveAttribute("href", "/admin/articles")
  })

  it("does not render a back link when backHref is absent", () => {
    render(
      <AdminPageLayout title="Titre">
        <p>Contenu</p>
      </AdminPageLayout>
    )
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
  })

  it("renders the actions", () => {
    render(
      <AdminPageLayout title="Titre" actions={<button>Action</button>}>
        <p>Contenu</p>
      </AdminPageLayout>
    )
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument()
  })
})