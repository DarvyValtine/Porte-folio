import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { ArticleMarkdown } from "@/components/article-markdown"

describe("ArticleMarkdown", () => {
  it("renders headings and paragraphs", () => {
    render(
      <ArticleMarkdown content={"# Grand titre\n\n## Sous-titre\n\nUn paragraphe simple."} />
    )
    expect(screen.getByRole("heading", { level: 1, name: "Grand titre" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 2, name: "Sous-titre" })).toBeInTheDocument()
    expect(screen.getByText("Un paragraphe simple.")).toBeInTheDocument()
  })

  it("renders inline styles, links and images", () => {
    render(
      <ArticleMarkdown
        content={"Du **gras**, de l'*italique* et du `code`.\n\n[Visiter](https://exemple.fr)\n\n![Description](https://exemple.fr/i.jpg)"}
      />
    )
    const link = screen.getByRole("link", { name: "Visiter" })
    expect(link).toHaveAttribute("href", "https://exemple.fr")
    expect(link).toHaveAttribute("target", "_blank")
    const img = screen.getByRole("img", { name: "Description" })
    expect(img).toHaveAttribute("src", "https://exemple.fr/i.jpg")
    expect(img).toHaveAttribute("loading", "lazy")
  })

  it("renders lists and blockquotes", () => {
    render(
      <ArticleMarkdown content={"> Une citation\n\n- item un\n- item deux"} />
    )
    expect(screen.getByText("Une citation")).toBeInTheDocument()
    expect(screen.getByText("item un")).toBeInTheDocument()
    expect(screen.getByText("item deux")).toBeInTheDocument()
  })

  it("renders GFM tables", () => {
    render(
      <ArticleMarkdown content={"| Colonne A | Colonne B |\n| --- | --- |\n| 1 | 2 |"} />
    )
    expect(screen.getByText("Colonne A")).toBeInTheDocument()
    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("sanitizes raw HTML injected in the markdown", () => {
    render(<ArticleMarkdown content={"Texte <script>alert('xss')</script>"} />)
    expect(screen.getByText(/Texte/)).toBeInTheDocument()
    expect(document.querySelector("script")).toBeNull()
  })
})