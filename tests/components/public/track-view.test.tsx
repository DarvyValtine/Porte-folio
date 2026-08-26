import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { TrackView } from "@/components/track-view"

describe("TrackView", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("posts the slug to the track-view endpoint on mount", () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal("fetch", fetchMock)
    render(<TrackView slug="mon-article" />)
    expect(fetchMock).toHaveBeenCalledWith("/api/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: "mon-article" }),
    })
  })

  it("swallows fetch errors", () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("réseau"))
    vi.stubGlobal("fetch", fetchMock)
    render(<TrackView slug="mon-article" />)
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
  })
})