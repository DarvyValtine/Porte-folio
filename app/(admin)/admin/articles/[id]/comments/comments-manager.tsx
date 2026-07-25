"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Check, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type Comment = {
  id: number
  authorName: string
  authorEmail: string | null
  content: string
  isApproved: boolean
  createdAt: Date | string
}

export function CommentsManager({ comments, articleId }: { comments: Comment[]; articleId: number }) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  async function approve(id: number) {
    startTransition(async () => {
      await fetch("/api/admin/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isApproved: true }),
      })
      toast.success("Commentaire approuvé")
      router.refresh()
    })
  }

  async function reject(id: number) {
    startTransition(async () => {
      await fetch("/api/admin/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isApproved: false }),
      })
      toast.success("Commentaire masqué")
      router.refresh()
    })
  }

  async function remove(id: number) {
    startTransition(async () => {
      await fetch(`/api/admin/comments?id=${id}`, { method: "DELETE" })
      toast.success("Commentaire supprimé")
      router.refresh()
    })
  }

  if (comments.length === 0) {
    return (
      <p className="rounded-xl border border-border/60 p-6 text-center text-sm text-muted-foreground">
        Aucun commentaire pour cet article.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {comments.map((c) => (
        <div
          key={c.id}
          className={`rounded-xl border p-4 ${
            c.isApproved ? "border-border/60" : "border-dashed border-muted-foreground/30 bg-muted/30"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{c.authorName}</span>
                {c.authorEmail && (
                  <span className="text-xs text-muted-foreground">{c.authorEmail}</span>
                )}
                <Badge variant={c.isApproved ? "default" : "secondary"} className="ml-auto">
                  {c.isApproved ? "Approuvé" : "En attente"}
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.content}</p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                {new Date(c.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {c.isApproved ? (
                <Button variant="ghost" size="icon-sm" onClick={() => reject(c.id)} title="Masquer">
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              ) : (
                <Button variant="ghost" size="icon-sm" onClick={() => approve(c.id)} title="Approuver">
                  <Check className="h-4 w-4 text-emerald-500" />
                </Button>
              )}
              <Button variant="ghost" size="icon-sm" onClick={() => remove(c.id)} title="Supprimer">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}