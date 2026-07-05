"use client"

import { useTransition } from "react"
import { Badge } from "@/components/ui/badge"

export function PublishToggle({
  published,
  onToggle,
}: {
  published: boolean
  onToggle: (next: boolean) => Promise<void>
}) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => onToggle(!published))}
      className="disabled:opacity-50"
    >
      <Badge variant={published ? "default" : "outline"} className="cursor-pointer">
        {published ? "Publié" : "Brouillon"}
      </Badge>
    </button>
  )
}
