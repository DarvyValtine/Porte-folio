import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { PublishToggle } from "@/components/admin/publish-toggle"

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

import { toast } from "sonner"

describe("PublishToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("shows the published state", () => {
    render(<PublishToggle published onToggle={vi.fn()} />)
    expect(screen.getByText("Publié")).toBeInTheDocument()
  })

  it("shows the draft state", () => {
    render(<PublishToggle published={false} onToggle={vi.fn()} />)
    expect(screen.getByText("Brouillon")).toBeInTheDocument()
  })

  it("toggles to draft and notifies on success", async () => {
    const onToggle = vi.fn().mockResolvedValue({ success: true })
    render(<PublishToggle published onToggle={onToggle} />)
    fireEvent.click(screen.getByRole("button"))
    expect(onToggle).toHaveBeenCalledWith(false)
    await act(async () => {})
    expect(toast.success).toHaveBeenCalledWith("Passé en brouillon")
  })

  it("toggles to published and notifies on success", async () => {
    const onToggle = vi.fn().mockResolvedValue({ success: true })
    render(<PublishToggle published={false} onToggle={onToggle} />)
    fireEvent.click(screen.getByRole("button"))
    expect(onToggle).toHaveBeenCalledWith(true)
    await act(async () => {})
    expect(toast.success).toHaveBeenCalledWith("Publié")
  })

  it("does not notify when the toggle fails", async () => {
    const onToggle = vi.fn().mockResolvedValue({ success: false, error: "Erreur" })
    render(<PublishToggle published onToggle={onToggle} />)
    fireEvent.click(screen.getByRole("button"))
    await act(async () => {})
    expect(toast.success).not.toHaveBeenCalled()
  })

  it("shows a pending state while toggling", async () => {
    let resolveToggle: (v: { success: boolean }) => void = () => {}
    const onToggle = vi.fn(
      () =>
        new Promise<{ success: boolean }>((resolve) => {
          resolveToggle = resolve
        })
    )
    render(<PublishToggle published onToggle={onToggle} />)
    fireEvent.click(screen.getByRole("button"))
    expect(screen.getByText("...")).toBeInTheDocument()
    expect(screen.getByRole("button")).toBeDisabled()
    await act(async () => resolveToggle({ success: true }))
  })
})