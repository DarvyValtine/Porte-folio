import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type IntroData = {
  eyebrow: string
  title: string
  body: string
  stats: { value: string; label: string }[]
  ctaLabel: string
  ctaLink: string
  image: string
}

export function IntroSplit({ data }: { data: IntroData }) {
  const hasImage = !!data.image

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <div className={`grid items-center gap-10 ${hasImage ? "lg:grid-cols-2 lg:gap-16" : ""}`}>
        {hasImage && (
          <div className="relative order-2 overflow-hidden rounded-[2rem] border border-border/60 shadow-lg shadow-primary/5 lg:order-1">
            <Image
              src={data.image}
              alt="Atelier communautaire de soutien"
              width={720}
              height={560}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className={`space-y-6 ${hasImage ? "order-1 lg:order-2" : "mx-auto max-w-2xl"}`}>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-primary">
            {data.eyebrow}
          </p>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
            {data.title}
          </h2>
          <p className="leading-relaxed text-muted-foreground text-pretty">
            {data.body}
          </p>
          <div className="grid grid-cols-3 gap-4">
            {data.stats.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-3xl font-semibold text-primary">
                  {s.value}
                </p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          <Button asChild variant="link" className="h-auto p-0 text-primary">
            <Link href={data.ctaLink}>
              {data.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
