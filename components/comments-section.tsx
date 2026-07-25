"use client"

import { useState, useEffect, useCallback } from "react"
import { MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Comment = {
  id: number
  authorName: string
  content: string
  createdAt: string
}

export function CommentsSection({ articleId }: { articleId: number }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [authorName, setAuthorName] = useState("")
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch(`/api/comments?articleId=${articleId}`)
      .then((r) => r.json())
      .then((d) => setComments(d.comments))
      .catch(() => {})
  }, [articleId])

  const submit = useCallback(async () => {
    if (!authorName.trim() || !content.trim() || submitting) return
    setSubmitting(true)
    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, authorName: authorName.trim(), content: content.trim() }),
      })
      setSubmitted(true)
      setContent("")
    } catch {
    } finally {
      setSubmitting(false)
    }
  }, [articleId, authorName, content, submitting])

  return (
    <div className="mt-12 border-t border-border/60 pt-6">
      <h3 className="mb-6 flex items-center gap-2 font-serif text-xl font-semibold text-foreground">
        <MessageSquare className="h-5 w-5" />
        Commentaires ({comments.length})
      </h3>

      {submitted ? (
        <p className="rounded-xl bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
          Votre commentaire a été envoyé et sera visible après modération.
        </p>
      ) : (
        <div className="space-y-3 rounded-xl border border-border/60 p-4">
          <Input
            placeholder="Votre nom"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
          <Textarea
            placeholder="Votre commentaire..."
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            type="button"
            onClick={submit}
            disabled={submitting || !authorName.trim() || !content.trim()}
            size="sm"
          >
            <Send className="mr-1 h-3 w-3" />
            {submitting ? "Envoi..." : "Envoyer"}
          </Button>
        </div>
      )}

      {comments.length > 0 && (
        <div className="mt-6 space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="rounded-xl border border-border/60 p-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-foreground">{c.authorName}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(c.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {c.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}