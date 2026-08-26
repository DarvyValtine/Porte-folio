import { describe, expect, it, vi } from "vitest"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { useState } from "react"
import { Section, useSave } from "@/components/admin/form-helpers"

vi.mock("@/lib/actions/site-content", () => ({
  updateSiteContent: vi.fn(async () => undefined),
}))

import { updateSiteContent } from "@/lib/actions/site-content"

function SaveHarness() {
  const { save, saving } = useSave("cle_test")
  return (
    <button type="button" onClick={() => save({ title: "valeur" })}>
      {saving ? "Enregistrement..." : "Enregistrer"}
    </button>
  )
}

describe("Section", () => {
  it("is closed by default and reveals its content on click", () => {
    render(
      <Section title="Ma section">
        <p>Contenu</p>
      </Section>
    )
    expect(screen.queryByText("Contenu")).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: /Ma section/ }))
    expect(screen.getByText("Contenu")).toBeInTheDocument()
  })

  it("is open by default when defaultOpen is true", () => {
    render(
      <Section title="Ma section" defaultOpen>
        <p>Contenu</p>
      </Section>
    )
    expect(screen.getByText("Contenu")).toBeInTheDocument()
  })
})

describe("useSave", () => {
  it("calls updateSiteContent with the key and the JSON value", async () => {
    render(<SaveHarness />)
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }))
    expect(updateSiteContent).toHaveBeenCalledTimes(1)
    const [prev, fd] = vi.mocked(updateSiteContent).mock.calls[0]
    expect(prev).toBeUndefined()
    expect(fd.get("_key")).toBe("cle_test")
    expect(fd.get("value")).toBe(JSON.stringify({ title: "valeur" }))
    await act(async () => {})
  })

  it("shows the saving state while saving", async () => {
    let resolveSave: () => void = () => {}
    vi.mocked(updateSiteContent).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSave = () => resolve(undefined)
        })
    )
    render(<SaveHarness />)
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }))
    expect(screen.getByRole("button", { name: "Enregistrement..." })).toBeInTheDocument()
    await act(async () => resolveSave())
  })
})