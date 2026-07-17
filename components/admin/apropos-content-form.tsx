"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateSiteContent } from "@/lib/actions/site-content"
import { UploadthingUpload } from "@/components/admin/uploadthing-upload"
import { useSave, Section } from "@/components/admin/form-helpers"

type ValueItem = { title: string; text: string }

type AProposData = {
  headerEyebrow: string
  headerTitle: string
  headerDescription: string
  paragraph1: string
  paragraph2: string
  quote: string
  valuesTitle: string
  values: ValueItem[]
  ctaText: string
  ctaLabel: string
  ctaLink: string
  image: string
}

export function AProposContentForm({ data }: { data: AProposData }) {
  const [form, setForm] = useState(data)
  const { save, saving } = useSave("a_propos")
  const dirty = JSON.stringify(form) !== JSON.stringify(data)

  return (
    <Section title="À propos">
      <div className="space-y-3">
        <Field label="Sur-titre (en-tête)" value={form.headerEyebrow} onChange={(v) => setForm({ ...form, headerEyebrow: v })} />
        <Field label="Titre (en-tête)" value={form.headerTitle} onChange={(v) => setForm({ ...form, headerTitle: v })} textarea rows={2} />
        <Field label="Description (en-tête)" value={form.headerDescription} onChange={(v) => setForm({ ...form, headerDescription: v })} textarea rows={2} />

        <Field label="Paragraphe 1" value={form.paragraph1} onChange={(v) => setForm({ ...form, paragraph1: v })} textarea rows={4} />
        <Field label="Paragraphe 2" value={form.paragraph2} onChange={(v) => setForm({ ...form, paragraph2: v })} textarea rows={4} />
        <Field label="Citation" value={form.quote} onChange={(v) => setForm({ ...form, quote: v })} textarea rows={2} />

        <Field label="Titre de la section valeurs" value={form.valuesTitle} onChange={(v) => setForm({ ...form, valuesTitle: v })} />

        <div>
          <Label>Valeurs</Label>
          <div className="space-y-2">
            {form.values.map((val, i) => (
              <div key={i} className="rounded-lg border border-border/60 p-3">
                <input
                  className="mb-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                  value={val.title}
                  onChange={(e) => {
                    const values = [...form.values]
                    values[i] = { ...values[i], title: e.target.value }
                    setForm({ ...form, values })
                  }}
                  placeholder="Titre"
                />
                <textarea
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                  value={val.text}
                  onChange={(e) => {
                    const values = [...form.values]
                    values[i] = { ...values[i], text: e.target.value }
                    setForm({ ...form, values })
                  }}
                  rows={2}
                  placeholder="Texte"
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, values: form.values.filter((_, j) => j !== i) })}
                  className="mt-1 text-xs text-destructive hover:underline"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setForm({ ...form, values: [...form.values, { title: "", text: "" }] })}
            className="mt-2 text-xs text-primary hover:underline"
          >
            + Ajouter une valeur
          </button>
        </div>

        <Field label="Texte CTA" value={form.ctaText} onChange={(v) => setForm({ ...form, ctaText: v })} textarea rows={2} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Label bouton CTA" value={form.ctaLabel} onChange={(v) => setForm({ ...form, ctaLabel: v })} />
          <Field label="Lien CTA" value={form.ctaLink} onChange={(v) => setForm({ ...form, ctaLink: v })} />
        </div>

        <UploadthingUpload
          name="apropos-image"
          label="Image portrait"
          defaultValue={form.image}
          onChange={(url) => setForm({ ...form, image: url })}
        />

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
