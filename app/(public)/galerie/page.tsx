import Image from "next/image"
import { PageHeader } from "@/components/page-header"
import { getGalleryItems } from "@/lib/queries"

export const metadata = {
  title: "Galerie — Dr. Leïla Hassani",
  description: "Photos d'événements, conférences et engagements.",
}

export const dynamic = "force-dynamic"

export default async function GaleriePage() {
  const items = await getGalleryItems()

  return (
    <>
      <PageHeader
        eyebrow="Galerie"
        title="Moments & engagements"
        description="Conférences, ateliers, rencontres et actions de terrain en images."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-secondary/30 py-20 text-center">
            <p className="text-muted-foreground">
              La galerie sera bientôt enrichie.
            </p>
          </div>
        ) : (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {items.map((item) => (
              <figure
                key={item.id}
                className="mb-5 break-inside-avoid overflow-hidden rounded-2xl border border-border/60 bg-card"
              >
                <Image
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.title || "Photo de galerie"}
                  width={600}
                  height={750}
                  className="h-auto w-full object-cover"
                />
                {(item.title || item.caption) && (
                  <figcaption className="p-4">
                    {item.title && (
                      <p className="font-serif text-base font-semibold text-foreground">
                        {item.title}
                      </p>
                    )}
                    {item.caption && (
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {item.caption}
                      </p>
                    )}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
