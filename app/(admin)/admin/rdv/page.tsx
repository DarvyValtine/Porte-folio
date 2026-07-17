import { getAllAppointmentsAdmin } from "@/lib/db/admin-queries"
import { RdvManager } from "./rdv-manager"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { List } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminRdvPage() {
  const appointments = await getAllAppointmentsAdmin()
  const pendingCount = appointments.filter((a) => a.status === "pending").length

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            Mes rendez-vous
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {appointments.length} rendez-vous
          {appointments.length !== 1 ? "s" : ""} reçu
          {appointments.length !== 1 ? "s" : ""}
          {pendingCount > 0 && (
            <span className="ml-1.5 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {pendingCount} en attente
            </span>
          )}
        </p>
      </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/rdv/types">
            <List className="h-3.5 w-3.5" />
            Types de RDV
          </Link>
        </Button>
      </div>

      <RdvManager appointments={appointments} />
    </div>
  )
}
