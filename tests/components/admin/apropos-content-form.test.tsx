import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { AProposContentForm } from "@/components/admin/apropos-content-form"

vi.mock("@/lib/actions/site-content", () => ({
  updateSiteContent: vi.fn(async () => undefined),
}))

vi.mock("@/components/admin/uploadthing-upload", () => ({
  UploadthingUpload: ({
    label,
    onChange,
  }: {
    label: string
    onChange: (url: string) => void
  }) => (
    <button type="button" onClick={() => onChange("https://cdn.test/photo.jpg")}>
      {label}
    </button>
  ),
}))

import { updateSiteContent } from "@/lib/actions/site-content"

const data = {
  headerEyebrow: "Sur-titre",
  headerTitle: "Titre",
  headerDescription: "Description",
  paragraph1: "Paragraphe 1",
  paragraph2: "Paragraphe 2",
  quote: "Citation",
  valuesTitle: "Valeurs",
  values: [{ title: "Écoute", text: "Texte" }],
  ctaText: "CTA",
  ctaLabel: "Contacter",
  ctaLink: "/rdv",
  image: "",
}

function openSection() {
  fireEvent.click(screen.getByRole("button", { name: /À propos/ }))
}

describe("AProposContentForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the fields, the values and the image upload", () => {
    render(<AProposContentForm data={data} />)
    openSection()
    const textboxes = screen.getAllByRole("textbox")
    expect(textboxes[0]).toHaveValue("Sur-titre")
    expect(textboxes[3]).toHaveValue("Paragraphe 1")
    expect(textboxes[6]).toHaveValue("Valeurs")
    expect(screen.getByPlaceholderText("Titre")).toHaveValue("Écoute")
    expect(screen.getByPlaceholderText("Texte")).toHaveValue("Texte")
    expect(screen.getByText("Image portrait")).toBeInTheDocument()
  })

  it("enables the save button after an edit", () => {
    render(<AProposContentForm data={data} />)
    openSection()
    fireEvent.change(screen.getAllByRole("textbox")[6], { target: { value: "Nouvelles valeurs" } })
    expect(screen.getByRole("button", { name: "Enregistrer" })).toBeEnabled()
  })

  it("adds and removes a value", () => {
    render(<AProposContentForm data={data} />)
    openSection()
    fireEvent.click(screen.getByRole("button", { name: "+ Ajouter une valeur" }))
    expect(screen.getAllByPlaceholderText("Titre")).toHaveLength(2)
    fireEvent.click(screen.getAllByRole("button", { name: "Supprimer" })[0])
    expect(screen.getAllByPlaceholderText("Titre")).toHaveLength(1)
  })

  it("edits every field, the values and the image, then saves", async () => {
    render(<AProposContentForm data={data} />)
    openSection()
    const t = screen.getAllByRole("textbox")
    const edits = ["Eyebrow", "Titre", "Desc", "P1", "P2", "Quote", "Valeurs"]
    for (let i = 0; i < 7; i++) {
      fireEvent.change(t[i], { target: { value: edits[i] } })
    }
    fireEvent.change(t[7], { target: { value: "Nouveau titre de valeur" } })
    fireEvent.change(t[8], { target: { value: "Nouveau texte de valeur" } })
    fireEvent.change(t[9], { target: { value: "Texte CTA" } })
    fireEvent.change(t[10], { target: { value: "Label CTA" } })
    fireEvent.change(t[11], { target: { value: "Lien CTA" } })
    fireEvent.click(screen.getByRole("button", { name: "Image portrait" }))

    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }))
    const [prev, fd] = vi.mocked(updateSiteContent).mock.calls[0]
    expect(prev).toBeUndefined()
    expect(fd.get("_key")).toBe("a_propos")
    const value = JSON.parse(String(fd.get("value")))
    expect(value.headerEyebrow).toBe("Eyebrow")
    expect(value.paragraph2).toBe("P2")
    expect(value.values).toEqual([{ title: "Nouveau titre de valeur", text: "Nouveau texte de valeur" }])
    expect(value.ctaLabel).toBe("Label CTA")
    expect(value.image).toBe("https://cdn.test/photo.jpg")
    await act(async () => {})
  })

  it("saves the form with the a_propos key", async () => {
    render(<AProposContentForm data={data} />)
    openSection()
    fireEvent.change(screen.getAllByRole("textbox")[6], { target: { value: "Nouvelles valeurs" } })
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }))
    expect(updateSiteContent).toHaveBeenCalledTimes(1)
    const [prev, fd] = vi.mocked(updateSiteContent).mock.calls[0]
    expect(prev).toBeUndefined()
    expect(fd.get("_key")).toBe("a_propos")
    const value = JSON.parse(String(fd.get("value")))
    expect(value.valuesTitle).toBe("Nouvelles valeurs")
    expect(value.values).toEqual([{ title: "Écoute", text: "Texte" }])
    await act(async () => {})
  })
})