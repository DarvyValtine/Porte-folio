"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArticleMarkdown } from "@/components/article-markdown"
import { InsertImageDialog, type ImagePosition } from "@/components/admin/insert-image-dialog"
import { htmlToMarkdown } from "@/lib/paste-to-markdown"
import {
  Bold,
  ClipboardPaste,
  Code,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Table,
} from "lucide-react"

type Props = {
  name: string
  defaultValue?: string
  required?: boolean
}

type Result = { next: string; sel: [number, number] }

export function ArticleContentEditor({ name, defaultValue = "", required }: Props) {
  const [value, setValue] = useState(defaultValue)
  const [tab, setTab] = useState("edit")
  const [pasteAsText, setPasteAsText] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const selStart = useRef(0)
  const selEnd = useRef(0)

  const saveSelection = () => {
    const ta = textareaRef.current
    if (ta) {
      selStart.current = ta.selectionStart
      selEnd.current = ta.selectionEnd
    }
  }

  const run = (transform: (before: string, selected: string, after: string) => Result) => {
    const ta = textareaRef.current
    const start = ta ? selStart.current : value.length
    const end = ta ? selEnd.current : value.length
    const before = value.slice(0, start)
    const selected = value.slice(start, end)
    const after = value.slice(end)
    const { next, sel } = transform(before, selected, after)
    setValue(next)
    selStart.current = sel[0]
    selEnd.current = sel[1]
    requestAnimationFrame(() => {
      if (ta) {
        ta.focus()
        ta.setSelectionRange(sel[0], sel[1])
      }
    })
  }

  const wrap = (markerBefore: string, markerAfter: string, placeholder: string) =>
    (before: string, selected: string, after: string): Result => {
      const text = selected || placeholder
      const start = before.length + markerBefore.length
      return {
        next: before + markerBefore + text + markerAfter + after,
        sel: [start, start + text.length],
      }
    }

  const heading = (level: number) =>
    (before: string, selected: string, after: string): Result => {
      const lineStart = before.lastIndexOf("\n") + 1
      const prefix = "#".repeat(level) + " "
      const start = lineStart + prefix.length
      return {
        next: before.slice(0, lineStart) + prefix + before.slice(lineStart) + selected + after,
        sel: [start, start + selected.length],
      }
    }

  const linePrefix = (marker: string) =>
    (before: string, selected: string, after: string): Result => {
      const lineStart = before.lastIndexOf("\n") + 1
      const block = (before.slice(lineStart) + selected).split("\n")
      const prefixed = block.map((line) => (line.trim() ? marker + line : line)).join("\n")
      const end = lineStart + prefixed.length
      return {
        next: before.slice(0, lineStart) + prefixed + after,
        sel: [lineStart, end],
      }
    }

  const insertBlock = (block: string) =>
    (before: string, selected: string, after: string): Result => {
      const start = before.length + block.length
      return {
        next: before + block + selected + after,
        sel: [start, start + selected.length],
      }
    }

  const toolbarButtonProps = {
    type: "button" as const,
    variant: "ghost" as const,
    size: "icon" as const,
  }

  const handleLink = () => {
    const url = window.prompt("URL du lien", "https://")
    if (!url) return
    run((before, selected, after) => {
      const text = selected || "lien"
      const ins = `[${text}](${url})`
      return { next: before + ins + after, sel: [before.length, before.length + ins.length] }
    })
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const plainText = e.clipboardData.getData("text/plain")
    const html = e.clipboardData.getData("text/html")
    let insert = plainText
    if (!pasteAsText && html) {
      const markdown = htmlToMarkdown(html)
      if (markdown.trim()) insert = markdown
    }
    if (!insert) return
    e.preventDefault()
    const next = value.slice(0, start) + insert + value.slice(end)
    const sel: [number, number] = [start + insert.length, start + insert.length]
    setValue(next)
    selStart.current = sel[0]
    selEnd.current = sel[1]
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(sel[0], sel[1])
    })
  }

  const insertAt = (index: number, text: string) => {
    const ta = textareaRef.current
    const next = value.slice(0, index) + text + value.slice(index)
    const sel: [number, number] = [index + text.length, index + text.length]
    setValue(next)
    selStart.current = sel[0]
    selEnd.current = sel[1]
    requestAnimationFrame(() => {
      if (ta) {
        ta.focus()
        ta.setSelectionRange(sel[0], sel[1])
      }
    })
  }

  const paragraphStart = (pos: number) => {
    let i = pos
    while (i > 0) {
      if (value[i - 1] === "\n" && value[i] === "\n") break
      i--
    }
    return i
  }

  const paragraphEnd = (pos: number) => {
    let i = pos
    const len = value.length
    while (i < len) {
      if (value[i] === "\n" && value[i + 1] === "\n") break
      i++
    }
    return i
  }

  const handleImageInsert = (url: string, alt: string, position: ImagePosition) => {
    const ta = textareaRef.current
    const pos = ta ? ta.selectionStart : value.length
    const markdown = `![${alt}](${url})`
    if (position === "before") insertAt(paragraphStart(pos), markdown + "\n\n")
    else if (position === "after") insertAt(paragraphEnd(pos), "\n\n" + markdown)
    else insertAt(pos, markdown)
  }

  return (
    <>
    <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
      <TabsList>
        <TabsTrigger value="edit">Édition</TabsTrigger>
        <TabsTrigger value="preview">Aperçu</TabsTrigger>
      </TabsList>

      <TabsContent value="edit">
        <div
          className="mb-2 flex flex-wrap items-center gap-1 rounded-lg border border-border/60 bg-muted/50 p-1"
          onMouseDown={(e) => e.preventDefault()}
        >
          <Button {...toolbarButtonProps} title="Titre (H2)" onClick={() => run(heading(2))}>
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button {...toolbarButtonProps} title="Sous-titre (H3)" onClick={() => run(heading(3))}>
            <Heading3 className="h-4 w-4" />
          </Button>
          <span className="mx-1 h-5 w-px bg-border/60" />
          <Button {...toolbarButtonProps} title="Gras" onClick={() => run(wrap("**", "**", "texte"))}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button {...toolbarButtonProps} title="Italique" onClick={() => run(wrap("*", "*", "texte"))}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button {...toolbarButtonProps} title="Code" onClick={() => run(wrap("`", "`", "code"))}>
            <Code className="h-4 w-4" />
          </Button>
          <span className="mx-1 h-5 w-px bg-border/60" />
          <Button {...toolbarButtonProps} title="Liste à puces" onClick={() => run(linePrefix("- "))}>
            <List className="h-4 w-4" />
          </Button>
          <Button {...toolbarButtonProps} title="Liste numérotée" onClick={() => run(linePrefix("1. "))}>
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button {...toolbarButtonProps} title="Citation" onClick={() => run(linePrefix("> "))}>
            <Quote className="h-4 w-4" />
          </Button>
          <span className="mx-1 h-5 w-px bg-border/60" />
          <Button {...toolbarButtonProps} title="Lien" onClick={handleLink}>
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button {...toolbarButtonProps} title="Insérer une image" onClick={() => setDialogOpen(true)}>
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button {...toolbarButtonProps} title="Séparateur" onClick={() => run(insertBlock("\n\n---\n\n"))}>
            <Minus className="h-4 w-4" />
          </Button>
          <Button {...toolbarButtonProps} title="Tableau" onClick={() => run(insertBlock("\n\n| Colonne 1 | Colonne 2 |\n| --- | --- |\n| Contenu | Contenu |\n\n"))}>
            <Table className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={pasteAsText ? "outline" : "ghost"}
            size="icon"
            className="ml-auto"
            title={pasteAsText ? "Collage texte brut activé (cliquer pour réactiver la mise en forme)" : "Coller en texte brut"}
            aria-pressed={pasteAsText}
            onClick={() => setPasteAsText((v) => !v)}
          >
            <ClipboardPaste className="h-4 w-4" />
          </Button>
        </div>

        <textarea
          ref={textareaRef}
          name={name}
          required={required}
          rows={14}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onPaste={handlePaste}
          onSelect={saveSelection}
          onClick={saveSelection}
          onKeyUp={saveSelection}
          onBlur={saveSelection}
          className="min-h-72 w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </TabsContent>

      <TabsContent value="preview">
        <div className="min-h-72 rounded-lg border border-border/60 bg-background p-4">
          {value.trim() ? (
            <ArticleMarkdown content={value} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Le contenu est vide. Revenez sur l&apos;onglet Édition pour rédiger votre article.
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>

    <InsertImageDialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      onInsert={handleImageInsert}
    />
    </>
  )
}