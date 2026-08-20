import { describe, expect, it, vi, afterEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { LikeButton } from "@/components/like-button"

describe("LikeButton", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    localStorage.clear()
  })

  it("loads the liked state from the API on mount", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ json: async () => ({ liked: true }) })
    )
    render(<LikeButton articleId={1} />)
    expect(await screen.findByText("Aimé")).toBeInTheDocument()
  })

  it("toggles the like state with a POST request", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ json: async () => ({ liked: false }) })
      .mockResolvedValueOnce({ json: async () => ({ liked: true }) })
    vi.stubGlobal("fetch", fetchMock)

    const user = userEvent.setup()
    render(<LikeButton articleId={1} />)
    await screen.findByRole("button", { name: "J'aime" })

    await user.click(screen.getByRole("button", { name: "J'aime" }))
    expect(await screen.findByText("Aimé")).toBeInTheDocument()
    expect(fetchMock).toHaveBeenLastCalledWith(
      "/api/likes",
      expect.objectContaining({ method: "POST" })
    )
  })

  it("sends the same session id on GET and POST", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ json: async () => ({ liked: false }) })
      .mockResolvedValueOnce({ json: async () => ({ liked: true }) })
    vi.stubGlobal("fetch", fetchMock)

    const user = userEvent.setup()
    render(<LikeButton articleId={7} />)
    await screen.findByRole("button", { name: "J'aime" })
    await user.click(screen.getByRole("button", { name: "J'aime" }))

    const sid = localStorage.getItem("_sid")
    expect(sid).toBeTruthy()
    const getCall = String(fetchMock.mock.calls[0][0])
    expect(getCall).toContain(`articleId=7`)
    expect(getCall).toContain(`sessionId=${sid}`)
    const postBody = JSON.parse(fetchMock.mock.calls[1][1].body)
    expect(postBody).toEqual({ articleId: 7, sessionId: sid })
  })
})