import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { RdvForm } from "@/components/rdv-form"
import { site } from "@/lib/site"

export const metadata = {
  title: "Prendre rendez-vous — Dr. Grace Estia",
  description:
    "Demandez un rendez-vous en ligne. Consultations en présentiel ou à distance.",
}

export default function RdvPage() {
  return (
    <>
      <PageHeader
        eyebrow="Prise de rendez-vous"
        title="Demander une consultation"
        description="Vous pouvez me contacter via ce formulaire. Je vous répondrai sous 48 heures pour convenir d'un créneau."
      />

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-5 md:py-20">
        <div className="md:col-span-3">
          <RdvForm />
        </div>

        <aside className="space-y-6 md:col-span-2 md:pl-6">
          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <h2 className="font-serif text-lg font-semibold">Mes coordonnées</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                <a href={`mailto:${site.email}`} className="hover:text-foreground">
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                <a href={`tel:${site.phone}`} className="hover:text-foreground">
                  {site.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{site.location}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>Consultations en présentiel et à distance</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <h2 className="font-serif text-lg font-semibold">
              Informations pratiques
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2 before:mt-2 before:block before:size-1 before:shrink-0 before:rounded-full before:bg-primary">
                Consultations individuelles pour adultes et adolescents
              </li>
              <li className="flex items-start gap-2 before:mt-2 before:block before:size-1 before:shrink-0 before:rounded-full before:bg-primary">
                Séances en visioconférence possibles
              </li>
              <li className="flex items-start gap-2 before:mt-2 before:block before:size-1 before:shrink-0 before:rounded-full before:bg-primary">
                Tarif conventionné — possibilité de tiers payant
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  )
}
