import { describe, expect, it } from "vitest"
import { appointmentSchema } from "@/lib/schemas"

describe("appointmentSchema", () => {
  it("accepts a valid appointment", () => {
    const result = appointmentSchema.safeParse({
      name: "Jean Dupont",
      email: "jean@example.com",
      phone: "+242 06 000 00 00",
      preferredDate: "2026-09-01",
      subject: "Consultation",
      message: "Je souhaite prendre rendez-vous.",
    })
    expect(result.success).toBe(true)
  })

  it("rejects a too-short name", () => {
    const result = appointmentSchema.safeParse({
      name: "J",
      email: "jean@example.com",
      message: "Message assez long pour passer",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name?.[0]).toMatch(/min\. 2/i)
    }
  })

  it("rejects an invalid email", () => {
    const result = appointmentSchema.safeParse({
      name: "Jean",
      email: "pas-un-email",
      message: "Message assez long pour passer",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email?.[0]).toMatch(/invalide/i)
    }
  })

  it("rejects a too-short message", () => {
    const result = appointmentSchema.safeParse({
      name: "Jean",
      email: "jean@example.com",
      message: "court",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.message?.[0]).toMatch(/min\. 10/i)
    }
  })

  it("coerces typeId to a number and treats optional fields as optional", () => {
    const result = appointmentSchema.safeParse({
      name: "Jean",
      email: "jean@example.com",
      message: "Message assez long pour passer",
      typeId: "3",
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.typeId).toBe(3)
      expect(result.data.phone).toBeUndefined()
      expect(result.data.subject).toBeUndefined()
    }
  })
})