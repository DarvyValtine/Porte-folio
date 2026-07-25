"use client"

import { useState, useEffect, useCallback } from "react"
import { Heart } from "lucide-react"

function getOrCreateSession(): string {
  if (typeof window === "undefined") return ""
  let sid = localStorage.getItem("_sid")
  if (!sid) {
    sid = crypto.randomUUID()
    localStorage.setItem("_sid", sid)
  }
  return sid
}

export function LikeButton({ articleId }: { articleId: number }) {
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const sid = getOrCreateSession()
    fetch(`/api/likes?articleId=${articleId}&sessionId=${sid}`)
      .then((r) => r.json())
      .then((d) => setLiked(d.liked))
      .catch(() => {})
  }, [articleId])

  const toggle = useCallback(async () => {
    if (loading) return
    setLoading(true)
    const sid = getOrCreateSession()
    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, sessionId: sid }),
      })
      const d = await res.json()
      setLiked(d.liked)
    } catch {
    } finally {
      setLoading(false)
    }
  }, [articleId, loading])

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
    >
      <Heart
        className={`h-4 w-4 transition-colors ${
          liked ? "fill-red-500 text-red-500" : ""
        }`}
      />
      {liked ? "Aimé" : "J'aime"}
    </button>
  )
}