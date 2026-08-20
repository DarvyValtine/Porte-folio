import { describe, expect, it, vi, afterEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { CommentsSection } from "@/components/comments-section"

describe("CommentsSection", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("loads and displays the existing comments", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async () => ({
          comments: [
            { id: 1, authorName: "Alice", content: "Très bon article", createdAt: "2026-08-01" },
          ],
        }),
      })
    )
    render(<CommentsSection articleId={1} />)
    expect(await screen.findByText("Alice")).toBeInTheDocument()
    expect(screen.getByText("Très bon article")).toBeInTheDocument()
    expect(screen.getByText("Commentaires (1)")).toBeInTheDocument()
  })

  it("disables the submit button while the fields are empty", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({ comments: [] }) }))
    render(<CommentsSection articleId={1} />)
    await screen.findByText("Commentaires (0)")
    expect(screen.getByRole("button", { name: "Envoyer" })).toBeDisabled()
  })

  it("posts a comment and prepends it to the list", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ json: async () => ({ comments: [] }) })
      .mockResolvedValueOnce({
        json: async () => ({
          comment: {
            id: 2,
            authorName: "Bob",
            content: "Super article",
            createdAt: "2026-08-02",
          },
        }),
      })
    vi.stubGlobal("fetch", fetchMock)

    const user = userEvent.setup()
    render(<CommentsSection articleId={2} />)
    await user.type(screen.getByPlaceholderText("Votre nom"), "Bob")
    await user.type(screen.getByPlaceholderText("Votre commentaire..."), "Super article")
    await user.click(screen.getByRole("button", { name: "Envoyer" }))

    expect(await screen.findByText("Bob")).toBeInTheDocument()
    expect(screen.getByText("Commentaires (1)")).toBeInTheDocument()
    expect(fetchMock).toHaveBeenLastCalledWith(
      "/api/comments",
      expect.objectContaining({ method: "POST" })
    )
  })
})