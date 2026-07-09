"use client"

import { useActionState } from "react"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createAppointment, type ActionState } from "@/lib/actions/appointments"

export function RdvForm() {
  const [state, formAction, pending] = useActionState<ActionState>(
    createAppointment,
    undefined
  )

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 px-8 py-16 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10">
          <Calendar className="size-7 text-primary" />
        </div>
        <h2 className="mt-5 font-serif text-2xl font-semibold">
          Demande envoyée
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Votre demande de rendez-vous a bien été reçue. Je vous recontacterai
          dans les plus brefs délais pour convenir d&apos;un créneau.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nom complet *</Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="Votre nom"
            aria-invalid={!!state?.fieldErrors?.name}
          />
          {state?.fieldErrors?.name && (
            <p className="text-xs text-destructive">{state.fieldErrors.name[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="vous@exemple.fr"
            aria-invalid={!!state?.fieldErrors?.email}
          />
          {state?.fieldErrors?.email && (
            <p className="text-xs text-destructive">{state.fieldErrors.email[0]}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+33 6 12 34 56 78"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="preferredDate">Date souhaitée</Label>
          <Input id="preferredDate" name="preferredDate" type="date" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subject">Sujet</Label>
        <Input
          id="subject"
          name="subject"
          placeholder="Consultation, collaboration, intervention..."
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Décrivez brièvement votre demande..."
          aria-invalid={!!state?.fieldErrors?.message}
        />
        {state?.fieldErrors?.message && (
          <p className="text-xs text-destructive">{state.fieldErrors.message[0]}</p>
        )}
      </div>

      {state?.error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" disabled={pending} size="lg" className="rounded-full">
          {pending ? "Envoi en cours..." : "Envoyer la demande"}
        </Button>
      </div>
    </form>
  )
}
