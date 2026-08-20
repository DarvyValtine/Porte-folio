import { describe, expect, it, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"

vi.mock("@uploadthing/react", () => ({
  generateReactHelpers: () => ({
    useUploadThing: vi.fn().mockImplementation((_endpoint, opts) => ({
      startUpload: vi.fn(async ([file]) => {
        if (file.name.startsWith("err")) {
          opts?.onUploadError?.({ message: "upload failed" })
          return []
        }
        const res = [{ url: "https://utfs.io/f/ok.jpg" }]
        opts?.onClientUploadComplete?.(res)
        return res
      }),
      isUploading: false,
    })),
  }),
}))

import { UploadthingUpload } from "@/components/admin/uploadthing-upload"

function fileInput(): HTMLInputElement {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

describe("UploadthingUpload", () => {
  it("shows the dropzone when empty", () => {
    render(<UploadthingUpload name="cover" label="Image de couverture" />)
    expect(screen.getByText("Image de couverture")).toBeInTheDocument()
    expect(screen.getByText(/Cliquez ou déposez une image/)).toBeInTheDocument()
    expect(document.querySelector('input[name="cover"]')).toHaveValue("")
  })

  it("renders a default preview from defaultValue", () => {
    render(<UploadthingUpload name="cover" defaultValue="https://utfs.io/f/x.jpg" />)
    const img = document.querySelector("img[alt='Aperçu']") as HTMLImageElement
    expect(img).not.toBeNull()
    expect(img.src).toBe("https://utfs.io/f/x.jpg")
    expect(document.querySelector('input[name="cover"]')).toHaveValue("https://utfs.io/f/x.jpg")
  })

  it("uploads a file and stores the returned url", async () => {
    const onChange = vi.fn()
    render(<UploadthingUpload name="cover" onChange={onChange} />)
    const file = new File(["x"], "photo.png", { type: "image/png" })
    fireEvent.change(fileInput(), { target: { files: [file] } })
    await waitFor(() =>
      expect(document.querySelector('input[name="cover"]')).toHaveValue("https://utfs.io/f/ok.jpg")
    )
    await waitFor(() => expect(document.querySelector("img[alt='Aperçu']")).not.toBeNull())
    expect(onChange).toHaveBeenCalledWith("https://utfs.io/f/ok.jpg")
  })

  it("rejects non-image files", async () => {
    render(<UploadthingUpload name="cover" />)
    const file = new File(["x"], "doc.pdf", { type: "application/pdf" })
    fireEvent.change(fileInput(), { target: { files: [file] } })
    expect(await screen.findByText("Fichier non valide")).toBeInTheDocument()
  })

  it("rejects files larger than 5 MB", async () => {
    render(<UploadthingUpload name="cover" />)
    const big = new File([new Uint8Array(6 * 1024 * 1024)], "big.png", { type: "image/png" })
    fireEvent.change(fileInput(), { target: { files: [big] } })
    expect(await screen.findByText(/ne doit pas dépasser 5 Mo/)).toBeInTheDocument()
  })

  it("shows an upload error message", async () => {
    render(<UploadthingUpload name="cover" />)
    const file = new File(["x"], "err.png", { type: "image/png" })
    fireEvent.change(fileInput(), { target: { files: [file] } })
    expect(await screen.findByText("upload failed")).toBeInTheDocument()
  })

  it("clears the preview and value", () => {
    render(<UploadthingUpload name="cover" defaultValue="https://utfs.io/f/x.jpg" onChange={() => {}} />)
    fireEvent.click(screen.getByRole("button"))
    expect(document.querySelector('input[name="cover"]')).toHaveValue("")
    expect(document.querySelector("img[alt='Aperçu']")).toBeNull()
  })

  it("accepts a dropped file", async () => {
    render(<UploadthingUpload name="cover" />)
    const dropzone = screen
      .getByText(/Cliquez ou déposez une image/)
      .closest("div") as HTMLDivElement
    const file = new File(["x"], "photo.png", { type: "image/png" })
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } })
    await waitFor(() =>
      expect(document.querySelector('input[name="cover"]')).toHaveValue("https://utfs.io/f/ok.jpg")
    )
  })

  it("uploads without an onChange callback", async () => {
    render(<UploadthingUpload name="cover" />)
    const file = new File(["x"], "p.png", { type: "image/png" })
    fireEvent.change(fileInput(), { target: { files: [file] } })
    await waitFor(() =>
      expect(document.querySelector('input[name="cover"]')).toHaveValue("https://utfs.io/f/ok.jpg")
    )
  })
})