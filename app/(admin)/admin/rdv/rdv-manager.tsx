"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusSelect } from "@/components/admin/status-select"
import { DeleteButton } from "@/components/admin/delete-button"
import { updateAppointmentStatus, deleteAppointment } from "@/lib/actions/appointments"
import { toast } from "sonner"

type Appointment = {
  id: number
  name: string
  email: string
  phone: string | null
  preferredDate: string | null
  subject: string | null
  message: string
  status: string
  createdAt: Date | string
}

const statusBadgeVariant: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "default",
  contacted: "outline",
  closed: "secondary",
}

const statusLabels: Record<string, string> = {
  pending: "En attente",
  contacted: "Contacté",
  closed: "Clôturé",
}

function formatDate(d: Date | string | null) {
  if (!d) return ""
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function RdvManager({ appointments }: { appointments: Appointment[] }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = useMemo(() => {
    let result = appointments

    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          (a.subject?.toLowerCase().includes(q) ?? false)
      )
    }

    return result
  }, [appointments, statusFilter, searchQuery])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="contacted">Contacté</TabsTrigger>
            <TabsTrigger value="closed">Clôturé</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative ml-auto max-w-xs">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
          {appointments.length === 0
            ? "Aucun rendez-vous pour l'instant."
            : "Aucun rendez-vous ne correspond aux filtres."}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-border/60 bg-card p-4 transition-shadow hover:shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{m.name}</p>
                    <Badge
                      variant={statusBadgeVariant[m.status] ?? "secondary"}
                    >
                      {statusLabels[m.status] ?? m.status}
                    </Badge>
                  </div>
                  <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <a
                      href={`mailto:${m.email}`}
                      className="hover:text-primary"
                    >
                      {m.email}
                    </a>
                    {m.phone && <span>{m.phone}</span>}
                    <span>{formatDate(m.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusSelect
                    id={m.id}
                    status={m.status}
                    onChange={async (id, status) => {
                      const result = await updateAppointmentStatus(id, status)
                      if (result.success) {
                        toast.success("Statut mis à jour")
                        router.refresh()
                      }
                      return result
                    }}
                  />
                  <DeleteButton
                    confirmMessage={`Supprimer le rendez-vous de ${m.name} ?`}
                    onDelete={async () => {
                      const result = await deleteAppointment(m.id)
                      if (result.success) {
                        toast.success("Rendez-vous supprimé")
                        router.refresh()
                      }
                      return result
                    }}
                  />
                </div>
              </div>
              {m.subject && (
                <p className="mt-3 text-sm font-medium text-foreground">
                  {m.subject}
                </p>
              )}
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {m.message}
              </p>
              {m.preferredDate && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Date souhaitée : {formatDate(m.preferredDate)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
