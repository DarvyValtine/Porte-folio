"use client"

import { useRef, useState, useCallback } from "react"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X } from "lucide-react"

type ImageUploadProps = {
  name: string
  label?: string
  defaultValue?: string | null
  required?: boolean
}

export function ImageUpload({ name, label = "Image", defaultValue, required }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState(defaultValue || "")
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [url, setUrl] = useState(defaultValue || "")

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Fichier non valide")
      return
    }

    setUploading(true)
    setError("")

    const localPreview = URL.createObjectURL(file)
    setPreview(localPreview)

    const fd = new FormData()
    fd.append("file", file)

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur")
      setUrl(data.url)
      setPreview(data.url)
    } catch (e) {
      setError((e as Error).message || "Erreur lors de l'upload")
      setPreview("")
      setUrl("")
    } finally {
      setUploading(false)
      URL.revokeObjectURL(localPreview)
    }
  }, [])

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
    if (inputRef.current) inputRef.current.value = ""
  }, [])

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
          {uploading && (
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
          {uploading ? (
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
