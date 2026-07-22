import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type HeroData = {
  badge: string
  title: string
  subtitle: string
  ctaPrimary: string
  ctaPrimaryLink: string
  ctaSecondary: string
  ctaSecondaryLink: string
  image: string
}

export function Hero({ data }: { data: HeroData }) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-7">
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-primary">
            {data.badge}
          </span>
          <h1 className="font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
            {data.title}
          </h1>
          {data.subtitle && (
            <p className="max-w-md text-lg leading-relaxed text-muted-foreground text-pretty">
              {data.subtitle}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link href={data.ctaPrimaryLink}>
                {data.ctaPrimary}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full"
            >
              <Link href={data.ctaSecondaryLink}>{data.ctaSecondary}</Link>
            </Button>
          </div>
        </div>

        {data.image && (
          <div className="relative mx-auto w-full max-w-96 sm:max-w-104 lg:max-w-116">
            <div className="absolute -right-6 -top-6 hidden h-40 w-40 rounded-full bg-accent/50 blur-2xl md:block" />
            <div className="relative aspect-4/5 overflow-hidden rounded-[2rem] border border-border/60 shadow-xl shadow-primary/5">
              <Image
                src={data.image}
                alt="Portrait de la psychologue"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[center_10%] sm:object-[center_12%] lg:object-[center_16%]"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
