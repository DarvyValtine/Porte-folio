import { describe, expect, it } from "vitest"
import { htmlToMarkdown } from "@/lib/paste-to-markdown"

describe("htmlToMarkdown", () => {
  it("converts basic formatting (bold, italic, headings, links)", () => {
    const html =
      "<h1>Title</h1><p><b>bold</b> and <i>italic</i> and <a href=\"https://example.com\">link</a></p>"
    expect(htmlToMarkdown(html)).toBe("# Title\n\n**bold** and *italic* and [link](https://example.com)")
  })

  it("detects bold/italic from inline styles (Word SPAN/FONT)", () => {
    const html =
      '<p>Du <span style="font-weight:bold">texte gras</span> et <span style="font-style:italic">italique</span>.</p>'
    expect(htmlToMarkdown(html)).toContain("**texte gras**")
    expect(htmlToMarkdown(html)).toContain("*italique*")
  })

  it("converts lists to markdown bullets", () => {
    const html = "<ul><li>item 1</li><li>item 2</li></ul>"
    const result = htmlToMarkdown(html)
    expect(result).toMatch(/^-+\s+item 1$/m)
    expect(result).toMatch(/^-+\s+item 2$/m)
  })

  it("converts tables to GFM markdown", () => {
    const html =
      "<table><tr><th>A</th><th>B</th></tr><tr><td>1</td><td>2</td></tr></table>"
    const result = htmlToMarkdown(html)
    expect(result).toContain("| A | B |")
    expect(result).toContain("| --- | --- |")
    expect(result).toContain("| 1 | 2 |")
  })

  it("maps inline font-size to headings (best effort)", () => {
    const html = '<p>Paragraphe avec <span style="font-size:26.0pt;font-weight:bold">Gros titre</span>.</p>'
    const result = htmlToMarkdown(html)
    expect(result).toContain("# Paragraphe avec **Gros titre**.")
  })

  it("keeps http(s) images and drops embedded data:/file: images", () => {
    const html =
      '<img src="https://utfs.io/f/x.jpg" alt="photo">' +
      '<img src="data:image/png;base64,abc" alt="embed">' +
      '<img src="file:///C:/tmp/a.png" alt="local">'
    const result = htmlToMarkdown(html)
    expect(result).toContain("![photo](https://utfs.io/f/x.jpg)")
    expect(result).not.toContain("embed")
    expect(result).not.toContain("local")
    expect(result).not.toContain("data:")
    expect(result).not.toContain("file:")
  })

  it("strips Word markup (o:p, empty MsoNormal, &nbsp;, comments, style)", () => {
    const html =
      '<!--StartFragment--><style>.x{}</style>' +
      '<p class="MsoNormal"><b>Heading</b></p>' +
      '<p class="MsoNormal">&nbsp;</p>' +
      "<p>Texte avec&nbsp;espace.</p>" +
      "<o:p></o:p>"
    const result = htmlToMarkdown(html)
    expect(result).not.toContain("StartFragment")
    expect(result).not.toContain("o:p")
    expect(result).not.toContain("&nbsp;")
    expect(result).not.toContain(".x{}")
    expect(result).toContain("**Heading**")
  })

  it("keeps plain text unchanged when no html structure", () => {
    expect(htmlToMarkdown("<p>Bonjour tout le monde</p>")).toBe("Bonjour tout le monde")
  })

  it("interprets em and small px font sizes as headings", () => {
    expect(htmlToMarkdown('<p style="font-size:2em">Titre em</p>')).toContain("# Titre em")
    expect(htmlToMarkdown('<p style="font-size:16px">Titre 16</p>')).toContain("### Titre 16")
  })

  it("removes script, style and namespaced nodes", () => {
    const html =
      "<p>avant</p><script>alert(1)</script><custom:tag>X</custom:tag><p>après</p>"
    const result = htmlToMarkdown(html)
    expect(result).not.toContain("alert")
    expect(result).not.toContain("custom")
    expect(result).toContain("avant")
    expect(result).toContain("après")
  })
})