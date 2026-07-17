"use client"

import { useState, useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  createAppointmentType,
  updateAppointmentType,
  deleteAppointmentType,
} from "@/lib/actions/appointment-types"
import { Plus, Pencil, Trash2, Check, X } from "lucide-react"

type AppointmentType = { id: number; name: string; description: string | null; isActive: boolean; sortOrder: number }

export function TypesManager({ types: initial }: { types: AppointmentType[] }) {
  const [types, setTypes] = useState(initial)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [createState, createAction, createPending] = useActionState(createAppointmentType, undefined)

  async function handleDelete(id: number) {
    if (!confirm("Supprimer ce type de rendez-vous ?")) return
    await deleteAppointmentType(id)
    setTypes(types.filter((t) => t.id !== id))
  }

  async function handleUpdate(formData: FormData) {
    const result = await updateAppointmentType(undefined, formData)
    if (!result?.error) {
      setEditingId(null)
      const updated = types.map((t) =>
        t.id === Number(formData.get("id"))
          ? { ...t, name: String(formData.get("name") || ""), description: String(formData.get("description") || ""), isActive: formData.get("isActive") === "true" }
          : t
      )
      setTypes(updated)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <h3 className="mb-3 font-serif text-lg font-semibold text-foreground">Ajouter un type</h3>
        <form action={createAction} className="space-y-3">
          <div>
            <Label>Nom *</Label>
            <Input name="name" required placeholder="Ex: Consultation individuelle" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea name="description" rows={2} placeholder="Description optionnelle" />
          </div>
          {createState?.error && <p className="text-sm text-destructive">{createState.error}</p>}
          <Button type="submit" disabled={createPending} size="sm">
            <Plus className="mr-1 h-3 w-3" />
            Ajouter
          </Button>
        </form>
      </div>

      {types.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun type de rendez-vous pour le moment.</p>
      ) : (
        <div className="space-y-2">
          {types.map((t) => (
            <div key={t.id} className="rounded-xl border border-border/60 bg-card p-4">
              {editingId === t.id ? (
                <form action={handleUpdate} className="space-y-3">
                  <input type="hidden" name="id" value={t.id} />
                  <div>
                    <Label>Nom</Label>
                    <Input name="name" defaultValue={t.name} required />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea name="description" defaultValue={t.description || ""} rows={2} />
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="isActive" value="true" defaultChecked={t.isActive} />
                    Actif
                  </label>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm"><Check className="mr-1 h-3 w-3" />Enregistrer</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => setEditingId(null)}><X className="mr-1 h-3 w-3" />Annuler</Button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    {t.description && <p className="text-xs text-muted-foreground">{t.description}</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`mr-2 inline-block h-2 w-2 rounded-full ${t.isActive ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                    <button
                      type="button"
                      onClick={() => setEditingId(t.id)}
                      className="rounded-md p-1 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(t.id)}
                      className="rounded-md p-1 text-muted-foreground hover:bg-secondary/60 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
