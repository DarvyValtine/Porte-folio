import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { SuggestedArticles } from "@/components/suggested-articles"

vi.mock("@/lib/queries", () => ({
  getSuggestedArticles: vi.fn(),
}))

import { getSuggestedArticles } from "@/lib/queries"

const articles = [
  {
    id: 1,
    userId: "1",
    slug: "suggere-1",
    title: "Article suggéré",
    excerpt: "Extrait",
    coverImage: "/uploads/a.jpg",
    coverImageCredit: null,
    category: "Psychologie",
    content: "Contenu",
    published: true,
    createdAt: new Date("2026-08-01T10:00:00Z"),
    updatedAt: new Date("2026-08-01T10:00:00Z"),
    views: 3,
  },
]

describe("SuggestedArticles", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the suggested articles for the current article", async () => {
    vi.mocked(getSuggestedArticles).mockResolvedValue(articles)
    const element = await SuggestedArticles({ currentSlug: "article-actuel" })
    render(element)
    expect(getSuggestedArticles).toHaveBeenCalledWith("article-actuel")
    expect(screen.getByText("Suggestions de lecture")).toBeInTheDocument()
    expect(screen.getByText("Article suggéré")).toBeInTheDocument()
  })

  it("renders nothing when there are no suggestions", async () => {
    vi.mocked(getSuggestedArticles).mockResolvedValue([])
    const element = await SuggestedArticles({ currentSlug: "article-actuel" })
    const { container } = render(element)
    expect(container).toBeEmptyDOMElement()
  })
})