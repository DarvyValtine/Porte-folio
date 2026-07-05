import { getAllPressItemsAdmin } from "@/lib/db/admin-queries"
import { deletePressItem } from "@/lib/actions/press"
import { PressForm } from "@/components/admin/press-form"
import { DeleteButton } from "@/components/admin/delete-button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function formatDate(d: string | Date | null) {
  if (!d) return null
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default async function AdminPressePage() {
  const items = await getAllPressItemsAdmin()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Presse</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {items.length} article{items.length !== 1 ? "s" : ""} de presse
        </p>
      </div>

      <Card className="max-w-2xl border-border/60">
        <CardContent className="p-5">
          <PressForm />
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
          Aucun article de presse pour l&apos;instant.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-card p-4"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-foreground">{item.title}</p>
                  {item.outlet && <Badge variant="secondary">{item.outlet}</Badge>}
                </div>
                {item.excerpt && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{item.excerpt}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {formatDate(item.publishedDate) && <span>{formatDate(item.publishedDate)}</span>}
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                      Voir l&apos;article
                    </a>
                  )}
                </div>
              </div>
              <DeleteButton
                confirmMessage={`Supprimer « ${item.title} » ?`}
                onDelete={async () => {
                  "use server"
                  await deletePressItem(item.id)
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
