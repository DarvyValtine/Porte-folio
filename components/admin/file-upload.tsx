"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Upload, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function FileUpload({
  name,
  label,
  defaultValue = "",
  accept = "image/jpeg,image/png,image/webp,image/gif,application/pdf",
}: {
  name: string
  label: string
  defaultValue?: string
  accept?: string
}) {
  const [value, setValue] = useState(defaultValue)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<"file" | "url">(defaultValue ? "url" : "file")
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Erreur lors de l'upload.")
        return
      }

      setValue(data.url)
    } catch {
      setError("Erreur réseau lors de l'upload.")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  function handleClear() {
    setValue("")
    setError(null)
  }

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>

      <input type="hidden" name={name} value={value} />

      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === "file" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("file")}
        >
          <Upload className="mr-1.5 h-3.5 w-3.5" />
          Importer
        </Button>
        <Button
          type="button"
          variant={mode === "url" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("url")}
        >
          URL
        </Button>
      </div>

      {mode === "file" ? (
        <div className="space-y-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="file:mr-2 file:cursor-pointer file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground"
          />
          {uploading && <p className="text-xs text-muted-foreground">Upload en cours...</p>}
        </div>
      ) : (
        <Input
          type="text"
          placeholder="https://..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      )}

      {value && (
        <div className="relative mt-2 inline-block">
          {value.endsWith(".pdf") ? (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-md border border-border/60 px-3 py-2 text-sm text-foreground hover:bg-secondary"
            >
              <FileText className="h-4 w-4" />
              PDF
            </a>
          ) : (
            <Image
              src={value}
              alt="Aperçu"
              width={200}
              height={150}
              className="rounded-md border border-border/60 object-cover"
            />
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 h-6 w-6"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
