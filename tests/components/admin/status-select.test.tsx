import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { StatusSelect } from "@/components/admin/status-select"

describe("StatusSelect", () => {
  it("shows the label of the current status", () => {
    render(<StatusSelect id={1} status="pending" onChange={vi.fn()} />)
    expect(screen.getByRole("combobox")).toHaveTextContent("En attente")
  })

  it("falls back to the raw status value for unknown statuses", () => {
    render(<StatusSelect id={1} status="archived" onChange={vi.fn()} />)
    expect(screen.getByRole("combobox")).toHaveTextContent("archived")
  })

  it("calls onChange with the new status", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn(async () => ({ success: true }))
    render(<StatusSelect id={5} status="pending" onChange={onChange} />)
    await user.click(screen.getByRole("combobox"))
    const option = await screen.findByRole("option", { name: "Contacté" })
    await user.click(option)
    expect(onChange).toHaveBeenCalledWith(5, "contacted")
  })
})