import { ExternalLink } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { SafeImage } from "@/components/safe-image"
import { getPressItems } from "@/lib/queries"

export const metadata = {
  title: "Presse & médias — Dr. Grace Estia",
  description: "Interventions, interviews et apparitions médiatiques.",
}

export const dynamic = "force-dynamic"

function formatDate(d: Date | string | null) {
  if (!d) return ""
  return new Date(d).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  })
}

export default async function PressePage() {
  const items = await getPressItems()

  return (
    <>
      <PageHeader
        eyebrow="Presse & médias"
        title="Dans les médias"
        description="Interviews, tribunes et interventions dans la presse écrite, la radio et la télévision."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-secondary/30 py-20 text-center">
            <p className="text-muted-foreground">
              Aucune apparition presse pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.url || "#"}
                target={item.url ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex gap-5 rounded-2xl border border-border/60 bg-card p-5 transition-shadow hover:shadow-md hover:shadow-primary/5"
              >
                {item.coverImage && (
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <SafeImage
                      src={item.coverImage}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-primary">
                    <span>{item.outlet}</span>
                    {item.publishedDate && (
                      <span className="text-muted-foreground normal-case tracking-normal">
                        · {formatDate(item.publishedDate)}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 font-serif text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
                    {item.title}
                  </h3>
                  {item.excerpt && (
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {item.excerpt}
                    </p>
                  )}
                  {item.url && (
                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-primary">
                      Lire l&apos;article
                      <ExternalLink className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
