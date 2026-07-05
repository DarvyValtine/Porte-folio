"use client"

import { useActionState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createGalleryItem, type ActionState } from "@/lib/actions/gallery"

export function GalleryForm() {
  const [state, formAction, pending] = useActionState(createGalleryItem, undefined)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!pending && !state?.error) {
      formRef.current?.reset()
    }
  }, [pending, state])

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="imageUrl">URL de l&apos;image</Label>
        <Input id="imageUrl" name="imageUrl" required placeholder="https://..." />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="title">Titre (optionnel)</Label>
          <Input id="title" name="title" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sortOrder">Ordre d&apos;affichage</Label>
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue={0} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="caption">Légende</Label>
        <Textarea id="caption" name="caption" rows={2} />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Ajout..." : "Ajouter la photo"}
      </Button>
    </form>
  )
}
