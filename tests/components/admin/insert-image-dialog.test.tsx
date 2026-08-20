import { describe, expect, it, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

vi.mock("@uploadthing/react", () => ({
  generateReactHelpers: () => ({
    useUploadThing: vi.fn().mockImplementation((_endpoint, opts) => ({
      startUpload: vi.fn(async ([file]) => {
        if (file.name.startsWith("err")) {
          opts?.onUploadError?.({ message: "upload failed" })
          return []
        }
        const res = [{ url: "https://utfs.io/f/test.jpg" }]
        opts?.onClientUploadComplete?.(res)
        return res
      }),
      isUploading: false,
    })),
  }),
}))

import { InsertImageDialog } from "@/components/admin/insert-image-dialog"

const url = "https://utfs.io/f/test.jpg"

describe("InsertImageDialog", () => {
  it("keeps the insert button disabled until an image is uploaded", () => {
    render(<InsertImageDialog open onOpenChange={() => {}} onInsert={() => {}} />)
    expect(screen.getByRole("button", { name: "Insérer" })).toBeDisabled()
  })

  it("calls onInsert with url, alt and position", async () => {
    const user = userEvent.setup()
    const onInsert = vi.fn()
    render(<InsertImageDialog open onOpenChange={() => {}} onInsert={onInsert} />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(["x"], "p.png", { type: "image/png" })
    fireEvent.change(input, { target: { files: [file] } })

    const insert = await screen.findByRole("button", { name: "Insérer" })
    await waitFor(() => expect(insert).toBeEnabled())

    await user.type(screen.getByLabelText("Texte alternatif"), "une photo")
    await user.click(screen.getByRole("combobox"))
    const option = await screen.findByRole("option", { name: "Avant le paragraphe" })
    await user.click(option)
    await user.click(insert)

    expect(onInsert).toHaveBeenCalledWith(url, "une photo", "before")
  })

  it("resets its state when reopened", async () => {
    const { rerender } = render(
      <InsertImageDialog open onOpenChange={() => {}} onInsert={() => {}} />
    )
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, {
      target: { files: [new File(["x"], "p.png", { type: "image/png" })] },
    })
    await waitFor(() => expect(screen.getByRole("button", { name: "Insérer" })).toBeEnabled())

    rerender(<InsertImageDialog open={false} onOpenChange={() => {}} onInsert={() => {}} />)
    rerender(<InsertImageDialog open onOpenChange={() => {}} onInsert={() => {}} />)
    expect(screen.getByRole("button", { name: "Insérer" })).toBeDisabled()
  })

  it("uses 'image' as default alt when the field is empty", async () => {
    const user = userEvent.setup()
    const onInsert = vi.fn()
    render(<InsertImageDialog open onOpenChange={() => {}} onInsert={onInsert} />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, {
      target: { files: [new File(["x"], "p.png", { type: "image/png" })] },
    })
    const insert = await screen.findByRole("button", { name: "Insérer" })
    await waitFor(() => expect(insert).toBeEnabled())
    await user.click(insert)

    expect(onInsert).toHaveBeenCalledWith(url, "image", "cursor")
  })

  it("closes the dialog via the cancel button", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<InsertImageDialog open onOpenChange={onOpenChange} onInsert={vi.fn()} />)
    await user.click(screen.getByRole("button", { name: "Annuler" }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("shows the upload error message", async () => {
    render(<InsertImageDialog open onOpenChange={() => {}} onInsert={vi.fn()} />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, {
      target: { files: [new File(["x"], "err.png", { type: "image/png" })] },
    })
    expect(await screen.findByText("upload failed")).toBeInTheDocument()
  })

  it("rejects non-image files", async () => {
    render(<InsertImageDialog open onOpenChange={() => {}} onInsert={vi.fn()} />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, {
      target: { files: [new File(["x"], "doc.pdf", { type: "application/pdf" })] },
    })
    expect(await screen.findByText("Fichier non valide")).toBeInTheDocument()
  })

  it("removes the preview before inserting", async () => {
    const user = userEvent.setup()
    render(<InsertImageDialog open onOpenChange={() => {}} onInsert={vi.fn()} />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(input, {
      target: { files: [new File(["x"], "p.png", { type: "image/png" })] },
    })
    const insert = await screen.findByRole("button", { name: "Insérer" })
    await waitFor(() => expect(insert).toBeEnabled())
    await user.click(screen.getByRole("button", { name: "" }))
    expect(insert).toBeDisabled()
  })
})