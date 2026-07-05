import { getAllAppointmentsAdmin } from "@/lib/db/admin-queries"
import { updateAppointmentStatus, deleteAppointment } from "@/lib/actions/appointments"
import { StatusSelect } from "@/components/admin/status-select"
import { DeleteButton } from "@/components/admin/delete-button"

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function AdminMessagesPage() {
  const messages = await getAllAppointmentsAdmin()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {messages.length} demande{messages.length !== 1 ? "s" : ""} reçue
          {messages.length !== 1 ? "s" : ""} via le formulaire de contact
        </p>
      </div>

      {messages.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
          Aucun message pour l&apos;instant.
        </p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="rounded-xl border border-border/60 bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">{m.name}</p>
                  <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                    <a href={`mailto:${m.email}`} className="hover:text-primary">
                      {m.email}
                    </a>
                    {m.phone && <span>{m.phone}</span>}
                    <span>{formatDate(m.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusSelect id={m.id} status={m.status} onChange={updateAppointmentStatus} />
                  <DeleteButton
                    confirmMessage={`Supprimer le message de ${m.name} ?`}
                    onDelete={async () => {
                      "use server"
                      await deleteAppointment(m.id)
                    }}
                  />
                </div>
              </div>
              {m.subject && (
                <p className="mt-3 text-sm font-medium text-foreground">{m.subject}</p>
              )}
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{m.message}</p>
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
