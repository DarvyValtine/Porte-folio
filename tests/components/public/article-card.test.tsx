import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { ArticleCard } from "@/components/article-card"

const baseArticle = {
  slug: "mon-article",
  title: "Mon article",
  excerpt: "Un extrait",
  coverImage: "/uploads/couverture.jpg",
  category: "Psychologie",
  createdAt: "2026-08-01T10:00:00Z",
  views: 5,
}

describe("ArticleCard", () => {
  it("links to the article page and displays its content", () => {
    render(<ArticleCard article={baseArticle} />)
    expect(screen.getByRole("link")).toHaveAttribute("href", "/articles/mon-article")
    expect(screen.getByText("Mon article")).toBeInTheDocument()
    expect(screen.getByText("Un extrait")).toBeInTheDocument()
    expect(screen.getByText("Psychologie")).toBeInTheDocument()
    expect(screen.getByText("5 lectures")).toBeInTheDocument()
  })

  it("renders without an image, category or excerpt", () => {
    render(
      <ArticleCard
        article={{
          slug: "sans-image",
          title: "Sans image",
          excerpt: null,
          coverImage: null,
          category: null,
          createdAt: new Date("2026-01-15T10:00:00Z"),
          views: 1,
        }}
      />
    )
    expect(screen.getByText("Sans image")).toBeInTheDocument()
    expect(screen.getByText("1 lecture")).toBeInTheDocument()
    expect(screen.getByRole("link")).toBeInTheDocument()
  })
})