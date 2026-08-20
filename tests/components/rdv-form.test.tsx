import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

vi.mock("@/lib/actions/appointments", () => ({
  createAppointment: vi.fn(),
}))

import { RdvForm } from "@/components/rdv-form"
import { createAppointment } from "@/lib/actions/appointments"

const mockedCreate = vi.mocked(createAppointment)

async function fillValidForm() {
  const user = userEvent.setup()
  render(<RdvForm />)
  await user.type(screen.getByLabelText("Nom complet *"), "Alice")
  await user.type(screen.getByLabelText("Email *"), "alice@exemple.fr")
  await user.type(screen.getByLabelText("Message *"), "Bonjour")
  return user
}

describe("RdvForm", () => {
  it("shows the success message after a successful submission", async () => {
    mockedCreate.mockResolvedValue({ success: true })
    const user = await fillValidForm()
    await user.click(screen.getByRole("button", { name: "Envoyer la demande" }))
    expect(await screen.findByText("Demande envoyée")).toBeInTheDocument()
  })

  it("shows field errors returned by the action", async () => {
    mockedCreate.mockResolvedValue({ fieldErrors: { name: ["Le nom est requis"] } })
    const user = await fillValidForm()
    await user.click(screen.getByRole("button", { name: "Envoyer la demande" }))
    expect(await screen.findByText("Le nom est requis")).toBeInTheDocument()
  })

  it("shows the global error returned by the action", async () => {
    mockedCreate.mockResolvedValue({ error: "Erreur serveur" })
    const user = await fillValidForm()
    await user.click(screen.getByRole("button", { name: "Envoyer la demande" }))
    expect(await screen.findByText("Erreur serveur")).toBeInTheDocument()
  })

  it("shows multiple field errors", async () => {
    mockedCreate.mockResolvedValue({
      fieldErrors: {
        email: ["Adresse email invalide"],
        message: ["Le message est trop court"],
      },
    })
    const user = await fillValidForm()
    await user.click(screen.getByRole("button", { name: "Envoyer la demande" }))
    expect(await screen.findByText("Adresse email invalide")).toBeInTheDocument()
    expect(await screen.findByText("Le message est trop court")).toBeInTheDocument()
  })
})