"use client"

import { useActionState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/admin/file-upload"
import { createGalleryItem, type ActionState } from "@/lib/actions/gallery"
import { toast } from "sonner"

export function GalleryForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, pending] = useActionState<ActionState>(
    createGalleryItem,
    undefined
  )

  useEffect(() => {
    if (!pending && state === undefined) {
      formRef.current?.reset()
      toast.success("Photo ajoutée")
    }
  }, [pending, state])

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <FileUpload name="imageUrl" label="Image *" />

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
