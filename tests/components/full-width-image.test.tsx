import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { FullWidthImage } from "@/components/full-width-image"

describe("FullWidthImage rendered size", () => {
  it("contain mode: container gets explicit height + width from className + object-contain", () => {
    const { container } = render(
      <FullWidthImage
        src="https://exemple.fr/photo.jpg"
        alt="photo"
        fit="contain"
        maxHeight="200px"
        className="max-w-xl"
      />
    )
    const div = container.querySelector("div") as HTMLElement
    // inline style always applies in the browser (no Tailwind dependency)
    expect(div.style.height).toBe("200px")
    // width is driven by the className prop (call site controls it)
    expect(div.className).toContain("max-w-xl")
    expect(div.className).toContain("w-full")
    const img = container.querySelector("img") as HTMLElement
    expect(img.className).toContain("object-contain")
  })

  it("cover mode: explicit height + full width + object-cover", () => {
    const { container } = render(
      <FullWidthImage
        src="https://exemple.fr/photo.jpg"
        alt="photo"
        fit="cover"
        maxHeight="200px"
        className="max-w-xl"
      />
    )
    const div = container.querySelector("div") as HTMLElement
    expect(div.style.height).toBe("200px")
    expect(div.className).toContain("max-w-xl")
    expect(div.className).toContain("w-full")
    const img = container.querySelector("img") as HTMLElement
    expect(img.className).toContain("object-cover")
  })

  it("fillFrame false: caps height without a full-width crop frame", () => {
    const { container } = render(
      <FullWidthImage
        src="https://exemple.fr/photo.jpg"
        alt="photo"
        fit="contain"
        fillFrame={false}
        maxHeight="min(18rem, 42vh)"
      />
    )
    expect(container.querySelector("div")).toBeNull()
    const img = container.querySelector("img") as HTMLElement
    expect(img.style.maxHeight).toBe("min(18rem, 42vh)")
    expect(img.className).toContain("max-w-full")
    expect(img.className).toContain("h-auto")
  })
})
