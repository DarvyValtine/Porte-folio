import { describe, expect, it } from "vitest"
import { FOCUS_ICON_NAMES, getFocusIcon } from "@/lib/focus-icons"

describe("getFocusIcon", () => {
  it("returns an icon for an exact key", () => {
    expect(getFocusIcon("Heart")).toBeDefined()
  })

  it("matches case-insensitively and ignores separators", () => {
    expect(getFocusIcon("heart-handshake")).toBe(getFocusIcon("HeartHandshake"))
    expect(getFocusIcon("HEART_HANDSHAKE")).toBe(getFocusIcon("HeartHandshake"))
    expect(getFocusIcon("heart.handshake")).toBe(getFocusIcon("HeartHandshake"))
    expect(getFocusIcon("heart handshake")).toBe(getFocusIcon("HeartHandshake"))
  })

  it("falls back to the default icon for empty or unknown names", () => {
    expect(getFocusIcon("")).toBe(getFocusIcon("HeartHandshake"))
    expect(getFocusIcon("unknown-icon")).toBe(getFocusIcon("HeartHandshake"))
    expect(getFocusIcon(undefined as unknown as string)).toBe(getFocusIcon("HeartHandshake"))
  })

  it("exposes at least the expected icon names", () => {
    expect(FOCUS_ICON_NAMES.length).toBeGreaterThan(0)
    expect(FOCUS_ICON_NAMES).toContain("HeartHandshake")
  })
})