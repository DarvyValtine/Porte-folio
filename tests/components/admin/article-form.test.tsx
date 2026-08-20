import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

vi.mock("@uploadthing/react", () => ({
  generateReactHelpers: () => ({
    useUploadThing: vi.fn().mockImplementation((_endpoint, opts) => ({
      startUpload: vi.fn(async () => {
        const res = [{ url: "https://utfs.io/f/test.jpg" }]
        opts?.onClientUploadComplete?.(res)
        return res
      }),
      isUploading: false,
    })),
  }),
}))

import { ArticleForm } from "@/components/admin/article-form"

function contentTextarea(): HTMLTextAreaElement {
  return document.querySelector('textarea[name="content"]') as HTMLTextAreaElement
}

describe("ArticleForm", () => {
  it("submits the form fields in a FormData", async () => {
    const user = userEvent.setup()
    const action = vi.fn().mockResolvedValue({ success: true })
    render(<ArticleForm action={action} />)

    await user.type(screen.getByLabelText("Titre"), "Mon titre")
    await user.type(screen.getByLabelText("Slug (URL)"), "mon-titre")
    await user.type(screen.getByLabelText("Catégorie"), "Santé")
    await user.type(contentTextarea(), "## Contenu")

    await user.click(screen.getByRole("button", { name: "Créer l'article" }))
    await waitFor(() => expect(action).toHaveBeenCalled())

    const formData = action.mock.calls[0][1] as FormData
    expect(formData.get("title")).toBe("Mon titre")
    expect(formData.get("slug")).toBe("mon-titre")
    expect(formData.get("category")).toBe("Santé")
    expect(formData.get("content")).toBe("## Contenu")
  })

  it("shows the error returned by the action", async () => {
    const user = userEvent.setup()
    const action = vi.fn().mockResolvedValue({ error: "Le slug existe déjà" })
    render(<ArticleForm action={action} />)

    await user.type(screen.getByLabelText("Titre"), "Mon titre")
    await user.type(contentTextarea(), "Contenu valide")
    await user.click(screen.getByRole("button", { name: "Créer l'article" }))
    expect(await screen.findByText("Le slug existe déjà")).toBeInTheDocument()
  })

  it("pre-fills fields and labels the button when editing", () => {
    render(
      <ArticleForm
        article={{
          id: 1,
          title: "Titre existant",
          slug: "titre-existent",
          excerpt: null,
          content: "# Contenu",
          coverImage: null,
          coverImageCredit: null,
          category: null,
          published: true,
        }}
        action={vi.fn()}
      />
    )
    expect(screen.getByLabelText("Titre")).toHaveValue("Titre existant")
    expect(screen.getByLabelText("Slug (URL)")).toHaveValue("titre-existent")
    expect(screen.getByRole("button", { name: "Enregistrer les modifications" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox")).toBeChecked()
  })

  it("checks the published checkbox only when explicitly set", () => {
    render(
      <ArticleForm
        article={{
          id: 2,
          title: "Brouillon",
          slug: "brouillon",
          excerpt: null,
          content: "",
          coverImage: null,
          coverImageCredit: null,
          category: null,
          published: false,
        }}
        action={vi.fn()}
      />
    )
    expect(screen.getByRole("checkbox")).not.toBeChecked()
  })
})