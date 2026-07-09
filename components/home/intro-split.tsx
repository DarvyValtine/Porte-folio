import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const stats = [
  { value: "6+", label: "années de terrain au Congo" },
  { value: "4+", label: "projets de protection de l'enfance" },
  { value: "3", label: "publications & articles de presse" },
]

export function IntroSplit() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative order-2 overflow-hidden rounded-[2rem] border border-border/60 shadow-lg shadow-primary/5 lg:order-1">
          <Image
            src="/images/engagement.jpg"
            alt="Atelier communautaire de soutien"
            width={720}
            height={560}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="order-1 space-y-6 lg:order-2">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-primary">
            Mon approche
          </p>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
            Un engagement de terrain au service des enfants
          </h2>
          <p className="leading-relaxed text-muted-foreground text-pretty">
            Je conjugue la rigueur de la psychologie clinique avec un engagement
            militant de longue date. Mon travail consiste à protéger les enfants
            vulnérables, à restaurer leur dignité, et à porter leur voix auprès
            des institutions et de la société.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {stats.map((s) => (
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
            <Link href="/parcours">
              Voir le parcours complet
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
