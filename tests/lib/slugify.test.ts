import { describe, expect, it } from "vitest"
import { slugify } from "@/lib/slugify"

describe("slugify", () => {
  it("lowercases and trims spaces", () => {
    expect(slugify("Hello World")).toBe("hello-world")
    expect(slugify("  Multi   Spaces  ")).toBe("multi-spaces")
  })

  it("removes accents (NFD normalization)", () => {
    expect(slugify("Éducation et prévention")).toBe("education-et-prevention")
    expect(slugify("Grâce à l'à propos")).toBe("grace-a-l-a-propos")
  })

  it("replaces non-alphanumeric runs with a single dash", () => {
    expect(slugify("a/b\\c:d,e;f")).toBe("a-b-c-d-e-f")
    expect(slugify("Article n°1 — test")).toBe("article-n-1-test")
  })

  it("trims leading and trailing dashes", () => {
    expect(slugify("---Bonjour---")).toBe("bonjour")
    expect(slugify("!!!titre!!!")).toBe("titre")
  })

  it("handles empty input", () => {
    expect(slugify("")).toBe("")
  })
})