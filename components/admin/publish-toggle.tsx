"use client"

import { useTransition } from "react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export function PublishToggle({
  published,
  onToggle,
}: {
  published: boolean
  onToggle: (next: boolean) => Promise<{ success: boolean; error?: string }>
}) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await onToggle(!published)
          if (result.success) {
            toast.success(published ? "Passé en brouillon" : "Publié")
          }
        })
      }
    >
      <Badge variant={published ? "default" : "secondary"} className="cursor-pointer">
        {pending ? "..." : published ? "Publié" : "Brouillon"}
      </Badge>
    </button>
  )
}
