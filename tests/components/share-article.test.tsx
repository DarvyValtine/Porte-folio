import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ShareArticle } from "@/components/share-article"

const writeText = vi.fn()

async function setupUser() {
  const user = userEvent.setup()
  Object.defineProperty(window.navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  })
  return user
}

describe("ShareArticle", () => {
  it("opens the dropdown with the social links", async () => {
    const user = await setupUser()
    render(<ShareArticle url="https://exemple.fr/a" title="Mon article" />)

    expect(screen.queryByText("Facebook")).not.toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Partager" }))

    expect(screen.getByText("Facebook")).toBeInTheDocument()
    expect(screen.getByText("X (Twitter)")).toBeInTheDocument()
    expect(screen.getByText("WhatsApp")).toBeInTheDocument()
    expect(screen.getByText("Copier le lien")).toBeInTheDocument()
  })

  it("copies the link and shows confirmation", async () => {
    const user = await setupUser()
    render(<ShareArticle url="https://exemple.fr/a" title="Mon article" />)

    await user.click(screen.getByRole("button", { name: "Partager" }))
    await user.click(screen.getByRole("button", { name: "Copier le lien" }))

    expect(writeText).toHaveBeenCalledWith("https://exemple.fr/a")
    expect(screen.getByText("Lien copié")).toBeInTheDocument()
  })

  it("builds the Facebook and X share urls with the encoded params", async () => {
    const user = await setupUser()
    render(<ShareArticle url="https://exemple.fr/a?utm=x" title="Un titre" />)

    await user.click(screen.getByRole("button", { name: "Partager" }))
    const fb = screen.getByRole("link", { name: "Facebook" }) as HTMLAnchorElement
    const x = screen.getByRole("link", { name: "X (Twitter)" }) as HTMLAnchorElement

    expect(fb.href).toContain("https://www.facebook.com/sharer/sharer.php?u=")
    expect(fb.href).toContain(encodeURIComponent("https://exemple.fr/a?utm=x"))
    expect(x.href).toContain("https://twitter.com/intent/tweet")
    expect(x.href).toContain(encodeURIComponent("Un titre"))
  })
})