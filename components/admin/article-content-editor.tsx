"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  Underline,
  Strikethrough,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Superscript,
  Subscript,
  Smile,
  Expand,
  Minimize2,
  Save,
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
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [history, setHistory] = useState<string[]>([defaultValue])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const selStart = useRef(0)
  const selEnd = useRef(0)

  const saveSelection = () => {
    const ta = textareaRef.current
    if (ta) {
      selStart.current = ta.selectionStart
      selEnd.current = ta.selectionEnd
      updateActiveFormats()
    }
  }

  const updateActiveFormats = () => {
    const ta = textareaRef.current
    if (!ta) return
    
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const text = value
    
    // Check for various markdown formats around cursor
    const formats = new Set<string>()
    
    // Check for bold
    if (text.substring(start - 2, start) === "**" && text.substring(end, end + 2) === "**") {
      formats.add("bold")
    }
    
    // Check for italic
    if (text.substring(start - 1, start) === "*" && text.substring(end, end + 1) === "*") {
      formats.add("italic")
    }
    
    // Check for underline
    if (text.substring(start - 3, start) === "<u>" && text.substring(end, end + 4) === "</u>") {
      formats.add("underline")
    }
    
    // Check for strikethrough
    if (text.substring(start - 2, start) === "~~" && text.substring(end, end + 2) === "~~") {
      formats.add("strikethrough")
    }
    
    // Check for code
    if (text.substring(start - 1, start) === "`" && text.substring(end, end + 1) === "`") {
      formats.add("code")
    }
    
    setActiveFormats(formats)
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
    addToHistory(next)
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
    className: "h-8 w-8 transition-all duration-200 hover:bg-primary/10 hover:text-primary active:scale-95 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
  }

  const getActiveButtonClass = (format: string) => {
    return activeFormats.has(format) 
      ? "bg-primary/20 text-primary shadow-sm" 
      : ""
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
    addToHistory(next)
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
    addToHistory(next)
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
    const sep = value.lastIndexOf("\n\n", pos)
    return sep === -1 ? 0 : sep + 2
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

  const addToHistory = (newValue: string) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newValue)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setValue(history[newIndex])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setValue(history[newIndex])
    }
  }

  const handleEmojiInsert = (emoji: string) => {
    run((before, selected, after) => {
      const ins = emoji
      return { next: before + ins + selected + after, sel: [before.length + ins.length, before.length + ins.length] }
    })
    setEmojiOpen(false)
  }

  const handleAlign = (align: "left" | "center" | "right") => {
    const alignClass = align === "center" ? "text-center" : align === "right" ? "text-right" : ""
    if (align === "left") return // alignement par défaut
    
    run((before, selected, after) => {
      const ins = `<div class="${alignClass}">\n\n${selected}\n\n</div>`
      return { next: before + ins + after, sel: [before.length, before.length + ins.length] }
    })
  }

  const getWordCount = () => {
    return value.trim().split(/\s+/).filter(Boolean).length
  }

  const getCharCount = () => {
    return value.length
  }

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(`article-draft-${name}`, value)
    }, 1000)
    return () => clearTimeout(timer)
  }, [value, name])

  // Load draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`article-draft-${name}`)
    if (saved && !defaultValue) {
      setValue(saved)
    }
  }, [name, defaultValue])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault()
            run(wrap("**", "**", "texte"))
            break
          case 'i':
            e.preventDefault()
            run(wrap("*", "*", "texte"))
            break
          case 'u':
            e.preventDefault()
            run(wrap("<u>", "</u>", "texte"))
            break
          case 'z':
            if (e.shiftKey) {
              e.preventDefault()
              handleRedo()
            } else {
              e.preventDefault()
              handleUndo()
            }
            break
          case 'y':
            e.preventDefault()
            handleRedo()
            break
        }
      }
    }

    const ta = textareaRef.current
    if (ta) {
      ta.addEventListener('keydown', handleKeyDown)
      return () => ta.removeEventListener('keydown', handleKeyDown)
    }
  }, [value, history, historyIndex])

  return (
    <>
    <div className={isFullscreen ? "fixed inset-0 z-50 bg-gradient-to-br from-background via-background to-muted/30 p-6 backdrop-blur-sm" : ""}>
      <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
        <div className="flex items-center justify-between mb-3">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="edit" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Édition
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Aperçu
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-muted/30 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm transition-all hover:bg-muted/50">
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                {getWordCount()} mots
              </span>
              <span className="h-3 w-px bg-border/40" />
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                {getCharCount()} caractères
              </span>
            </div>
            <div className="relative">
              <Button
                {...toolbarButtonProps}
                title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={isFullscreen ? "bg-primary/20 text-primary shadow-sm" : ""}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
              </Button>
              {isFullscreen && <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>}
            </div>
          </div>
        </div>

      <TabsContent value="edit" keepMounted>
        <div
          className="mb-3 flex flex-wrap items-center gap-1.5 rounded-xl border border-border/60 bg-gradient-to-br from-muted/50 to-muted/30 p-2 shadow-sm backdrop-blur-sm"
          onMouseDown={(e) => e.preventDefault()}
        >
          <Button {...toolbarButtonProps} title="Annuler (Ctrl+Z)" onClick={handleUndo} disabled={historyIndex === 0}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button {...toolbarButtonProps} title="Rétablir (Ctrl+Y)" onClick={handleRedo} disabled={historyIndex === history.length - 1}>
            <Redo className="h-4 w-4" />
          </Button>
          <span className="mx-2 h-6 w-px bg-border/40" />
          <Button {...toolbarButtonProps} title="Titre (H2)" onClick={() => run(heading(2))}>
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button {...toolbarButtonProps} title="Sous-titre (H3)" onClick={() => run(heading(3))}>
            <Heading3 className="h-4 w-4" />
          </Button>
          <span className="mx-2 h-6 w-px bg-border/40" />
          <Button {...toolbarButtonProps} title="Gras (Ctrl+B)" onClick={() => run(wrap("**", "**", "texte"))} className={`${toolbarButtonProps.className} ${getActiveButtonClass("bold")}`}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button {...toolbarButtonProps} title="Italique (Ctrl+I)" onClick={() => run(wrap("*", "*", "texte"))} className={`${toolbarButtonProps.className} ${getActiveButtonClass("italic")}`}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button {...toolbarButtonProps} title="Souligné (Ctrl+U)" onClick={() => run(wrap("<u>", "</u>", "texte"))} className={`${toolbarButtonProps.className} ${getActiveButtonClass("underline")}`}>
            <Underline className="h-4 w-4" />
          </Button>
          <Button {...toolbarButtonProps} title="Barré" onClick={() => run(wrap("~~", "~~", "texte"))} className={`${toolbarButtonProps.className} ${getActiveButtonClass("strikethrough")}`}>
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button {...toolbarButtonProps} title="Code" onClick={() => run(wrap("`", "`", "code"))} className={`${toolbarButtonProps.className} ${getActiveButtonClass("code")}`}>
            <Code className="h-4 w-4" />
          </Button>
          <span className="mx-2 h-6 w-px bg-border/40" />
          <Button {...toolbarButtonProps} title="Liste à puces" onClick={() => run(linePrefix("- "))}>
            <List className="h-4 w-4" />
          </Button>
          <Button {...toolbarButtonProps} title="Liste numérotée" onClick={() => run(linePrefix("1. "))}>
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button {...toolbarButtonProps} title="Citation" onClick={() => run(linePrefix("> "))}>
            <Quote className="h-4 w-4" />
          </Button>
          <span className="mx-2 h-6 w-px bg-border/40" />
          <Button {...toolbarButtonProps} title="Aligner à gauche" onClick={() => handleAlign("left")}>
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button {...toolbarButtonProps} title="Centrer" onClick={() => handleAlign("center")}>
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button {...toolbarButtonProps} title="Aligner à droite" onClick={() => handleAlign("right")}>
            <AlignRight className="h-4 w-4" />
          </Button>
          <span className="mx-2 h-6 w-px bg-border/40" />
          <Button {...toolbarButtonProps} title="Indice" onClick={() => run(wrap("<sub>", "</sub>", "texte"))}>
            <Subscript className="h-4 w-4" />
          </Button>
          <Button {...toolbarButtonProps} title="Exposant" onClick={() => run(wrap("<sup>", "</sup>", "texte"))}>
            <Superscript className="h-4 w-4" />
          </Button>
          <span className="mx-2 h-6 w-px bg-border/40" />
          <Button {...toolbarButtonProps} title="Lien" onClick={handleLink}>
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button {...toolbarButtonProps} title="Insérer une image" onClick={() => setDialogOpen(true)}>
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button {...toolbarButtonProps} title="Émojis" onClick={() => setEmojiOpen(true)}>
            <Smile className="h-4 w-4" />
          </Button>
          <Button {...toolbarButtonProps} title="Séparateur" onClick={() => run(insertBlock("\n\n---\n\n"))}>
            <Minus className="h-4 w-4" />
          </Button>
          <Button {...toolbarButtonProps} title="Tableau" onClick={() => run(insertBlock("\n\n| Colonne 1 | Colonne 2 |\n| --- | --- |\n| Contenu | Contenu |\n\n"))}>
            <Table className="h-4 w-4" />
          </Button>
          <div className="relative ml-auto">
            <Button
              type="button"
              variant={pasteAsText ? "outline" : "ghost"}
              size="icon"
              className="transition-all hover:bg-primary/10 hover:text-primary"
              title={pasteAsText ? "Collage texte brut activé (cliquer pour réactiver la mise en forme)" : "Coller en texte brut"}
              aria-pressed={pasteAsText}
              onClick={() => setPasteAsText((v) => !v)}
            >
              <ClipboardPaste className="h-4 w-4" />
            </Button>
            {pasteAsText && <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>}
          </div>
        </div>

        <textarea
          ref={textareaRef}
          name={name}
          required={required}
          rows={isFullscreen ? 30 : 14}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            addToHistory(e.target.value)
          }}
          onPaste={handlePaste}
          onSelect={saveSelection}
          onClick={saveSelection}
          onKeyUp={saveSelection}
          onBlur={saveSelection}
          className="min-h-72 w-full rounded-xl border border-border/60 bg-background/50 px-4 py-3 font-mono text-sm shadow-inner backdrop-blur-sm transition-all duration-300 placeholder:text-muted-foreground/50 focus-visible:border-primary/50 focus-visible:bg-background focus-visible:shadow-lg focus-visible:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        />
      </TabsContent>

      <TabsContent value="preview" keepMounted>
        <div className="min-h-72 rounded-xl border border-border/60 bg-gradient-to-br from-background to-muted/20 p-6 shadow-inner backdrop-blur-sm">
          {value.trim() ? (
            <div className="animate-in fade-in duration-300">
              <ArticleMarkdown content={value} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-muted/50 p-4">
                <svg className="h-8 w-8 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">
                Le contenu est vide. Revenez sur l&apos;onglet Édition pour rédiger votre article.
              </p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>

    <InsertImageDialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      onInsert={handleImageInsert}
    />

    <Dialog open={emojiOpen} onOpenChange={setEmojiOpen}>
      <DialogContent className="sm:max-w-md border-border/60 bg-gradient-to-br from-background to-muted/20 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Insérer un émoji</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-8 gap-2">
          {["😀", "😂", "😍", "🥰", "😎", "🤔", "😢", "😡", "👍", "👎", "❤️", "🔥", "⭐", "✅", "❌", "🎉", "🚀", "💡", "📝", "✏️", "🔧", "💻", "🌟", "💪", "🎯", "🏆", "📚", "🎨", "🎵", "🌈", "☀️", "🌙"].map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              size="lg"
              className="text-2xl transition-all hover:scale-110 hover:bg-primary/10 active:scale-95"
              onClick={() => handleEmojiInsert(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
    </div>
    </>
  )
}