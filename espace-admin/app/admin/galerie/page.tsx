import Image from "next/image"
import { getAllGalleryItemsAdmin } from "@/lib/db/admin-queries"
import { deleteGalleryItem } from "@/lib/actions/gallery"
import { GalleryForm } from "@/components/admin/gallery-form"
import { DeleteButton } from "@/components/admin/delete-button"
import { Card, CardContent } from "@/components/ui/card"

export default async function AdminGaleriePage() {
  const items = await getAllGalleryItemsAdmin()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Galerie</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {items.length} photo{items.length !== 1 ? "s" : ""}
        </p>
      </div>

      <Card className="max-w-2xl border-border/60">
        <CardContent className="p-5">
          <GalleryForm />
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
          Aucune photo pour l&apos;instant.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-border/60 bg-card"
            >
              <div className="relative aspect-[4/3] bg-muted">
                <Image src={item.imageUrl} alt={item.title || ""} fill className="object-cover" />
              </div>
              <div className="flex items-start justify-between gap-2 p-3">
                <div className="min-w-0">
                  {item.title && (
                    <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                  )}
                  {item.caption && (
                    <p className="line-clamp-2 text-xs text-muted-foreground">{item.caption}</p>
                  )}
                </div>
                <DeleteButton
                  confirmMessage="Supprimer cette photo ?"
                  onDelete={async () => {
                    "use server"
                    await deleteGalleryItem(item.id)
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
