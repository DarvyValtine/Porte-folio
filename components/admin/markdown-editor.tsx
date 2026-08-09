"use client"

import { useRef, useState } from "react"
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link,
  Image as ImageIcon,
} from "lucide-react"
import { Label } from "@/components/ui/label"

type Props = {
  name: string
  label?: string
  defaultValue?: string
  placeholder?: string
  rows?: number
}

type ButtonProps = {
  title: string
  onClick: () => void
  children: React.ReactNode
}

function ToolbarButton({ title, onClick, children }: ButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {children}
    </button>
  )
}

export function MarkdownEditor({
  name,
  label = "Contenu",
  defaultValue = "",
  placeholder = "",
  rows = 14,
}: Props) {
  const [value, setValue] = useState(defaultValue)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const applyWrap = (before: string, after: string) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selection = value.slice(start, end)
    const next = value.slice(0, start) + before + selection + after + value.slice(end)
    setValue(next)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(start + before.length, end + before.length)
    })
  }

  const applyPrefix = (prefix: string) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const lineStart = value.lastIndexOf("\n", start - 1) + 1
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart)
    setValue(next)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length)
    })
  }

  const insert = (text: string, selectOffset = 0) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const next = value.slice(0, start) + text + value.slice(end)
    setValue(next)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(start + selectOffset, start + text.length - selectOffset)
    })
  }

  const insertLink = () => {
    const ta = textareaRef.current
    if (!ta) return
    const selection = value.slice(ta.selectionStart, ta.selectionEnd)
    if (selection) {
      applyWrap("[", `](${selection.trim()})`)
    } else {
      insert("[texte du lien](https://)", "texte du lien".length)
    }
  }

  const insertImage = () => {
    const ta = textareaRef.current
    if (!ta) return
    const selection = value.slice(ta.selectionStart, ta.selectionEnd)
    if (selection) {
      applyWrap("![", `](${selection.trim()})`)
    } else {
      insert("![description de l'image](https://)")
    }
  }

  return (
    <div className="space-y-1.5">
      {label && <Label>{label}</Label>}

      <div className="overflow-hidden rounded-lg border border-input bg-background transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
        <div className="flex flex-wrap items-center gap-0.5 border-b border-border/60 bg-secondary/40 px-2 py-1">
          <ToolbarButton title="Gras" onClick={() => applyWrap("**", "**")}>
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Italique" onClick={() => applyWrap("*", "*")}>
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <span className="mx-1 h-5 w-px bg-border" />
          <ToolbarButton title="Titre niveau 2" onClick={() => applyPrefix("## ")}>
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Titre niveau 3" onClick={() => applyPrefix("### ")}>
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>
          <span className="mx-1 h-5 w-px bg-border" />
          <ToolbarButton title="Liste à puces" onClick={() => applyPrefix("- ")}>
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Liste numérotée" onClick={() => applyPrefix("1. ")}>
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <span className="mx-1 h-5 w-px bg-border" />
          <ToolbarButton title="Citation" onClick={() => applyPrefix("> ")}>
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Lien" onClick={insertLink}>
            <Link className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Image" onClick={insertImage}>
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="min-h-72 w-full resize-y bg-transparent px-3 py-2 text-sm leading-relaxed outline-none"
        />
      </div>

      <input type="hidden" name={name} value={value} />
      <p className="text-xs text-muted-foreground">
        Markdown supporté : **gras**, *italique*, # titres, - listes, &gt; citations, [lien](url),
        ![image](url).
      </p>
    </div>
  )
}
