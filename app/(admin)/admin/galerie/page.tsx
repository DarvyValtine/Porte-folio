import { getAllGalleryItemsAdmin } from "@/lib/db/admin-queries"
import { GalleryForm } from "@/components/admin/gallery-form"
import { Card, CardContent } from "@/components/ui/card"
import { GalleryGrid } from "./gallery-grid"

export const dynamic = "force-dynamic"

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

      <GalleryGrid items={items} />
    </div>
  )
}
