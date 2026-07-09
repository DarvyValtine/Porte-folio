import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { site } from "@/lib/site"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-7">
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-primary">
            Psychologue · Militante
          </span>
          <h1 className="font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
            Protéger les droits, restaurer l&apos;espoir.
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground text-pretty">
            {site.tagline}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/contact">
                Prendre rendez-vous
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/a-propos">Découvrir mon parcours</Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-6 -top-6 hidden h-40 w-40 rounded-full bg-accent/50 blur-2xl md:block" />
          <div className="relative overflow-hidden rounded-[2rem] border border-border/60 shadow-xl shadow-primary/5">
            <Image
              src="/images/portrait-hero.jpeg"
              alt="Portrait de la psychologue"
              width={720}
              height={860}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
