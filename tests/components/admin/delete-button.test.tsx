import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { DeleteButton } from "@/components/admin/delete-button"

describe("DeleteButton", () => {
  it("opens the confirmation dialog with the given message", async () => {
    const user = userEvent.setup()
    render(<DeleteButton onDelete={vi.fn()} confirmMessage="Supprimer cet élément ?" />)
    await user.click(screen.getByRole("button", { name: "Supprimer" }))
    expect(screen.getByText("Confirmer la suppression")).toBeInTheDocument()
    expect(screen.getByText("Supprimer cet élément ?")).toBeInTheDocument()
  })

  it("uses a default confirmation message when none is provided", async () => {
    const user = userEvent.setup()
    render(<DeleteButton onDelete={vi.fn()} />)
    await user.click(screen.getByRole("button", { name: "Supprimer" }))
    expect(screen.getByText(/Cette action est irréversible/)).toBeInTheDocument()
  })

  it("calls onDelete when confirming", async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn(async () => ({ success: true }))
    render(<DeleteButton onDelete={onDelete} />)
    await user.click(screen.getByRole("button", { name: "Supprimer" }))
    const confirm = screen.getAllByRole("button", { name: "Supprimer" })
    await user.click(confirm[confirm.length - 1])
    expect(onDelete).toHaveBeenCalled()
  })
})