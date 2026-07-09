"use client"

import { useRouter } from "next/navigation"
import { SafeImage } from "@/components/safe-image"
import { DeleteButton } from "@/components/admin/delete-button"
import { deleteGalleryItem } from "@/lib/actions/gallery"
import { toast } from "sonner"

type GalleryItem = {
  id: number
  title: string | null
  caption: string | null
  imageUrl: string
}

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const router = useRouter()

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        Aucune photo pour l&apos;instant.
      </p>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="overflow-hidden rounded-xl border border-border/60 bg-card"
        >
          <div className="relative aspect-[4/3] bg-muted">
            <SafeImage
              src={item.imageUrl}
              alt={item.title || ""}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex items-start justify-between gap-2 p-3">
            <div className="min-w-0">
              {item.title && (
                <p className="truncate text-sm font-medium text-foreground">
                  {item.title}
                </p>
              )}
              {item.caption && (
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {item.caption}
                </p>
              )}
            </div>
            <DeleteButton
              confirmMessage="Supprimer cette photo ?"
              onDelete={async () => {
                const result = await deleteGalleryItem(item.id)
                if (result.success) {
                  toast.success("Photo supprimée")
                  router.refresh()
                }
                return result
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
