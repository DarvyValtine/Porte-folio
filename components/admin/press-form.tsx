"use client"

import { useActionState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/admin/image-upload"
import { createPressItem, type ActionState } from "@/lib/actions/press"
import { toast } from "sonner"

export function PressForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, pending] = useActionState<ActionState>(
    createPressItem,
    undefined
  )

  useEffect(() => {
    if (!pending && state === undefined) {
      formRef.current?.reset()
      toast.success("Article de presse ajouté")
    }
  }, [pending, state])

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="title">Titre *</Label>
          <Input id="title" name="title" required placeholder="Titre de l'article" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="outlet">Média / Publication</Label>
          <Input id="outlet" name="outlet" placeholder="Ex: Le Monde, RFI..." />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="url">URL de l&apos;article</Label>
          <Input id="url" name="url" placeholder="https://..." />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="publishedDate">Date de publication</Label>
          <Input id="publishedDate" name="publishedDate" type="date" />
        </div>
      </div>

      <ImageUpload name="coverImage" label="Image de couverture" />

      <div className="space-y-1.5">
        <Label htmlFor="excerpt">Extrait</Label>
        <Textarea id="excerpt" name="excerpt" rows={2} placeholder="Résumé de l'article" />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Ajout..." : "Ajouter l'article"}
      </Button>
    </form>
  )
}
