import { GraduationCap, Award, Briefcase, BookOpen, Globe, Heart, ExternalLink } from "lucide-react"
import { PageHeader } from "@/components/page-header"

export const metadata = {
  title: "Parcours — Grace Estia Otilibili",
  description:
    "Formation, expériences professionnelles, engagements et publications de Grace Estia Otilibili.",
}

const reiperExperiences = [
  {
    period: "Mars — Mai 2026",
    title: "Cheffe de projet",
    org: "REIPER — Projet « ARCADE phase 2 »",
    text: "Accompagnement et Renforcement des Capacités et Actions Dédiées aux Enfants en Situation de rue. Lieu d'affectation : Brazzaville.",
  },
  {
    period: "Mars 2024 — Mars 2026",
    title: "Assistante du chef de projet puis Cheffe de projet (mars 2025)",
    org: "REIPER — Projet « ARCADE »",
    text: "Accompagnement et Renforcement des Capacités et Actions Dédiées aux Enfants en Situation de rue. Lieu d'affectation : Brazzaville. Missions ponctuelles : Pointe-Noire, Gamboma (Plateaux), Kingoué (Bouenza), Dakar (Sénégal).",
  },
  {
    period: "Oct. 2022 — Mars 2024",
    title: "Chargée de la ligne d'appel d'urgence",
    org: "REIPER — Projet « Tobatela bana »",
    text: "Promotion des droits et protection des enfants vulnérables en République du Congo. Lieu d'affectation : Brazzaville. Missions ponctuelles : Dolisie, Pointe-Noire.",
  },
  {
    period: "Oct. 2021 — Oct. 2022",
    title: "Travailleuse sociale et responsable du dispositif Mineurs Incarcérés",
    org: "REIPER — Projet « Tobatela bana »",
    text: "Promotion des droits et protection des enfants vulnérables en République du Congo. Lieu d'affectation : Brazzaville.",
  },
  {
    period: "Sept. 2020 — Août 2021",
    title: "Coordonnatrice locale de projet",
    org: "REIPER",
    text: "Promotion et mise en œuvre des droits des enfants en conflit avec la loi au Congo. Lieu d'affectation : Dolisie (Niari). Missions ponctuelles : Brazzaville.",
  },
  {
    period: "Mai — Oct. 2019",
    title: "Animatrice chargée de la sensibilisation et de la réinsertion",
    org: "REIPER",
    text: "Amélioration de la prise en charge sociale et éducative des mineurs incarcérés au sein de la maison d'arrêt de Pointe-Noire. Lieu d'affectation : Pointe-Noire.",
  },
]

const acbefExperiences = [
  {
    period: "2025",
    title: "Secrétaire du Comité National de Reforme Neutre",
    org: "ACBEF — Association Congolaise pour le Bien Etre Familial (bénévole)",
  },
  {
    period: "2019 — 2021",
    title: "Présidente du Bureau National du Mouvement d'Action des Jeunes & Membre du Comité Exécutif National",
    org: "ACBEF (bénévole)",
  },
  {
    period: "2016 — 2020",
    title: "Animatrice du site forum www.tictacados.com",
    org: "ACBEF (bénévole)",
  },
  {
    period: "2016 — 2019",
    title: "Conseillère au bureau national du Mouvement d'Action des Jeunes",
    org: "ACBEF (bénévole)",
  },
]

const education = [
  {
    period: "2018",
    title: "Master en Psychologie Pathologique et Clinique",
    org: "Université Marien Ngouabi",
  },
  {
    period: "2016",
    title: "Licence en Psychologie",
    org: "Université Marien Ngouabi",
  },
  {
    period: "2016",
    title: "Licence en Gestion",
    org: "ESGAE — École Supérieure de Gestion et d'Administration des Entreprises",
  },
]

const certifications = [
  "Prise en charge spécifique des jeunes filles",
  "Écoute sociale",
  "Éducation à la vie affective et sexuelle",
  "Éducation sexuelle complète",
  "Lutte contre les violences basées sur le genre",
  "Dépression",
  "Relation mère-bébé",
  "Éducation inclusive",
  "Advocacy To Action",
]

const engagements = [
  "Participation à des campagnes pour les droits des femmes et des enfants",
  "Actions de sensibilisation en santé sexuelle et reproductive",
  "Interventions dans des conférences, ateliers et groupes de parole",
]

const publications = [
  {
    title: "Congo/Société : Le divorce des parents, l'une des principales causes conduisant les enfants en situation de rue",
    source: "Agence Congolaise pour l'Information — DB News",
    url: "https://dbnews.com",
  },
  {
    title: "Portrait : Grace Estia Otilibili redonne de l'espoir aux enfants incarcérés",
    source: "Adiac Congo",
    url: "https://adiac-congo.com",
  },
  {
    title: "Girls Talk 242 — Témoignage et partage d'expérience",
    source: "Girls Talk 242",
    url: "https://www.facebook.com/share/v/19Ad4cAGQm/",
  },
]

const expertise = [
  "Protection de l'enfance",
  "Droits des enfants en conflit avec la loi",
  "Santé sexuelle & reproductive",
  "Violences basées sur le genre",
  "Accompagnement psychosocial",
  "Écoute & aide d'urgence",
  "Plaidoyer & droits humains",
  "Formation & sensibilisation",
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
        title="Un parcours dédié à la protection de l'enfance"
        description="Formation universitaire, expériences de terrain, engagements associatifs et publications."
      />

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:px-6 md:py-20">
        {/* Expériences professionnelles */}
        <section>
          <div className="mb-8 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Briefcase className="h-5 w-5" />
            </span>
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              Expériences professionnelles
            </h2>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h3 className="mb-5 font-serif text-xl font-semibold text-foreground">
                Réseau des Intervenants sur le Phénomène des Enfants en Rupture — REIPER
              </h3>
              <Timeline items={reiperExperiences} />
            </div>

            <div>
              <h3 className="mb-5 font-serif text-xl font-semibold text-foreground">
                Association Congolaise pour le Bien Etre Familial — ACBEF
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">Engagements bénévoles</p>
              <Timeline items={acbefExperiences} />
            </div>
          </div>
        </section>

        {/* Formation */}
        <section className="grid gap-10 lg:grid-cols-2 lg:gap-16">
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

          <div className="rounded-2xl border border-border/60 bg-secondary/30 p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Award className="h-5 w-5" />
              </span>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                Certifications
              </h2>
            </div>
            <ul className="space-y-3">
              {certifications.map((c) => (
                <li key={c} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Engagements & Publications */}
        <section className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="rounded-2xl border border-border/60 bg-secondary/30 p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Globe className="h-5 w-5" />
              </span>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                Engagements & activités militantes
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
                <Heart className="h-5 w-5" />
              </span>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                Publications & visibilité
              </h2>
            </div>
            <ul className="space-y-4">
              {publications.map((p) => (
                <li key={p.title}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start gap-2 text-sm leading-relaxed"
                  >
                    <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>
                      <span className="text-foreground underline-offset-4 group-hover:underline">
                        {p.title}
                      </span>
                      <span className="text-muted-foreground"> — {p.source}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Domaines d'expertise */}
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
            {expertise.map((tag) => (
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
