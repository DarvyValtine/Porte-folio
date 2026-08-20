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

vi.mock("@/lib/actions/gallery", () => ({
  createGalleryItem: vi.fn(),
}))

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

import { GalleryForm } from "@/components/admin/gallery-form"
import { createGalleryItem } from "@/lib/actions/gallery"

describe("GalleryForm", () => {
  it("submits the title and sort order in a FormData", async () => {
    const user = userEvent.setup()
    vi.mocked(createGalleryItem).mockResolvedValue({ error: undefined })
    render(<GalleryForm />)

    await user.type(screen.getByLabelText("Titre"), "Une photo")
    await user.clear(screen.getByLabelText("Ordre"))
    await user.type(screen.getByLabelText("Ordre"), "2")
    await user.click(screen.getByRole("button", { name: "Ajouter la photo" }))

    await waitFor(() => expect(createGalleryItem).toHaveBeenCalled())
    const formData = vi.mocked(createGalleryItem).mock.calls[0][1] as FormData
    expect(formData.get("title")).toBe("Une photo")
    expect(formData.get("sortOrder")).toBe("2")
  })

  it("shows the error returned by the action", async () => {
    const user = userEvent.setup()
    vi.mocked(createGalleryItem).mockResolvedValue({ error: "Image requise" })
    render(<GalleryForm />)
    await user.click(screen.getByRole("button", { name: "Ajouter la photo" }))
    expect(await screen.findByText("Image requise")).toBeInTheDocument()
  })
})