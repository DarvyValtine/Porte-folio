"use client"

import { useActionState, useRef, useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createGalleryItem, type ActionState } from "@/lib/actions/gallery"
import { toast } from "sonner"

export function GalleryForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, pending] = useActionState<ActionState>(
    createGalleryItem,
    undefined
  )
  const [imagePreview, setImagePreview] = useState("")

  useEffect(() => {
    if (!pending && state === undefined) {
      formRef.current?.reset()
      setImagePreview("")
      toast.success("Photo ajoutée")
    }
  }, [pending, state])

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="imageUrl">URL de l&apos;image *</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          required
          placeholder="https://..."
          onChange={(e) => setImagePreview(e.target.value)}
        />
      </div>

      {imagePreview && (
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
          <Image
            src={imagePreview}
            alt="Aperçu"
            fill
            className="object-cover"
            onError={() => setImagePreview("")}
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="title">Titre</Label>
          <Input id="title" name="title" placeholder="Optionnel" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sortOrder">Ordre</Label>
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue="0" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="caption">Légende</Label>
        <Textarea id="caption" name="caption" rows={2} placeholder="Optionnel" />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Ajout..." : "Ajouter la photo"}
      </Button>
    </form>
  )
}
