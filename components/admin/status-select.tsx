"use client"

import { useTransition } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const statusLabels: Record<string, string> = {
  pending: "En attente",
  contacted: "Contacté",
  closed: "Clôturé",
}

export function StatusSelect({
  id,
  status,
  onChange,
}: {
  id: number
  status: string
  onChange: (id: number, status: "pending" | "contacted" | "closed") => Promise<{ success: boolean; error?: string }>
}) {
  const [pending, startTransition] = useTransition()

  return (
    <Select
      value={status}
      disabled={pending}
      onValueChange={(value) =>
        startTransition(async () => {
          await onChange(id, value as "pending" | "contacted" | "closed")
        })
      }
    >
      <SelectTrigger size="sm">
        <SelectValue>{statusLabels[status] ?? status}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">En attente</SelectItem>
        <SelectItem value="contacted">Contacté</SelectItem>
        <SelectItem value="closed">Clôturé</SelectItem>
      </SelectContent>
    </Select>
  )
}
