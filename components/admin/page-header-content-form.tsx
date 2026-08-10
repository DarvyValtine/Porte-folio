"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Section, useSave } from "@/components/admin/form-helpers"

type PageHeaderData = {
  eyebrow: string
  title: string
  description: string
}

export function PageHeaderContentForm({
  sectionKey,
  title,
  data,
}: {
  sectionKey: string
  title: string
  data: PageHeaderData
}) {
  const [form, setForm] = useState(data)
  const { save, saving } = useSave(sectionKey)
  const dirty = JSON.stringify(form) !== JSON.stringify(data)

  return (
    <Section title={title}>
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Texte d&apos;introduction affiché en haut de la page.
        </p>
        <Field label="Sur-titre (en-tête)" value={form.eyebrow} onChange={(v) => setForm({ ...form, eyebrow: v })} />
        <Field label="Titre (en-tête)" value={form.title} onChange={(v) => setForm({ ...form, title: v })} textarea rows={2} />
        <Field label="Description (en-tête)" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea rows={3} />
        <Button onClick={() => save(form)} disabled={saving || !dirty} size="sm">
          {saving ? "Enregistrement..." : dirty ? "Enregistrer" : "À jour"}
        </Button>
      </div>
    </Section>
  )
}

function Field({ label, value, onChange, textarea, rows }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; rows?: number }) {
  return (
    <div>
      <Label>{label}</Label>
      {textarea ? (
        <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows ?? 3} />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  )
}
