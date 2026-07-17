import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { site } from "@/lib/site";
import { getSiteContent } from "@/lib/queries/site-content";

export const metadata = {
  title: "À propos — Grace Estia Otilibili",
  description:
    "Découvrez le parcours et les valeurs de Grace Estia Otilibili, psychologue clinicienne et militante.",
};

type AProposData = {
  headerEyebrow: string
  headerTitle: string
  headerDescription: string
  paragraph1: string
  paragraph2: string
  quote: string
  valuesTitle: string
  values: { title: string; text: string }[]
  ctaText: string
  ctaLabel: string
  ctaLink: string
  image: string
}

export default async function AboutPage() {
  const data = await getSiteContent<AProposData>("a_propos");

  return (
    <>
      <PageHeader
        eyebrow={data.headerEyebrow}
        title={data.headerTitle}
        description={data.headerDescription}
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative overflow-hidden rounded-[2rem] border border-border/60 shadow-lg shadow-primary/5">
            <Image
              src={data.image}
              alt="Portrait en situation"
              width={680}
              height={820}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-5 leading-relaxed text-muted-foreground">
            <p>{data.paragraph1}</p>
            <p>{data.paragraph2}</p>
            <figure className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <Quote className="h-6 w-6 text-primary" />
              <blockquote className="mt-3 font-serif text-xl italic leading-snug text-foreground text-pretty">
                {data.quote}
              </blockquote>
            </figure>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <h2 className="mb-10 font-serif text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
            {data.valuesTitle}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {data.values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-border/60 bg-card p-6"
              >
                <h3 className="font-serif text-xl font-semibold text-primary">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <p className="mx-auto max-w-xl leading-relaxed text-muted-foreground">
          {data.ctaText}
        </p>
        <Button asChild size="lg" className="mt-6 rounded-full">
          <Link href={data.ctaLink}>
            {data.ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">
          Ou écrivez-moi à{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-primary underline-offset-4 hover:underline"
          >
            {site.email}
          </a>
        </p>
      </section>
    </>
  );
}
