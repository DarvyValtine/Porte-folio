"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Section, useSave } from "@/components/admin/form-helpers"

type TimelineItem = { period: string; title: string; org: string; text?: string }
type PubItem = { title: string; source: string; url: string }

type ParcoursData = {
  header: { eyebrow: string; title: string; description: string }
  reiper: { heading: string; items: TimelineItem[] }
  acbef: { heading: string; subheading: string; items: TimelineItem[] }
  education: { heading: string; items: TimelineItem[] }
  certifications: { heading: string; items: string[] }
  engagements: { heading: string; items: string[] }
  publications: { heading: string; items: PubItem[] }
  expertise: { heading: string; items: string[] }
}

export function ParcoursContentForm({ data }: { data: ParcoursData }) {
  const [form, setForm] = useState(data)
  const dirty = JSON.stringify(form) !== JSON.stringify(data)
  const { save, saving } = useSave("parcours")

  return (
    <Section title="Parcours & réalisations">
      <div className="space-y-4">
        <p className="text-xs text-muted-foreground">Toutes les sections du parcours sont sauvegardées ensemble.</p>

        <div className="rounded-lg border border-border/60 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">En-tête de page</p>
          <div className="space-y-2">
            <Field label="Sur-titre" value={form.header.eyebrow} onChange={(v) => setForm({ ...form, header: { ...form.header, eyebrow: v } })} />
            <Field label="Titre" value={form.header.title} onChange={(v) => setForm({ ...form, header: { ...form.header, title: v } })} textarea rows={2} />
            <Field label="Description" value={form.header.description} onChange={(v) => setForm({ ...form, header: { ...form.header, description: v } })} textarea rows={2} />
          </div>
        </div>

        <div className="rounded-lg border border-border/60 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">REIPER — Expériences</p>
          <Field label="Titre de section" value={form.reiper.heading} onChange={(v) => setForm({ ...form, reiper: { ...form.reiper, heading: v } })} />
          <ArrayEditor
            items={form.reiper.items}
            onChange={(items) => setForm({ ...form, reiper: { ...form.reiper, items } })}
            template={{ period: "", title: "", org: "", text: "" }}
            fields={[
              { key: "period", label: "Période", type: "text" },
              { key: "title", label: "Titre", type: "text" },
              { key: "org", label: "Organisation", type: "text" },
              { key: "text", label: "Description", type: "textarea" },
            ]}
          />
        </div>

        <div className="rounded-lg border border-border/60 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ACBEF — Expériences</p>
          <Field label="Titre de section" value={form.acbef.heading} onChange={(v) => setForm({ ...form, acbef: { ...form.acbef, heading: v } })} />
          <Field label="Sous-titre" value={form.acbef.subheading} onChange={(v) => setForm({ ...form, acbef: { ...form.acbef, subheading: v } })} />
          <ArrayEditor
            items={form.acbef.items}
            onChange={(items) => setForm({ ...form, acbef: { ...form.acbef, items } })}
            template={{ period: "", title: "", org: "" }}
            fields={[
              { key: "period", label: "Période", type: "text" },
              { key: "title", label: "Titre", type: "text" },
              { key: "org", label: "Organisation", type: "text" },
            ]}
          />
        </div>

        <div className="rounded-lg border border-border/60 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Formation</p>
          <Field label="Titre de section" value={form.education.heading} onChange={(v) => setForm({ ...form, education: { ...form.education, heading: v } })} />
          <ArrayEditor
            items={form.education.items}
            onChange={(items) => setForm({ ...form, education: { ...form.education, items } })}
            template={{ period: "", title: "", org: "" }}
            fields={[
              { key: "period", label: "Année", type: "text" },
              { key: "title", label: "Diplôme", type: "text" },
              { key: "org", label: "Établissement", type: "text" },
            ]}
          />
        </div>

        <div className="rounded-lg border border-border/60 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Certifications</p>
          <Field label="Titre de section" value={form.certifications.heading} onChange={(v) => setForm({ ...form, certifications: { ...form.certifications, heading: v } })} />
          <StringArrayEditor
            items={form.certifications.items}
            onChange={(items) => setForm({ ...form, certifications: { ...form.certifications, items } })}
            placeholder="Nom de la certification"
          />
        </div>

        <div className="rounded-lg border border-border/60 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Engagements</p>
          <Field label="Titre de section" value={form.engagements.heading} onChange={(v) => setForm({ ...form, engagements: { ...form.engagements, heading: v } })} />
          <StringArrayEditor
            items={form.engagements.items}
            onChange={(items) => setForm({ ...form, engagements: { ...form.engagements, items } })}
            placeholder="Description de l'engagement"
            textarea
          />
        </div>

        <div className="rounded-lg border border-border/60 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Publications</p>
          <Field label="Titre de section" value={form.publications.heading} onChange={(v) => setForm({ ...form, publications: { ...form.publications, heading: v } })} />
          <ArrayEditor
            items={form.publications.items}
            onChange={(items) => setForm({ ...form, publications: { ...form.publications, items } })}
            template={{ title: "", source: "", url: "" }}
            fields={[
              { key: "title", label: "Titre", type: "text" },
              { key: "source", label: "Source", type: "text" },
              { key: "url", label: "URL", type: "text" },
            ]}
          />
        </div>

        <div className="rounded-lg border border-border/60 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Domaines d'expertise</p>
          <Field label="Titre de section" value={form.expertise.heading} onChange={(v) => setForm({ ...form, expertise: { ...form.expertise, heading: v } })} />
          <StringArrayEditor
            items={form.expertise.items}
            onChange={(items) => setForm({ ...form, expertise: { ...form.expertise, items } })}
            placeholder="Domaine d'expertise"
          />
        </div>

        <Button onClick={() => save(form)} disabled={saving || !dirty} size="sm">
          {saving ? "Enregistrement..." : dirty ? "Tout enregistrer" : "À jour"}
        </Button>
      </div>
    </Section>
  )
}

function Field({ label, value, onChange, textarea, rows }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; rows?: number }) {
  return (
    <div className="mb-2">
      <Label className="text-xs">{label}</Label>
      {textarea ? (
        <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows ?? 2} className="text-sm" />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="text-sm" />
      )}
    </div>
  )
}

function ArrayEditor<T extends Record<string, string>>({
  items,
  onChange,
  template,
  fields,
}: {
  items: T[]
  onChange: (items: T[]) => void
  template: T
  fields: { key: keyof T; label: string; type: "text" | "textarea" }[]
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-border/40 bg-secondary/20 p-3">
          <div className="space-y-1.5">
            {fields.map((f) => (
              f.type === "textarea" ? (
                <div key={String(f.key)}>
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">{f.label}</Label>
                  <textarea
                    className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm"
                    value={item[f.key] as string}
                    onChange={(e) => {
                      const next = [...items]
                      next[i] = { ...next[i], [f.key]: e.target.value }
                      onChange(next)
                    }}
                    rows={2}
                  />
                </div>
              ) : (
                <div key={String(f.key)}>
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">{f.label}</Label>
                  <input
                    className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm"
                    value={item[f.key] as string}
                    onChange={(e) => {
                      const next = [...items]
                      next[i] = { ...next[i], [f.key]: e.target.value }
                      onChange(next)
                    }}
                  />
                </div>
              )
            ))}
          </div>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="mt-1 text-xs text-destructive hover:underline"
          >
            Supprimer
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { ...template }])}
        className="text-xs text-primary hover:underline"
      >
        + Ajouter
      </button>
    </div>
  )
}

function StringArrayEditor({
  items,
  onChange,
  placeholder,
  textarea,
}: {
  items: string[]
  onChange: (items: string[]) => void
  placeholder: string
  textarea?: boolean
}) {
  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          {textarea ? (
            <textarea
              className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm"
              value={item}
              onChange={(e) => {
                const next = [...items]
                next[i] = e.target.value
                onChange(next)
              }}
              rows={2}
              placeholder={placeholder}
            />
          ) : (
            <input
              className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm"
              value={item}
              onChange={(e) => {
                const next = [...items]
                next[i] = e.target.value
                onChange(next)
              }}
              placeholder={placeholder}
            />
          )}
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="shrink-0 text-xs text-destructive hover:underline"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="text-xs text-primary hover:underline"
      >
        + Ajouter
      </button>
    </div>
  )
}
