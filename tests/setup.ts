import "@testing-library/jest-dom/vitest"
import { vi } from "vitest"

if (!("ResizeObserver" in globalThis)) {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  ;(globalThis as unknown as Record<string, unknown>).ResizeObserver = ResizeObserverMock
}

const win = window as unknown as {
  matchMedia?: (query: string) => MediaQueryList
  PointerEvent?: typeof MouseEvent
}

if (!win.matchMedia) {
  win.matchMedia = vi.fn().mockImplementation(
    (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList
  )
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}

URL.createObjectURL = vi.fn(() => "blob:mock")
URL.revokeObjectURL = vi.fn()

if (!win.PointerEvent) {
  win.PointerEvent = MouseEvent
}

if (!crypto.randomUUID) {
  ;(crypto as { randomUUID: () => string }).randomUUID = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16)
    })
}

if (!window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = () => {}
}