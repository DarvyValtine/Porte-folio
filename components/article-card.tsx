import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/safe-image"

type Article = {
  slug: string
  title: string
  excerpt: string | null
  coverImage: string | null
  category: string | null
  createdAt: Date | string
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-shadow hover:shadow-md hover:shadow-primary/5"
    >
      {article.coverImage && (
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <SafeImage
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {article.category && (
            <Badge variant="secondary" className="rounded-full font-normal">
              {article.category}
            </Badge>
          )}
          <span>{formatDate(article.createdAt)}</span>
        </div>
        <h3 className="font-serif text-lg font-semibold leading-snug text-foreground text-balance group-hover:text-primary">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {article.excerpt}
          </p>
        )}
      </div>
    </Link>
  )
}
