"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { generateReactHelpers } from "@uploadthing/react"
import type { UploadRouter } from "@/lib/uploadthing"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Upload, X } from "lucide-react"

const { useUploadThing } = generateReactHelpers<UploadRouter>()

export type ImagePosition = "cursor" | "before" | "after"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInsert: (url: string, alt: string, position: ImagePosition) => void
}

export function InsertImageDialog({ open, onOpenChange, onInsert }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState("")
  const [preview, setPreview] = useState("")
  const [alt, setAlt] = useState("")
  const [position, setPosition] = useState<ImagePosition>("cursor")
  const [error, setError] = useState("")

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      const uploaded = res?.[0]
      if (uploaded) {
        setUrl(uploaded.url)
        setPreview(uploaded.url)
      }
    },
    onUploadError: (err) => {
      setError(err.message || "Erreur lors de l'upload")
    },
  })

  useEffect(() => {
    if (open) {
      setUrl("")
      setPreview("")
      setAlt("")
      setPosition("cursor")
      setError("")
      if (inputRef.current) inputRef.current.value = ""
    }
  }, [open])

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Fichier non valide")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("L'image ne doit pas dépasser 5 Mo")
        return
      }
      setError("")
      const localPreview = URL.createObjectURL(file)
      setPreview(localPreview)
      await startUpload([file])
      URL.revokeObjectURL(localPreview)
    },
    [startUpload],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleInsert = () => {
    if (!url) return
    onInsert(url, alt.trim() || "image", position)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insérer une image</DialogTitle>
          <DialogDescription>
            Téléversez une image puis choisissez son emplacement dans l&apos;article.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {preview ? (
            <div className="relative overflow-hidden rounded-lg border border-border/60 bg-muted">
              <img src={preview} alt="Aperçu" className="h-48 w-full object-cover" />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setPreview("")
                  setUrl("")
                  if (inputRef.current) inputRef.current.value = ""
                }}
                className="absolute right-2 top-2 rounded-full bg-background/80 p-1 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border/60 bg-secondary/30 px-4 py-8 text-center transition-colors hover:border-primary/50 hover:bg-secondary/50"
            >
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Cliquez ou déposez une image
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG ou WebP jusqu&apos;à 5 Mo
                    </p>
                  </div>
                </>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </div>
          )}

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="space-y-1.5">
            <Label htmlFor="image-alt">Texte alternatif</Label>
            <Input
              id="image-alt"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Description de l'image"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Position</Label>
            <Select value={position} onValueChange={(v) => setPosition(String(v) as ImagePosition)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cursor">À la position du curseur</SelectItem>
                <SelectItem value="before">Avant le paragraphe</SelectItem>
                <SelectItem value="after">Après le paragraphe</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleInsert} disabled={!url || isUploading}>
            Insérer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}