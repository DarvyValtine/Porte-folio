"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useTransition } from "react"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { toggleArticlePublished, deleteArticle } from "@/lib/actions/articles"
import { toast } from "sonner"
import type { ColumnDef } from "@tanstack/react-table"

type Article = {
  id: number
  title: string
  slug: string
  category: string | null
  published: boolean
}

export function ArticlesTable({ articles }: { articles: Article[] }) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  const columns: ColumnDef<Article>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Titre",
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-foreground">{row.original.title}</p>
            <p className="text-xs text-muted-foreground">
              /articles/{row.original.slug}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: "Catégorie",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.category || "—"}
          </span>
        ),
      },
      {
        accessorKey: "published",
        header: "Statut",
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() =>
              startTransition(async () => {
                const result = await toggleArticlePublished(
                  row.original.id,
                  !row.original.published
                )
                if (result.success) {
                  toast.success(
                    row.original.published ? "Passé en brouillon" : "Publié"
                  )
                  router.refresh()
                }
              })
            }
          >
            <Badge
              variant={row.original.published ? "default" : "secondary"}
              className="cursor-pointer"
            >
              {row.original.published ? "Publié" : "Brouillon"}
            </Badge>
          </button>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              asChild
              variant="ghost"
              size="icon-sm"
              aria-label="Modifier"
            >
              <Link href={`/admin/articles/${row.original.id}/edit`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <DeleteButton
              confirmMessage={`Supprimer « ${row.original.title} » ?`}
              onDelete={async () => {
                const result = await deleteArticle(row.original.id)
                if (result.success) {
                  toast.success("Article supprimé")
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
      data={articles}
      searchKey="title"
      searchPlaceholder="Rechercher par titre..."
    />
  )
}
