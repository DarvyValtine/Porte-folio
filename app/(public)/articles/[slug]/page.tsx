import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/safe-image"
import { getArticleBySlug } from "@/lib/queries"
import { ShareArticle } from "@/components/share-article"
import { TrackView } from "@/components/track-view"

export const dynamic = "force-dynamic"

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) notFound()

  const articleUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/articles/${slug}`

  return (
    <>
      <TrackView slug={slug} />
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 md:py-20">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Tous les articles
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {article.category && (
            <Badge variant="secondary" className="rounded-full font-normal">
              {article.category}
            </Badge>
          )}
          <span>{formatDate(article.createdAt)}</span>
          <span className="flex items-center gap-1 text-xs">
            <Eye className="h-3 w-3" />
            {article.views} lecture{article.views > 1 ? "s" : ""}
          </span>
        </div>

        <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground text-balance">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            {article.excerpt}
          </p>
        )}

        {article.coverImage && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-border/60">
            <SafeImage
              src={article.coverImage}
              alt={article.title}
              className="h-full w-full object-cover"
              width={900}
              height={560}
            />
          </div>
        )}

        <div className="mt-10 space-y-5 leading-relaxed text-foreground/90">
          {article.content.split(/\n{2,}/).map((para, i) => (
            <p key={i} className="text-pretty">
              {para}
            </p>
          ))}
        </div>

        <div className="mt-12 border-t border-border/60 pt-6">
          <ShareArticle url={articleUrl} title={article.title} />
        </div>
      </article>
    </>
  )
}
