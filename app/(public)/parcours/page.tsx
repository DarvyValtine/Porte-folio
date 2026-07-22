import {
  GraduationCap,
  Award,
  Briefcase,
  BookOpen,
  Globe,
  Heart,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getSiteContent } from "@/lib/queries/site-content";

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "Parcours — Grace Estia Otilibili",
  description:
    "Formation, expériences professionnelles, engagements et publications de Grace Estia Otilibili.",
};

type TimelineItem = { period: string; title: string; org: string; text?: string };
type PubItem = { title: string; source: string; url: string };

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

function Timeline({ items }: { items: TimelineItem[] }) {
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
  );
}

export default async function ParcoursPage() {
  const data = await getSiteContent<ParcoursData>("parcours");

  return (
    <>
      <PageHeader
        eyebrow={data.header.eyebrow}
        title={data.header.title}
        description={data.header.description}
      />

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:px-6 md:py-20">
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
                {data.reiper.heading}
              </h3>
              <Timeline items={data.reiper.items} />
            </div>

            <div>
              <h3 className="mb-5 font-serif text-xl font-semibold text-foreground">
                {data.acbef.heading}
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {data.acbef.subheading}
              </p>
              <Timeline items={data.acbef.items} />
            </div>
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" />
              </span>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                {data.education.heading}
              </h2>
            </div>
            <Timeline items={data.education.items} />
          </div>

          <div className="rounded-2xl border border-border/60 bg-secondary/30 p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Award className="h-5 w-5" />
              </span>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                {data.certifications.heading}
              </h2>
            </div>
            <ul className="space-y-3">
              {data.certifications.items.map((c) => (
                <li
                  key={c}
                  className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="rounded-2xl border border-border/60 bg-secondary/30 p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Globe className="h-5 w-5" />
              </span>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                {data.engagements.heading}
              </h2>
            </div>
            <ul className="space-y-3">
              {data.engagements.items.map((e) => (
                <li
                  key={e}
                  className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                >
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
                {data.publications.heading}
              </h2>
            </div>
            <ul className="space-y-4">
              {data.publications.items.map((p) => (
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
                      <span className="text-muted-foreground">
                        {" "}
                        — {p.source}
                      </span>
                    </span>
                  </a>
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
              {data.expertise.heading}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.expertise.items.map((tag) => (
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
  );
}
