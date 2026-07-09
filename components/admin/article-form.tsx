"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/admin/image-upload"
import type { ActionState } from "@/lib/actions/articles"

type Article = {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  category: string | null
  published: boolean
}

export function ArticleForm({
  article,
  action,
}: {
  article?: Article
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
}) {
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="title">Titre</Label>
        <Input id="title" name="title" required defaultValue={article?.title} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input
          id="slug"
          name="slug"
          placeholder="généré automatiquement si laissé vide"
          defaultValue={article?.slug}
        />
        <p className="text-xs text-muted-foreground">
          Visible sur /articles/votre-slug. Laissez vide pour le générer depuis le titre.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="category">Catégorie</Label>
          <Input id="category" name="category" defaultValue={article?.category ?? ""} />
        </div>
        <div className="space-y-1.5">
          <ImageUpload
            name="coverImage"
            label="Image de couverture"
            defaultValue={article?.coverImage}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="excerpt">Extrait</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          placeholder="Résumé court affiché dans les listes d'articles"
          defaultValue={article?.excerpt ?? ""}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="content">Contenu</Label>
        <Textarea
          id="content"
          name="content"
          required
          rows={14}
          className="min-h-72 font-mono text-sm"
          defaultValue={article?.content}
        />
        <p className="text-xs text-muted-foreground">Markdown supporté.</p>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          name="published"
          defaultChecked={article?.published ?? false}
          className="h-4 w-4 rounded border-input"
        />
        Publier immédiatement
      </label>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Enregistrement..." : article ? "Enregistrer les modifications" : "Créer l'article"}
        </Button>
        <Button asChild variant="outline" type="button">
          <Link href="/admin/articles">Annuler</Link>
        </Button>
      </div>
    </form>
  )
}
