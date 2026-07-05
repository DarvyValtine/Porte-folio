import { GraduationCap, Award, Briefcase, BookOpen, Globe } from "lucide-react"
import { PageHeader } from "@/components/page-header"

export const metadata = {
  title: "Parcours — Dr. Grace Estia",
  description:
    "Formation, expériences professionnelles, engagements et distinctions de Dr. Grace Estia.",
}

const experiences = [
  {
    period: "2018 — aujourd'hui",
    title: "Psychologue clinicienne en cabinet libéral",
    org: "Paris",
    text: "Suivi thérapeutique d'adultes et d'adolescents, spécialisation en psychotraumatologie.",
  },
  {
    period: "2014 — 2018",
    title: "Psychologue référente",
    org: "Centre d'accueil pour femmes victimes de violences",
    text: "Accompagnement psychologique et coordination des dispositifs de protection.",
  },
  {
    period: "2010 — 2014",
    title: "Psychologue de terrain",
    org: "ONG internationale de défense des droits de l'enfant",
    text: "Missions de soutien psychosocial auprès d'enfants en zones vulnérables.",
  },
]

const education = [
  {
    period: "2010",
    title: "Doctorat en psychologie clinique",
    org: "Université Paris Cité",
  },
  {
    period: "2007",
    title: "Master en psychopathologie",
    org: "Université Lumière Lyon 2",
  },
  {
    period: "2005",
    title: "Licence de psychologie",
    org: "Université de Strasbourg",
  },
]

const engagements = [
  "Membre du conseil scientifique d'une ONG de défense des droits des femmes",
  "Formatrice en santé sexuelle et reproductive auprès de professionnels de santé",
  "Intervenante régulière dans des colloques internationaux sur les droits de l'enfant",
  "Bénévole dans des programmes de soutien aux populations réfugiées",
]

const awards = [
  {
    year: "2022",
    title: "Prix de l'engagement humanitaire",
    org: "Fondation pour la dignité",
  },
  {
    year: "2019",
    title: "Distinction pour la recherche en psychotraumatologie",
    org: "Société française de psychologie",
  },
]

function Timeline({
  items,
}: {
  items: { period: string; title: string; org: string; text?: string }[]
}) {
  return (
    <ol className="relative border-l border-border pl-6">
      {items.map((item) => (
        <li key={item.title} className="mb-8 last:mb-0">
          <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full border-2 border-background bg-primary" />
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary">
            {item.period}
          </p>
          <h3 className="mt-1 font-serif text-lg font-semibold text-foreground">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground">{item.org}</p>
          {item.text && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {item.text}
            </p>
          )}
        </li>
      ))}
    </ol>
  )
}

export default function ParcoursPage() {
  return (
    <>
      <PageHeader
        eyebrow="Parcours & réalisations"
        title="Un parcours dédié au soin et aux droits humains"
        description="Formation universitaire, expériences cliniques, engagements associatifs et distinctions."
      />

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:px-6 md:py-20">
        <section className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Briefcase className="h-5 w-5" />
              </span>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                Expériences professionnelles
              </h2>
            </div>
            <Timeline items={experiences} />
          </div>

          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" />
              </span>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                Formation
              </h2>
            </div>
            <Timeline items={education} />
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="rounded-2xl border border-border/60 bg-secondary/30 p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Globe className="h-5 w-5" />
              </span>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                Engagements
              </h2>
            </div>
            <ul className="space-y-3">
              {engagements.map((e) => (
                <li key={e} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {e}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border/60 bg-secondary/30 p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Award className="h-5 w-5" />
              </span>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                Distinctions
              </h2>
            </div>
            <ul className="space-y-5">
              {awards.map((a) => (
                <li key={a.title}>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary">
                    {a.year}
                  </p>
                  <p className="mt-1 font-serif text-lg font-semibold text-foreground">
                    {a.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{a.org}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-7">
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </span>
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              Domaines d&apos;expertise
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "Psychotraumatologie",
              "Thérapie individuelle",
              "Violences faites aux femmes",
              "Protection de l'enfance",
              "Santé sexuelle & reproductive",
              "Plaidoyer & droits humains",
              "Formation & supervision",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-primary/30 bg-background px-4 py-1.5 text-sm text-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
