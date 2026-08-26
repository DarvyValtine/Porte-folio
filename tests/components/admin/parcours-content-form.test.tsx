import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { ParcoursContentForm } from "@/components/admin/parcours-content-form"

vi.mock("@/lib/actions/site-content", () => ({
  updateSiteContent: vi.fn(async () => undefined),
}))

import { updateSiteContent } from "@/lib/actions/site-content"

const data = {
  header: { eyebrow: "Sur-titre", title: "Titre", description: "Description" },
  reiper: { heading: "REIPER", items: [{ period: "2020", title: "Poste", org: "Organisation" }] },
  acbef: { heading: "ACBEF", subheading: "Sous-titre", items: [] },
  education: { heading: "Formation", items: [] },
  certifications: { heading: "Certifications", items: [] },
  engagements: { heading: "Engagements", items: [] },
  publications: { heading: "Publications", items: [] },
  expertise: { heading: "Expertise", items: [] },
}

function openSection() {
  fireEvent.click(screen.getByRole("button", { name: /Parcours & réalisations/ }))
}

describe("ParcoursContentForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the form with the initial data", () => {
    render(<ParcoursContentForm data={data} />)
    openSection()
    expect(screen.getByText("Toutes les sections du parcours sont sauvegardées ensemble.")).toBeInTheDocument()
    expect(screen.getAllByRole("textbox")[0]).toHaveValue("Sur-titre")
    expect(screen.getByRole("button", { name: "À jour" })).toBeDisabled()
  })

  it("enables the save button after an edit", () => {
    render(<ParcoursContentForm data={data} />)
    openSection()
    fireEvent.change(screen.getAllByRole("textbox")[0], { target: { value: "Nouveau" } })
    expect(screen.getByRole("button", { name: "Tout enregistrer" })).toBeEnabled()
  })

  it("adds and removes items in an array editor", () => {
    render(<ParcoursContentForm data={data} />)
    openSection()
    expect(screen.getAllByRole("button", { name: "Supprimer" })).toHaveLength(1)
    fireEvent.click(screen.getAllByRole("button", { name: "+ Ajouter" })[0])
    expect(screen.getAllByRole("button", { name: "Supprimer" })).toHaveLength(2)
    fireEvent.click(screen.getAllByRole("button", { name: "Supprimer" })[0])
    expect(screen.getAllByRole("button", { name: "Supprimer" })).toHaveLength(1)
  })

  it("adds and removes items in a string array editor", () => {
    render(<ParcoursContentForm data={data} />)
    openSection()
    const certificationAdd = screen.getAllByRole("button", { name: "+ Ajouter" })[3]
    fireEvent.click(certificationAdd)
    expect(screen.getAllByRole("button", { name: "×" })).toHaveLength(1)
    fireEvent.click(screen.getByRole("button", { name: "×" }))
    expect(screen.queryByRole("button", { name: "×" })).not.toBeInTheDocument()
  })

  it("edits the header, array items and string arrays, then saves", async () => {
    render(<ParcoursContentForm data={data} />)
    openSection()
    const t = screen.getAllByRole("textbox")
    for (let i = 0; i < 8; i++) {
      fireEvent.change(t[i], { target: { value: `v${i}` } })
    }
    fireEvent.change(t[8], { target: { value: "ACBEF" } })
    fireEvent.change(t[9], { target: { value: "Sous" } })
    fireEvent.change(t[11], { target: { value: "Certs" } })
    fireEvent.change(t[12], { target: { value: "Engagements" } })
    fireEvent.change(t[13], { target: { value: "Publications" } })
    fireEvent.change(t[14], { target: { value: "Expertise" } })

    const addButtons = () => screen.getAllByRole("button", { name: "+ Ajouter" })
    fireEvent.click(addButtons()[3])
    fireEvent.change(screen.getByPlaceholderText("Nom de la certification"), {
      target: { value: "Ma certification" },
    })

    fireEvent.click(addButtons()[4])
    fireEvent.change(screen.getByPlaceholderText("Description de l'engagement"), {
      target: { value: "Mon engagement" },
    })

    const beforePublication = screen.getAllByRole("textbox").length
    fireEvent.click(addButtons()[5])
    expect(screen.getAllByRole("textbox").length).toBe(beforePublication + 3)

    fireEvent.click(screen.getByRole("button", { name: "Tout enregistrer" }))
    const value = JSON.parse(String(vi.mocked(updateSiteContent).mock.calls[0][1].get("value")))
    expect(value.header.eyebrow).toBe("v0")
    expect(value.header.description).toBe("v2")
    expect(value.reiper.items).toEqual([{ period: "v4", title: "v5", org: "v6", text: "v7" }])
    expect(value.acbef.heading).toBe("ACBEF")
    expect(value.certifications.items).toEqual(["Ma certification"])
    expect(value.engagements.items).toEqual(["Mon engagement"])
    expect(value.publications.items).toEqual([{ title: "", source: "", url: "" }])
    await act(async () => {})
  })

  it("saves the whole parcours with the parcours key", async () => {
    render(<ParcoursContentForm data={data} />)
    openSection()
    fireEvent.change(screen.getAllByRole("textbox")[0], { target: { value: "Nouveau" } })
    fireEvent.click(screen.getByRole("button", { name: "Tout enregistrer" }))
    expect(updateSiteContent).toHaveBeenCalledTimes(1)
    const [prev, fd] = vi.mocked(updateSiteContent).mock.calls[0]
    expect(prev).toBeUndefined()
    expect(fd.get("_key")).toBe("parcours")
    const value = JSON.parse(String(fd.get("value")))
    expect(value.header.eyebrow).toBe("Nouveau")
    expect(value.reiper.items).toEqual([{ period: "2020", title: "Poste", org: "Organisation" }])
    await act(async () => {})
  })
})