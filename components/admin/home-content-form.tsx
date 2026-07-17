"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateSiteContent } from "@/lib/actions/site-content"
import { UploadthingUpload } from "@/components/admin/uploadthing-upload"
import { ChevronDown, ChevronUp, Check, Loader2 } from "lucide-react"

function Section({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  return (
    <div className="rounded-xl border border-border/60 bg-card">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left font-serif text-lg font-semibold text-foreground"
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && <div className="space-y-4 border-t border-border/60 px-5 py-4">{children}</div>}
    </div>
  )
}

function SaveButton({ saving, dirty }: { saving: boolean; dirty: boolean }) {
  if (saving) return <Button disabled size="sm"><Loader2 className="mr-1 h-3 w-3 animate-spin" />Enregistrement...</Button>
  if (!dirty) return <Button disabled size="sm" variant="outline"><Check className="mr-1 h-3 w-3" /> À jour</Button>
  return <Button type="submit" size="sm">Enregistrer</Button>
}

function useSave(key: string) {
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const save = useCallback(async (value: unknown) => {
    setSaving(true)
    setSuccess(false)
    const fd = new FormData()
    fd.append("_key", key)
    fd.append("value", JSON.stringify(value))
    await updateSiteContent(undefined, fd)
    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
  }, [key])

  return { save, saving, success }
}

export function HomeContentForm({
  hero,
  intro,
  focusAreas,
  cta,
}: {
  hero: Record<string, unknown>
  intro: Record<string, unknown>
  focusAreas: Record<string, unknown>
  cta: Record<string, unknown>
}) {
  return (
    <div className="space-y-6">
      <HeroSection defaultData={hero as any} />
      <IntroSection defaultData={intro as any} />
      <FocusAreasSection defaultData={focusAreas as any} />
      <CtaSection defaultData={cta as any} />
    </div>
  )
}

function HeroSection({ defaultData }: { defaultData: { badge: string; title: string; ctaPrimary: string; ctaPrimaryLink: string; ctaSecondary: string; ctaSecondaryLink: string; image: string } }) {
  const [form, setForm] = useState(defaultData)
  const { save, saving } = useSave("home_hero")
  const dirty = JSON.stringify(form) !== JSON.stringify(defaultData)

  return (
    <Section title="Bannière principale (Hero)">
      <div className="space-y-3">
        <Field label="Badge" value={form.badge} onChange={(v) => setForm({ ...form, badge: v })} />
        <Field label="Titre principal" value={form.title} onChange={(v) => setForm({ ...form, title: v })} textarea rows={2} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Texte bouton 1" value={form.ctaPrimary} onChange={(v) => setForm({ ...form, ctaPrimary: v })} />
          <Field label="Lien bouton 1" value={form.ctaPrimaryLink} onChange={(v) => setForm({ ...form, ctaPrimaryLink: v })} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Texte bouton 2" value={form.ctaSecondary} onChange={(v) => setForm({ ...form, ctaSecondary: v })} />
          <Field label="Lien bouton 2" value={form.ctaSecondaryLink} onChange={(v) => setForm({ ...form, ctaSecondaryLink: v })} />
        </div>
        <UploadthingUpload
          name="hero-image"
          label="Image"
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

function IntroSection({ defaultData }: { defaultData: { eyebrow: string; title: string; body: string; stats: { value: string; label: string }[]; ctaLabel: string; ctaLink: string; image: string } }) {
  const [form, setForm] = useState(defaultData)
  const { save, saving } = useSave("home_intro")
  const dirty = JSON.stringify(form) !== JSON.stringify(defaultData)

  return (
    <Section title="Section d'introduction">
      <div className="space-y-3">
        <Field label="Sur-titre" value={form.eyebrow} onChange={(v) => setForm({ ...form, eyebrow: v })} />
        <Field label="Titre" value={form.title} onChange={(v) => setForm({ ...form, title: v })} textarea rows={2} />
        <Field label="Texte" value={form.body} onChange={(v) => setForm({ ...form, body: v })} textarea rows={4} />
        <UploadthingUpload
          name="intro-image"
          label="Image"
          defaultValue={form.image}
          onChange={(url) => setForm({ ...form, image: url })}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Texte du lien" value={form.ctaLabel} onChange={(v) => setForm({ ...form, ctaLabel: v })} />
          <Field label="Lien" value={form.ctaLink} onChange={(v) => setForm({ ...form, ctaLink: v })} />
        </div>
        <Button onClick={() => save(form)} disabled={saving || !dirty} size="sm">
          {saving ? "Enregistrement..." : dirty ? "Enregistrer" : "À jour"}
        </Button>
      </div>
    </Section>
  )
}

function FocusAreasSection({ defaultData }: { defaultData: { eyebrow: string; title: string; items: { icon: string; title: string; description: string }[] } }) {
  const [form, setForm] = useState(defaultData)
  const { save, saving } = useSave("home_focus_areas")
  const dirty = JSON.stringify(form) !== JSON.stringify(defaultData)

  return (
    <Section title="Domaines d'intervention">
      <div className="space-y-3">
        <Field label="Sur-titre" value={form.eyebrow} onChange={(v) => setForm({ ...form, eyebrow: v })} />
        <Field label="Titre" value={form.title} onChange={(v) => setForm({ ...form, title: v })} textarea rows={2} />
        <div>
          <Label>Items</Label>
          <div className="space-y-2">
            {form.items.map((item, i) => (
              <div key={i} className="rounded-lg border border-border/60 p-3">
                <input
                  className="mb-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                  value={item.title}
                  onChange={(e) => {
                    const items = [...form.items]
                    items[i] = { ...items[i], title: e.target.value }
                    setForm({ ...form, items })
                  }}
                  placeholder="Titre"
                />
                <input
                  className="mb-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                  value={item.icon}
                  onChange={(e) => {
                    const items = [...form.items]
                    items[i] = { ...items[i], icon: e.target.value }
                    setForm({ ...form, items })
                  }}
                  placeholder="Icône (HeartHandshake, Scale, Users, PhoneCall)"
                />
                <textarea
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                  value={item.description}
                  onChange={(e) => {
                    const items = [...form.items]
                    items[i] = { ...items[i], description: e.target.value }
                    setForm({ ...form, items })
                  }}
                  rows={2}
                  placeholder="Description"
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, items: form.items.filter((_, j) => j !== i) })}
                  className="mt-1 text-xs text-destructive hover:underline"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setForm({ ...form, items: [...form.items, { icon: "HeartHandshake", title: "", description: "" }] })}
            className="mt-2 text-xs text-primary hover:underline"
          >
            + Ajouter un domaine
          </button>
        </div>
        <Button onClick={() => save(form)} disabled={saving || !dirty} size="sm">
          {saving ? "Enregistrement..." : dirty ? "Enregistrer" : "À jour"}
        </Button>
      </div>
    </Section>
  )
}

function CtaSection({ defaultData }: { defaultData: { title: string; body: string; buttonText: string; buttonLink: string } }) {
  const [form, setForm] = useState(defaultData)
  const { save, saving } = useSave("home_cta")
  const dirty = JSON.stringify(form) !== JSON.stringify(defaultData)

  return (
    <Section title="Appel à l'action (CTA)">
      <div className="space-y-3">
        <Field label="Titre" value={form.title} onChange={(v) => setForm({ ...form, title: v })} textarea rows={2} />
        <Field label="Texte" value={form.body} onChange={(v) => setForm({ ...form, body: v })} textarea rows={3} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Texte du bouton" value={form.buttonText} onChange={(v) => setForm({ ...form, buttonText: v })} />
          <Field label="Lien du bouton" value={form.buttonLink} onChange={(v) => setForm({ ...form, buttonLink: v })} />
        </div>
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
