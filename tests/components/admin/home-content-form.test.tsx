import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { HomeContentForm } from "@/components/admin/home-content-form"

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
    <button type="button" onClick={() => onChange("https://cdn.test/image.jpg")}>
      {label}
    </button>
  ),
}))

import { updateSiteContent } from "@/lib/actions/site-content"

const hero = {
  badge: "Badge",
  title: "Titre",
  subtitle: "Sous-titre",
  ctaPrimary: "Bouton 1",
  ctaPrimaryLink: "/rdv",
  ctaSecondary: "Bouton 2",
  ctaSecondaryLink: "/a-propos",
  image: "",
}
const intro = {
  eyebrow: "Sur-titre",
  title: "Titre intro",
  body: "Texte",
  stats: [{ value: "5", label: "ans" }],
  ctaLabel: "En savoir plus",
  ctaLink: "/parcours",
  image: "",
}
const focusAreas = {
  eyebrow: "Domaines",
  title: "Titre domaines",
  items: [{ icon: "HeartHandshake", title: "Thérapie", description: "Description" }],
}
const cta = { title: "CTA titre", body: "CTA texte", buttonText: "Contacter", buttonLink: "/rdv" }

function openSection(name: RegExp) {
  fireEvent.click(screen.getByRole("button", { name }))
}

describe("HomeContentForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders the four editable sections", () => {
    render(<HomeContentForm hero={hero} intro={intro} focusAreas={focusAreas} cta={cta} />)
    openSection(/Bannière principale/)
    expect(screen.getAllByRole("textbox")[0]).toHaveValue("Badge")
    expect(screen.getByText("Image")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "À jour" })).toBeDisabled()
  })

  it("saves the hero section", async () => {
    vi.useFakeTimers()
    render(<HomeContentForm hero={hero} intro={intro} focusAreas={focusAreas} cta={cta} />)
    openSection(/Bannière principale/)
    fireEvent.change(screen.getAllByRole("textbox")[0], { target: { value: "Nouveau badge" } })
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }))
    await act(async () => {
      await vi.runAllTimersAsync()
    })
    expect(updateSiteContent).toHaveBeenCalledTimes(1)
    const [prev, fd] = vi.mocked(updateSiteContent).mock.calls[0]
    expect(prev).toBeUndefined()
    expect(fd.get("_key")).toBe("home_hero")
    expect(JSON.parse(String(fd.get("value"))).badge).toBe("Nouveau badge")
  })

  it("adds and removes a focus area", () => {
    render(<HomeContentForm hero={hero} intro={intro} focusAreas={focusAreas} cta={cta} />)
    openSection(/Domaines d'intervention/)
    expect(screen.getByPlaceholderText("Titre")).toHaveValue("Thérapie")
    fireEvent.click(screen.getByRole("button", { name: "+ Ajouter un domaine" }))
    expect(screen.getAllByPlaceholderText("Titre")).toHaveLength(2)
    fireEvent.click(screen.getAllByRole("button", { name: "Supprimer" })[0])
    expect(screen.getAllByPlaceholderText("Titre")).toHaveLength(1)
  })

  it("saves the whole hero section including the image", async () => {
    vi.useFakeTimers()
    render(<HomeContentForm hero={hero} intro={intro} focusAreas={focusAreas} cta={cta} />)
    openSection(/Bannière principale/)
    const t = screen.getAllByRole("textbox")
    const edits = ["Badge", "Titre", "Sous-titre", "B1", "L1", "B2", "L2"]
    for (let i = 0; i < 7; i++) {
      fireEvent.change(t[i], { target: { value: edits[i] } })
    }
    fireEvent.click(screen.getAllByRole("button", { name: "Image" })[0])
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }))
    await act(async () => {
      await vi.runAllTimersAsync()
    })
    expect(updateSiteContent).toHaveBeenCalledTimes(1)
    const [prev, fd] = vi.mocked(updateSiteContent).mock.calls[0]
    expect(prev).toBeUndefined()
    expect(fd.get("_key")).toBe("home_hero")
    const value = JSON.parse(String(fd.get("value")))
    expect(value.badge).toBe("Badge")
    expect(value.ctaSecondaryLink).toBe("L2")
    expect(value.image).toBe("https://cdn.test/image.jpg")
  })

  it("saves the intro section", async () => {
    vi.useFakeTimers()
    render(<HomeContentForm hero={hero} intro={intro} focusAreas={focusAreas} cta={cta} />)
    openSection(/Section d'introduction/)
    const t = screen.getAllByRole("textbox")
    fireEvent.change(t[0], { target: { value: "Nouveau sur-titre" } })
    fireEvent.change(t[1], { target: { value: "Nouveau titre" } })
    fireEvent.change(t[2], { target: { value: "Nouveau texte" } })
    fireEvent.change(t[3], { target: { value: "Nouveau label" } })
    fireEvent.change(t[4], { target: { value: "Nouveau lien" } })
    fireEvent.click(screen.getAllByRole("button", { name: "Image" })[0])
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }))
    await act(async () => {
      await vi.runAllTimersAsync()
    })
    const value = JSON.parse(String(vi.mocked(updateSiteContent).mock.calls[0][1].get("value")))
    expect(value.eyebrow).toBe("Nouveau sur-titre")
    expect(value.image).toBe("https://cdn.test/image.jpg")
  })

  it("edits focus areas, picks an icon and saves", async () => {
    const user = userEvent.setup()
    render(<HomeContentForm hero={hero} intro={intro} focusAreas={focusAreas} cta={cta} />)
    openSection(/Domaines d'intervention/)
    const t = screen.getAllByRole("textbox")
    fireEvent.change(t[0], { target: { value: "Nouveau domaine" } })
    fireEvent.change(screen.getByPlaceholderText("Titre"), { target: { value: "Thérapie" } })
    fireEvent.change(screen.getByPlaceholderText("Description"), { target: { value: "Nouvelle description" } })

    await user.click(screen.getByRole("combobox"))
    const option = await screen.findByRole("option", { name: /Shield/ })
    await user.click(option)

    vi.useFakeTimers()
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }))
    await act(async () => {
      await vi.runAllTimersAsync()
    })
    const value = JSON.parse(String(vi.mocked(updateSiteContent).mock.calls[0][1].get("value")))
    expect(value.eyebrow).toBe("Nouveau domaine")
    expect(value.items).toEqual([{ icon: "Shield", title: "Thérapie", description: "Nouvelle description" }])
  })

  it("saves the CTA section", async () => {
    vi.useFakeTimers()
    render(<HomeContentForm hero={hero} intro={intro} focusAreas={focusAreas} cta={cta} />)
    openSection(/Appel à l'action/)
    fireEvent.change(screen.getAllByRole("textbox")[0], { target: { value: "Nouveau CTA" } })
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }))
    await act(async () => {
      await vi.runAllTimersAsync()
    })
    expect(updateSiteContent).toHaveBeenCalledTimes(1)
    const [prev, fd] = vi.mocked(updateSiteContent).mock.calls[0]
    expect(prev).toBeUndefined()
    expect(fd.get("_key")).toBe("home_cta")
    expect(JSON.parse(String(fd.get("value"))).title).toBe("Nouveau CTA")
  })
})