import { describe, expect, it, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { SafeImage } from "@/components/safe-image"

describe("SafeImage", () => {
  it("renders nothing when there is no source", () => {
    const { container } = render(<SafeImage src={null} alt="test" />)
    expect(container).toBeEmptyDOMElement()
  })

  it("renders the image with the given source", () => {
    render(<SafeImage src="/uploads/a.jpg" alt="test" width={200} height={100} />)
    const img = screen.getByAltText("test") as HTMLImageElement
    expect(img.src).toContain("_next/image")
    expect(decodeURIComponent(img.src)).toContain("/uploads/a.jpg")
  })

  it("renders nothing once the image fails to load", () => {
    render(<SafeImage src="/uploads/b.jpg" alt="test" fill sizes="100vw" />)
    fireEvent.error(screen.getByAltText("test"))
    expect(screen.queryByAltText("test")).not.toBeInTheDocument()
  })

  it("supports priority images", () => {
    render(<SafeImage src="/uploads/c.jpg" alt="test" fill priority />)
    expect(screen.getByAltText("test")).toBeInTheDocument()
  })
})