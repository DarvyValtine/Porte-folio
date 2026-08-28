import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { FullWidthImage } from "@/components/full-width-image"

describe("FullWidthImage rendered size", () => {
  it("contain mode: container gets explicit height + narrower width + object-contain", () => {
    const { container } = render(
      <FullWidthImage
        src="https://exemple.fr/photo.jpg"
        alt="photo"
        fit="contain"
        maxHeight="200px"
      />
    )
    const div = container.querySelector("div") as HTMLElement
    // inline style always applies in the browser (no Tailwind dependency)
    expect(div.style.height).toBe("200px")
    // narrower container => space on the sides
    expect(div.className).toContain("max-w-xl")
    const img = container.querySelector("img") as HTMLElement
    expect(img.className).toContain("object-contain")
  })

  it("cover mode: container gets explicit height + full width + object-cover", () => {
    const { container } = render(
      <FullWidthImage
        src="https://exemple.fr/photo.jpg"
        alt="photo"
        fit="cover"
        maxHeight="200px"
      />
    )
    const div = container.querySelector("div") as HTMLElement
    expect(div.style.height).toBe("200px")
    expect(div.className).toContain("max-w-xl")
    const img = container.querySelector("img") as HTMLElement
    expect(img.className).toContain("object-cover")
  })
})
