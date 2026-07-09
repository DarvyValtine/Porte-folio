"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function DeleteButton({
  onDelete,
  confirmMessage = "Supprimer cet élément ? Cette action est irréversible.",
}: {
  onDelete: () => Promise<{ success: boolean; error?: string } | undefined>
  confirmMessage?: string
}) {
  const [pending, startTransition] = useTransition()

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Supprimer" />}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>{confirmMessage}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Annuler</Button>} />
          <DialogClose
            render={
              <Button variant="destructive" disabled={pending}>
                {pending ? "Suppression..." : "Supprimer"}
              </Button>
            }
            onClick={() =>
              startTransition(() => {
                onDelete()
              })
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
