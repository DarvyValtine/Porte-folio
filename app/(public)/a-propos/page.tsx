import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { site } from "@/lib/site";

export const metadata = {
  title: "À propos — Grace Estia Otilibili",
  description:
    "Découvrez le parcours et les valeurs de Grace Estia Otilibili, psychologue clinicienne et militante.",
};

const values = [
  {
    title: "Dignité",
    text: "Chaque personne mérite d'être accueillie avec respect, sans jugement ni condition.",
  },
  {
    title: "Justice",
    text: "Le soin psychologique ne peut être séparé du combat pour l'égalité et les droits.",
  },
  {
    title: "Écoute",
    text: "Comprendre avant d'agir : une présence attentive est le point de départ de toute reconstruction.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="À propos"
        title="Au service des droits de l'enfant et de la justice sociale"
        description="Psychologue clinicienne de formation, j'ai consacré ma carrière à la protection des enfants vulnérables et à la défense de leurs droits, sur le terrain au Congo et au-delà."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative overflow-hidden rounded-[2rem] border border-border/60 shadow-lg shadow-primary/5">
            <Image
              src="/images/about-portrait.jpeg"
              alt="Portrait en situation"
              width={680}
              height={820}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-5 leading-relaxed text-muted-foreground">
            <p>
              Mon engagement est né d&apos;une conviction simple : chaque
              enfant, chaque femme, chaque personne vulnérable a droit à la
              protection, à la dignité et à une chance de se reconstruire.
              Depuis 2019, je travaille sur le terrain au Congo auprès
              d&apos;enfants en situation de rue, de mineurs incarcérés et de
              communautés marginalisées.
            </p>
            <p>
              Au sein du REIPER puis de l&apos;ACBEF, j&apos;ai coordonné des
              projets, animé des lignes d&apos;écoute d&apos;urgence, formé des
              acteurs sociaux et porté des actions de plaidoyer pour les droits
              des enfants et la santé sexuelle et reproductive. Mon approche
              conjugue la rigueur de la psychologie clinique avec un engagement
              militant de longue date.
            </p>
            <figure className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <Quote className="h-6 w-6 text-primary" />
              <blockquote className="mt-3 font-serif text-xl italic leading-snug text-foreground text-pretty">
                « Prendre soin de l&apos;autre, c&apos;est aussi lutter pour un
                monde où sa dignité ne sera plus jamais négociable. »
              </blockquote>
            </figure>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <h2 className="mb-10 font-serif text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
            Mes engagements
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((v) => (
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
          Pour découvrir mon parcours académique, mes engagements et mes
          distinctions, consultez la page dédiée.
        </p>
        <Button asChild size="lg" className="mt-6 rounded-full">
          <Link href="/parcours">
            Voir mon parcours
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
