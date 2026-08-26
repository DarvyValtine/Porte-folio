import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { LatestArticles } from "@/components/home/latest-articles"

vi.mock("@/lib/queries", () => ({
  getPublishedArticles: vi.fn(),
}))

import { getPublishedArticles } from "@/lib/queries"

const articles = [
  {
    id: 1,
    userId: "1",
    slug: "article-1",
    title: "Premier article",
    excerpt: "Extrait",
    coverImage: "/uploads/a.jpg",
    coverImageCredit: null,
    category: "Bien-être",
    content: "Contenu",
    published: true,
    createdAt: new Date("2026-08-01T10:00:00Z"),
    updatedAt: new Date("2026-08-01T10:00:00Z"),
    views: 2,
  },
  {
    id: 2,
    userId: "1",
    slug: "article-2",
    title: "Second article",
    excerpt: null,
    coverImage: null,
    coverImageCredit: null,
    category: null,
    content: "Contenu",
    published: true,
    createdAt: new Date("2026-07-01T10:00:00Z"),
    updatedAt: new Date("2026-07-01T10:00:00Z"),
    views: 1,
  },
]

describe("LatestArticles", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the latest published articles", async () => {
    vi.mocked(getPublishedArticles).mockResolvedValue(articles)
    const element = await LatestArticles()
    render(element)
    expect(screen.getByText("Premier article")).toBeInTheDocument()
    expect(screen.getByText("Second article")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Tous les articles/ })).toHaveAttribute("href", "/articles")
  })

  it("renders nothing when there are no articles", async () => {
    vi.mocked(getPublishedArticles).mockResolvedValue([])
    const element = await LatestArticles()
    const { container } = render(element)
    expect(container).toBeEmptyDOMElement()
  })
})