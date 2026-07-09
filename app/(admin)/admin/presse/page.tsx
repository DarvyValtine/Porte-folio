import { getAllPressItemsAdmin } from "@/lib/db/admin-queries"
import { PressTable } from "./press-table"
import { PressForm } from "@/components/admin/press-form"
import { Card, CardContent } from "@/components/ui/card"

export const dynamic = "force-dynamic"

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

      <PressTable items={items} />
    </div>
  )
}
