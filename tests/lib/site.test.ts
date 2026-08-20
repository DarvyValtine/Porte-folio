import { describe, expect, it } from "vitest"
import { site, navLinks } from "@/lib/site"

describe("site config", () => {
  it("exposes the core identity fields", () => {
    expect(site.name).toBe("Grâce Estia")
    expect(site.role).toContain("Psychologue")
    expect(site.email).toMatch(/@/)
    expect(site.phone).toMatch(/^\+242/)
    expect(site.location).toContain("Brazzaville")
  })

  it("has a valid linkedin url", () => {
    expect(site.socials.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\//)
  })

  it("provides navigation links with unique hrefs", () => {
    const hrefs = navLinks.map((l) => l.href)
    expect(new Set(hrefs).size).toBe(hrefs.length)
    expect(navLinks.every((l) => l.label.length > 0)).toBe(true)
  })
})