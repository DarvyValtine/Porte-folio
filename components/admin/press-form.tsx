"use client"

import { useActionState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/admin/file-upload"
import { createPressItem } from "@/lib/actions/press"

export function PressForm() {
  const [state, formAction, pending] = useActionState(createPressItem, undefined)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!pending && !state?.error) {
      formRef.current?.reset()
    }
  }, [pending, state])

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="title">Titre</Label>
          <Input id="title" name="title" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="outlet">Média / publication</Label>
          <Input id="outlet" name="outlet" placeholder="Le Monde, RFI..." />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="url">Lien vers l&apos;article</Label>
          <Input id="url" name="url" placeholder="https://..." />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="publishedDate">Date de publication</Label>
          <Input id="publishedDate" name="publishedDate" type="date" />
        </div>
      </div>
      <FileUpload name="coverImage" label="Image (optionnel)" />
      <div className="space-y-1.5">
        <Label htmlFor="excerpt">Résumé</Label>
        <Textarea id="excerpt" name="excerpt" rows={2} />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Ajout..." : "Ajouter l'article de presse"}
      </Button>
    </form>
  )
}
