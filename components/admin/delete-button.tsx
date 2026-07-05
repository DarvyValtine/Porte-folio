"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DeleteButton({
  onDelete,
  confirmMessage = "Supprimer cet élément ? Cette action est irréversible.",
}: {
  onDelete: () => Promise<void>
  confirmMessage?: string
}) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      disabled={pending}
      onClick={() => {
        if (window.confirm(confirmMessage)) {
          startTransition(() => {
            onDelete()
          })
        }
      }}
      aria-label="Supprimer"
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  )
}
