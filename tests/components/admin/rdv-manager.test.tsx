import { describe, expect, it, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}))

vi.mock("@/lib/actions/appointments", () => ({
  updateAppointmentStatus: vi.fn(async () => ({ success: true })),
  deleteAppointment: vi.fn(async () => ({ success: true })),
}))

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

import { RdvManager } from "@/app/(admin)/admin/rdv/rdv-manager"

const appointments = [
  {
    id: 1,
    name: "Alice",
    email: "alice@exemple.fr",
    phone: null,
    preferredDate: null,
    subject: "Consultation",
    message: "Bonjour",
    status: "pending",
    createdAt: new Date("2026-08-01T10:00:00Z"),
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@exemple.fr",
    phone: "0600000000",
    preferredDate: "2026-09-01",
    subject: null,
    message: "Test",
    status: "closed",
    createdAt: new Date("2026-07-01T10:00:00Z"),
  },
]

describe("RdvManager", () => {
  it("renders the appointments with their status badges", () => {
    render(<RdvManager appointments={appointments} />)
    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.getByText("Bob")).toBeInTheDocument()
    expect(screen.getAllByText("En attente").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Clôturé").length).toBeGreaterThan(0)
    expect(screen.getByText("Consultation")).toBeInTheDocument()
  })

  it("filters appointments by status", () => {
    render(<RdvManager appointments={appointments} />)
    fireEvent.click(screen.getByRole("tab", { name: "Clôturé" }))
    expect(screen.queryByText("Alice")).not.toBeInTheDocument()
    expect(screen.getByText("Bob")).toBeInTheDocument()
  })

  it("searches by name or email", () => {
    render(<RdvManager appointments={appointments} />)
    fireEvent.change(screen.getByPlaceholderText("Rechercher par nom, email..."), {
      target: { value: "bob" },
    })
    expect(screen.queryByText("Alice")).not.toBeInTheDocument()
    expect(screen.getByText("Bob")).toBeInTheDocument()
  })

  it("shows an empty state when there are no appointments", () => {
    render(<RdvManager appointments={[]} />)
    expect(screen.getByText("Aucun rendez-vous pour l'instant.")).toBeInTheDocument()
  })

  it("shows a message when filters match nothing", () => {
    render(<RdvManager appointments={appointments} />)
    fireEvent.click(screen.getByRole("tab", { name: "Contacté" }))
    expect(screen.getByText("Aucun rendez-vous ne correspond aux filtres.")).toBeInTheDocument()
  })
})