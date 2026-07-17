"use client"

import { useRef, useState, useCallback } from "react"
import { generateReactHelpers } from "@uploadthing/react"
import type { UploadRouter } from "@/lib/uploadthing"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X } from "lucide-react"

const { useUploadThing } = generateReactHelpers<UploadRouter>()

type Props = {
  name: string
  label?: string
  defaultValue?: string
  onChange?: (url: string) => void
}

export function UploadthingUpload({ name, label = "Image", defaultValue = "", onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState(defaultValue)
  const [error, setError] = useState("")
  const [url, setUrl] = useState(defaultValue)

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      const uploaded = res?.[0]
      if (uploaded) {
        setUrl(uploaded.url)
        setPreview(uploaded.url)
        onChange?.(uploaded.url)
      }
    },
    onUploadError: (err) => {
      setError(err.message || "Erreur lors de l'upload")
      setPreview("")
      setUrl("")
    },
  })

  const handleFile = useCallback(async (file: File) => {
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
  }, [startUpload])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const clear = useCallback(() => {
    setPreview("")
    setUrl("")
    setError("")
    onChange?.("")
    if (inputRef.current) inputRef.current.value = ""
  }, [onChange])

  return (
    <div className="space-y-1.5">
      {label && <Label>{label}</Label>}

      <input type="hidden" name={name} value={url} />

      {preview ? (
        <div className="relative overflow-hidden rounded-lg border border-border/60 bg-muted">
          <img
            src={preview}
            alt="Aperçu"
            className="h-48 w-full object-cover"
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
          <button
            type="button"
            onClick={clear}
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
                <p className="text-xs text-muted-foreground">PNG, JPG ou WebP jusqu&apos;à 5 Mo</p>
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
    </div>
  )
}
