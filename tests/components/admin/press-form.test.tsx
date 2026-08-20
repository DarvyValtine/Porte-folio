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

vi.mock("@/lib/actions/press", () => ({
  createPressItem: vi.fn(),
}))

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

import { PressForm } from "@/components/admin/press-form"
import { createPressItem } from "@/lib/actions/press"

describe("PressForm", () => {
  it("submits the title and outlet in a FormData", async () => {
    const user = userEvent.setup()
    vi.mocked(createPressItem).mockResolvedValue({ error: undefined })
    render(<PressForm />)

    await user.type(screen.getByLabelText("Titre *"), "Un article")
    await user.type(screen.getByLabelText("Média / Publication"), "Le Monde")
    await user.click(screen.getByRole("button", { name: "Ajouter l'article" }))

    await waitFor(() => expect(createPressItem).toHaveBeenCalled())
    const formData = vi.mocked(createPressItem).mock.calls[0][1] as FormData
    expect(formData.get("title")).toBe("Un article")
    expect(formData.get("outlet")).toBe("Le Monde")
  })

  it("shows the error returned by the action", async () => {
    const user = userEvent.setup()
    vi.mocked(createPressItem).mockResolvedValue({ error: "Le titre est requis" })
    render(<PressForm />)
    await user.type(screen.getByLabelText("Titre *"), "Un article")
    await user.click(screen.getByRole("button", { name: "Ajouter l'article" }))
    expect(await screen.findByText("Le titre est requis")).toBeInTheDocument()
  })
})