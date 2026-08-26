import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { PageHeaderContentForm } from "@/components/admin/page-header-content-form"

vi.mock("@/lib/actions/site-content", () => ({
  updateSiteContent: vi.fn(async () => undefined),
}))

import { updateSiteContent } from "@/lib/actions/site-content"

const data = { eyebrow: "Sur-titre", title: "Titre", description: "Description" }

function openSection() {
  fireEvent.click(screen.getByRole("button", { name: /En-tête de page/ }))
}

function textboxes() {
  return screen.getAllByRole("textbox")
}

describe("PageHeaderContentForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the fields with the initial data", () => {
    render(<PageHeaderContentForm sectionKey="articles_page" title="En-tête de page" data={data} />)
    openSection()
    const [eyebrow, title, description] = textboxes()
    expect(eyebrow).toHaveValue("Sur-titre")
    expect(title).toHaveValue("Titre")
    expect(description).toHaveValue("Description")
    expect(screen.getByRole("button", { name: "À jour" })).toBeDisabled()
  })

  it("enables the save button once a field changes", () => {
    render(<PageHeaderContentForm sectionKey="articles_page" title="En-tête de page" data={data} />)
    openSection()
    fireEvent.change(textboxes()[1], { target: { value: "Nouveau titre" } })
    expect(screen.getByRole("button", { name: "Enregistrer" })).toBeEnabled()
  })

  it("saves the section data with the section key", async () => {
    render(<PageHeaderContentForm sectionKey="articles_page" title="En-tête de page" data={data} />)
    openSection()
    fireEvent.change(textboxes()[1], { target: { value: "Nouveau titre" } })
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }))
    expect(updateSiteContent).toHaveBeenCalledTimes(1)
    const [prev, fd] = vi.mocked(updateSiteContent).mock.calls[0]
    expect(prev).toBeUndefined()
    expect(fd.get("_key")).toBe("articles_page")
    expect(JSON.parse(String(fd.get("value")))).toEqual({ ...data, title: "Nouveau titre" })
    await act(async () => {})
  })
})