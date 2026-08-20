import TurndownService from "turndown"
import { gfm } from "turndown-plugin-gfm"

let service: TurndownService | null = null

function parsePx(size: string | undefined): number {
  if (!size) return 0
  const m = size.trim().match(/^([\d.]+)\s*(px|pt|em)?$/i)
  if (!m) return 0
  const value = parseFloat(m[1])
  if (!m[2]) return value
  if (m[2].toLowerCase() === "pt") return (value * 4) / 3
  if (m[2].toLowerCase() === "em") return value * 16
  return value
}

const INLINE_TAGS = new Set([
  "SPAN",
  "FONT",
  "B",
  "I",
  "U",
  "STRONG",
  "EM",
  "A",
  "SMALL",
  "SUP",
  "SUB",
  "MARK",
  "CODE",
])

function getService(): TurndownService {
  if (service) return service

  const t = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
    strongDelimiter: "**",
    br: "  \n",
  })
  t.use(gfm)

  t.remove(
    (node) =>
      node.nodeName.includes(":") ||
      node.nodeName === "SCRIPT" ||
      node.nodeName === "STYLE" ||
      node.nodeName === "HEAD",
  )

  t.addRule("inlineStyle", {
    filter: (node) => {
      if (!INLINE_TAGS.has(node.nodeName)) return false
      const fontWeight = (node.style.fontWeight || "").toLowerCase()
      const fontStyle = (node.style.fontStyle || "").toLowerCase()
      return fontWeight === "bold" || fontWeight === "700" || fontStyle === "italic"
    },
    replacement: (content, node) => {
      const fontWeight = (node.style.fontWeight || "").toLowerCase()
      const fontStyle = (node.style.fontStyle || "").toLowerCase()
      let out = content
      if (fontWeight === "bold" || fontWeight === "700") out = `**${out}**`
      if (fontStyle === "italic") out = `*${out}*`
      return out
    },
  })

  t.addRule("inlineHeading", {
    filter: (node) => {
      if (node.nodeName !== "P" && node.nodeName !== "DIV") return false
      const elements = [node, ...Array.from(node.querySelectorAll("*"))] as HTMLElement[]
      return elements.some((el) => parsePx(el.style.fontSize) >= 16)
    },
    replacement: (content, node) => {
      const elements = [node, ...Array.from(node.querySelectorAll("*"))] as HTMLElement[]
      const px = Math.max(...elements.map((el) => parsePx(el.style.fontSize)), 0)
      const level = px >= 24 ? 1 : px >= 18 ? 2 : 3
      return `\n\n${"#".repeat(level)} ${content}\n\n`
    },
  })

  t.addRule("embeddedImage", {
    filter: (node) => {
      if (node.nodeName !== "IMG") return false
      const src = node.getAttribute("src") || ""
      return src.startsWith("data:") || src.startsWith("file:") || src.startsWith("blob:")
    },
    replacement: () => "",
  })

  service = t
  return t
}

function cleanWordHtml(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<o:p[\s\S]*?<\/o:p>/gi, "")
    .replace(
      /<p[^>]*class="[^"]*MsoNormal[^"]*"[^>]*>\s*(?:&nbsp;|\s)*<\/p>/gi,
      "",
    )
    .replace(/&nbsp;/g, " ")
}

export function htmlToMarkdown(html: string): string {
  return getService().turndown(cleanWordHtml(html))
}