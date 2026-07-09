import { HeartHandshake, Scale, Users, PhoneCall } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const areas = [
  {
    icon: HeartHandshake,
    title: "Protection de l'enfance",
    description:
      "Accompagnement et prise en charge des enfants en situation de rue, mineurs incarcérés et enfants vulnérables.",
  },
  {
    icon: Scale,
    title: "Droits humains & plaidoyer",
    description:
      "Engagement auprès d'ONG et d'institutions pour la défense des droits des enfants et des femmes.",
  },
  {
    icon: Users,
    title: "Santé sexuelle & reproductive",
    description:
      "Sensibilisation, animation de groupes de parole et plaidoyer pour l'accès à des soins respectueux.",
  },
  {
    icon: PhoneCall,
    title: "Écoute sociale & urgence",
    description:
      "Gestion de lignes d'appel d'urgence et dispositifs d'aide psychosociale pour les personnes en détresse.",
  },
]

export function FocusAreas() {
  return (
    <section className="border-y border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.16em] text-primary">
            Domaines d&apos;intervention
          </p>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
            Une pratique au croisement du soin et de l&apos;engagement
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map((area) => (
            <Card
              key={area.title}
              className="border-border/60 bg-card transition-shadow hover:shadow-md hover:shadow-primary/5"
            >
              <CardContent className="space-y-4 p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <area.icon className="h-5 w-5" />
                </span>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  {area.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {area.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
