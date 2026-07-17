"use client"

import { useState, useCallback } from "react"
import { updateSiteContent } from "@/lib/actions/site-content"
import { ChevronDown, ChevronUp } from "lucide-react"

export function Section({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
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

export function useSave(key: string) {
  const [saving, setSaving] = useState(false)

  const save = useCallback(async (value: unknown) => {
    setSaving(true)
    const fd = new FormData()
    fd.append("_key", key)
    fd.append("value", JSON.stringify(value))
    await updateSiteContent(undefined, fd)
    setSaving(false)
  }, [key])

  return { save, saving }
}
