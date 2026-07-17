"use client"

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { site } from "@/lib/site";
import { Calendar, CheckCircle, Clock, MapPin } from "lucide-react";
import { useState } from "react";

type AppointmentType = { id: number; name: string; description: string | null };

export function RdvPageClient({ types }: { types: AppointmentType[] }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const { createAppointment } = await import("@/lib/actions/appointments");
      const result = await createAppointment(undefined, formData);

      if (result?.error) {
        setError(result.error);
        return;
      }

      setSent(true);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
  }

  if (sent) {
    return (
      <>
        <PageHeader
          eyebrow="Rendez-vous"
          title="Demande envoyée"
          description="Merci pour votre message. Je vous répondrai dans les meilleurs délais."
        />
        <section className="mx-auto flex max-w-lg items-center justify-center px-4 py-20">
          <Card className="w-full border-border/60 text-center">
            <CardContent className="space-y-4 p-8">
              <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <CheckCircle className="h-8 w-8" />
              </span>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                Demande envoyee !
              </h2>
              <p className="text-sm text-muted-foreground">
                Votre demande de rendez-vous a bien ete recue. Je vous
                contacterai tres prochainement pour confirmer la date et
                l&apos;horaire.
              </p>
              <Button asChild variant="outline" className="rounded-full">
                <a href="/">Retour a l&apos;accueil</a>
              </Button>
            </CardContent>
          </Card>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Rendez-vous"
        title="Prendre rendez-vous"
        description="Que ce soit pour une consultation ou un entretien, remplissez le formulaire ci-dessous."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
          <div className="space-y-6 lg:col-span-2">
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              Informations pratiques
            </h2>
            <div className="space-y-4">
              <Card className="border-border/60">
                <CardContent className="flex items-center gap-4 p-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Calendar className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Disponibilites
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      Du lundi au vendredi
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="flex items-center gap-4 p-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Delai de reponse
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      Sous 48 a 72 heures
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="flex items-center gap-4 p-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Localisation
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {site.location}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-3">
            <Card className="border-border/60">
              <CardContent className="p-6 sm:p-8">
                <h3 className="font-serif text-xl font-semibold text-foreground">
                  Formulaire de demande
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tous les champs marque d&apos;un * sont obligatoires.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-foreground"
                      >
                        Nom complet *
                      </label>
                      <input
                        id="name"
                        name="name"
                        required
                        className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        placeholder="Votre nom"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-foreground"
                      >
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="phone"
                        className="text-sm font-medium text-foreground"
                      >
                        Telephone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        placeholder="+242 06 XX XX XX"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="preferredDate"
                        className="text-sm font-medium text-foreground"
                      >
                        Date souhaitee
                      </label>
                      <input
                        id="preferredDate"
                        name="preferredDate"
                        type="date"
                        className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                      />
                    </div>
                  </div>

                  {types.length > 0 && (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="typeId"
                        className="text-sm font-medium text-foreground"
                      >
                        Type de rendez-vous
                      </label>
                      <select
                        id="typeId"
                        name="typeId"
                        className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        <option value="">Selectionnez un type</option>
                        {types.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium text-foreground"
                    >
                      Motif de la consultation
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                      placeholder="Ex: Consultation, intervention, collaboration..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-foreground"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                      placeholder="Decrivez brievement l'objet de votre demande..."
                    />
                  </div>

                  {error && (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.97]"
                    >
                      Envoyer la demande
                    </button>
                    <button
                      type="reset"
                      className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary active:scale-[0.97]"
                    >
                      Effacer
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
