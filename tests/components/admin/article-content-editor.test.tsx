import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
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

import { ArticleContentEditor } from "@/components/admin/article-content-editor"

const url = "https://utfs.io/f/test.jpg"

function getTextarea(): HTMLTextAreaElement {
  return screen.getByRole("textbox") as HTMLTextAreaElement
}

function selectInTextarea(start: number, end: number) {
  const ta = getTextarea()
  ta.focus()
  ta.setSelectionRange(start, end)
  fireEvent.select(ta)
}

function pasteIntoTextarea(text: string, html?: string) {
  const ta = getTextarea()
  const clipboardData = {
    getData: (type: string) => (type === "text/html" ? html ?? "" : text),
  }
  fireEvent.paste(ta, { clipboardData })
}

async function uploadImageAndInsert(positionLabel: string) {
  await userEvent.click(screen.getByTitle("Insérer une image"))
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
  expect(fileInput).not.toBeNull()
  const file = new File(["x"], "photo.png", { type: "image/png" })
  fireEvent.change(fileInput, { target: { files: [file] } })
  const insertButton = await screen.findByRole("button", { name: "Insérer" })
  await waitFor(() => expect(insertButton).toBeEnabled())
  await userEvent.click(screen.getByRole("combobox"))
  const option = await screen.findByRole("option", { name: positionLabel })
  await userEvent.click(option)
  await userEvent.click(insertButton)
}

beforeEach(() => {
  vi.restoreAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe("ArticleContentEditor", () => {
  it("inserts H2 heading at the start of the line", async () => {
    render(<ArticleContentEditor name="content" />)
    await userEvent.type(getTextarea(), "Mon article")
    await userEvent.click(screen.getByTitle("Titre (H2)"))
    expect(getTextarea().value).toBe("## Mon article")
  })

  it("wraps the selection with bold markers", async () => {
    render(<ArticleContentEditor name="content" />)
    await userEvent.type(getTextarea(), "bonjour le monde")
    selectInTextarea(0, 7)
    await userEvent.click(screen.getByTitle("Gras"))
    expect(getTextarea().value).toBe("**bonjour** le monde")
  })

  it("wraps the selection with italic markers", async () => {
    render(<ArticleContentEditor name="content" />)
    await userEvent.type(getTextarea(), "hello")
    selectInTextarea(0, 5)
    await userEvent.click(screen.getByTitle("Italique"))
    expect(getTextarea().value).toBe("*hello*")
  })

  it("wraps the selection with inline code markers", async () => {
    render(<ArticleContentEditor name="content" />)
    await userEvent.type(getTextarea(), "const x = 1")
    selectInTextarea(0, 11)
    await userEvent.click(screen.getByTitle("Code"))
    expect(getTextarea().value).toBe("`const x = 1`")
  })

  it("prefixes the current line with a bullet", async () => {
    render(<ArticleContentEditor name="content" />)
    await userEvent.type(getTextarea(), "element")
    await userEvent.click(screen.getByTitle("Liste à puces"))
    expect(getTextarea().value).toBe("- element")
  })

  it("prefixes the current line with a numbered marker", async () => {
    render(<ArticleContentEditor name="content" />)
    await userEvent.type(getTextarea(), "element")
    await userEvent.click(screen.getByTitle("Liste numérotée"))
    expect(getTextarea().value).toBe("1. element")
  })

  it("turns the current line into a blockquote", async () => {
    render(<ArticleContentEditor name="content" />)
    await userEvent.type(getTextarea(), "citation")
    await userEvent.click(screen.getByTitle("Citation"))
    expect(getTextarea().value).toBe("> citation")
  })

  it("inserts a separator block", async () => {
    render(<ArticleContentEditor name="content" />)
    await userEvent.click(screen.getByTitle("Séparateur"))
    expect(getTextarea().value).toContain("---")
  })

  it("inserts a markdown table", async () => {
    render(<ArticleContentEditor name="content" />)
    await userEvent.click(screen.getByTitle("Tableau"))
    const value = getTextarea().value
    expect(value).toContain("| Colonne 1 | Colonne 2 |")
    expect(value).toContain("| --- | --- |")
  })

  it("inserts a link via window.prompt", async () => {
    vi.spyOn(window, "prompt").mockReturnValue("https://example.com")
    render(<ArticleContentEditor name="content" />)
    await userEvent.type(getTextarea(), "voir ici")
    selectInTextarea(0, 8)
    await userEvent.click(screen.getByTitle("Lien"))
    expect(getTextarea().value).toBe("[voir ici](https://example.com)")
  })

  it("does nothing when the link prompt is cancelled", async () => {
    vi.spyOn(window, "prompt").mockReturnValue(null)
    render(<ArticleContentEditor name="content" />)
    await userEvent.type(getTextarea(), "texte")
    await userEvent.click(screen.getByTitle("Lien"))
    expect(getTextarea().value).toBe("texte")
  })

  it("converts pasted HTML to markdown", async () => {
    render(<ArticleContentEditor name="content" />)
    pasteIntoTextarea("plain", '<p>Bonjour <b>tout</b> le monde</p>')
    expect(getTextarea().value).toBe("Bonjour **tout** le monde")
  })

  it("pastes plain text when the html clipboard is absent", async () => {
    render(<ArticleContentEditor name="content" />)
    pasteIntoTextarea("Juste du texte simple")
    expect(getTextarea().value).toBe("Juste du texte simple")
  })

  it("pastes plain text when the paste-as-text toggle is active", async () => {
    render(<ArticleContentEditor name="content" />)
    await userEvent.click(screen.getByTitle(/Coller en texte brut/))
    pasteIntoTextarea("plain", "<p>Bonjour <b>tout</b></p>")
    expect(getTextarea().value).toBe("plain")
  })

  it("replaces the current selection when pasting", async () => {
    render(<ArticleContentEditor name="content" />)
    await userEvent.type(getTextarea(), "avant selection apres")
    selectInTextarea(6, 15)
    pasteIntoTextarea("colle")
    expect(getTextarea().value).toBe("avant colle apres")
  })

  it("inserts an uploaded image at the cursor position", async () => {
    render(<ArticleContentEditor name="content" />)
    await userEvent.type(getTextarea(), "premier paragraphe.")
    await uploadImageAndInsert("À la position du curseur")
    expect(getTextarea().value).toBe(`premier paragraphe.![image](${url})`)
  })

  it("inserts an uploaded image before the paragraph containing the cursor", async () => {
    const initial = "Premier paragraphe.\n\nSecond paragraphe."
    render(<ArticleContentEditor name="content" defaultValue={initial} />)
    selectInTextarea(initial.indexOf("Second"), initial.indexOf("Second"))
    await uploadImageAndInsert("Avant le paragraphe")
    expect(getTextarea().value).toBe(
      `Premier paragraphe.\n\n![image](${url})\n\nSecond paragraphe.`,
    )
  })

  it("inserts an uploaded image after the paragraph containing the cursor", async () => {
    const initial = "Premier paragraphe.\n\nSecond paragraphe."
    render(<ArticleContentEditor name="content" defaultValue={initial} />)
    selectInTextarea(initial.indexOf("Second"), initial.indexOf("Second"))
    await uploadImageAndInsert("Après le paragraphe")
    expect(getTextarea().value).toBe(
      `Premier paragraphe.\n\nSecond paragraphe.\n\n![image](${url})`,
    )
  })

  it("keeps the textarea mounted when switching to the preview tab", async () => {
    render(<ArticleContentEditor name="content" defaultValue={"# Titre\n\nParagraphe."} />)
    await userEvent.click(screen.getByRole("tab", { name: "Aperçu" }))
    expect(screen.getByText("Paragraphe.")).toBeInTheDocument()
    const ta = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement
    expect(ta).toBeInTheDocument()
    expect(ta.value).toContain("# Titre")
  })

  it("switches back to the edit tab from preview", async () => {
    render(<ArticleContentEditor name="content" defaultValue="contenu" />)
    await userEvent.click(screen.getByRole("tab", { name: "Aperçu" }))
    await userEvent.click(screen.getByRole("tab", { name: "Édition" }))
    expect(screen.getByRole("textbox")).toBeInTheDocument()
    expect(getTextarea().value).toBe("contenu")
  })

  it("inserts an H3 subheading", async () => {
    render(<ArticleContentEditor name="content" />)
    await userEvent.type(getTextarea(), "sous-titre")
    await userEvent.click(screen.getByTitle("Sous-titre (H3)"))
    expect(getTextarea().value).toBe("### sous-titre")
  })

  it("shows a hint when previewing empty content", async () => {
    render(<ArticleContentEditor name="content" />)
    await userEvent.click(screen.getByRole("tab", { name: "Aperçu" }))
    expect(screen.getByText(/Le contenu est vide/)).toBeInTheDocument()
  })

  it("inserts the placeholder when bolding with no selection", async () => {
    render(<ArticleContentEditor name="content" />)
    await userEvent.click(screen.getByTitle("Gras"))
    expect(getTextarea().value).toBe("**texte**")
  })

  it("uses 'lien' as link text when nothing is selected", async () => {
    vi.spyOn(window, "prompt").mockReturnValue("https://example.com")
    render(<ArticleContentEditor name="content" />)
    await userEvent.click(screen.getByTitle("Lien"))
    expect(getTextarea().value).toBe("[lien](https://example.com)")
  })

  it("keeps plain text when the pasted html converts to empty markdown", async () => {
    render(<ArticleContentEditor name="content" />)
    pasteIntoTextarea("du texte", "<style>.x{}</style>")
    expect(getTextarea().value).toBe("du texte")
  })

  it("does nothing when pasting an empty plain text", async () => {
    render(<ArticleContentEditor name="content" defaultValue="déjà là" />)
    pasteIntoTextarea("", "")
    expect(getTextarea().value).toBe("déjà là")
  })

  it("leaves empty lines untouched when applying a bullet list", async () => {
    render(<ArticleContentEditor name="content" />)
    await userEvent.type(getTextarea(), "premier\n\nsecond")
    selectInTextarea(0, 15)
    await userEvent.click(screen.getByTitle("Liste à puces"))
    expect(getTextarea().value).toBe("- premier\n\n- second")
  })

  it("inserts an image before the first paragraph", async () => {
    const initial = "Premier paragraphe.\n\nSecond paragraphe."
    render(<ArticleContentEditor name="content" defaultValue={initial} />)
    selectInTextarea(0, 0)
    await uploadImageAndInsert("Avant le paragraphe")
    expect(getTextarea().value).toBe(`![image](${url})\n\n${initial}`)
  })

  it("inserts an image after a paragraph that is followed by another one", async () => {
    const initial = "Premier paragraphe.\n\nSecond paragraphe."
    render(<ArticleContentEditor name="content" defaultValue={initial} />)
    selectInTextarea(0, 0)
    await uploadImageAndInsert("Après le paragraphe")
    expect(getTextarea().value).toBe(
      `Premier paragraphe.\n\n![image](${url})\n\nSecond paragraphe.`,
    )
  })
})