"use client"

import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { deletePressItem } from "@/lib/actions/press"
import { toast } from "sonner"
import type { ColumnDef } from "@tanstack/react-table"

type PressItem = {
  id: number
  title: string
  outlet: string | null
  url: string | null
  excerpt: string | null
  publishedDate: string | Date | null
}

function formatDate(d: string | Date | null) {
  if (!d) return null
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function PressTable({ items }: { items: PressItem[] }) {
  const router = useRouter()

  const columns: ColumnDef<PressItem>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Titre",
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-foreground">{row.original.title}</p>
            {row.original.excerpt && (
              <p className="line-clamp-1 text-xs text-muted-foreground">
                {row.original.excerpt}
              </p>
            )}
          </div>
        ),
      },
      {
        accessorKey: "outlet",
        header: "Média",
        cell: ({ row }) =>
          row.original.outlet ? (
            <Badge variant="secondary">{row.original.outlet}</Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: "publishedDate",
        header: "Date",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatDate(row.original.publishedDate) || "—"}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            {row.original.url && (
              <a
                href={row.original.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary hover:underline"
              >
                Voir
              </a>
            )}
            <DeleteButton
              confirmMessage={`Supprimer « ${row.original.title} » ?`}
              onDelete={async () => {
                const result = await deletePressItem(row.original.id)
                if (result.success) {
                  toast.success("Article de presse supprimé")
                  router.refresh()
                }
              }}
            />
          </div>
        ),
      },
    ],
    [router]
  )

  return (
    <DataTable
      columns={columns}
      data={items}
      searchKey="title"
      searchPlaceholder="Rechercher par titre..."
    />
  )
}
