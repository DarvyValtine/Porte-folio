import Link from "next/link"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"
import { ArrowLeft, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SafeImage } from "@/components/safe-image"
import { getArticleBySlug } from "@/lib/queries"
import { ShareArticle } from "@/components/share-article"
import { TrackView } from "@/components/track-view"
import { LikeButton } from "@/components/like-button"
import { CommentsSection } from "@/components/comments-section"
import { SuggestedArticles } from "@/components/suggested-articles"

export const dynamic = "force-dynamic"

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

const articleSchema: NonNullable<Parameters<typeof rehypeSanitize>[0]> = {
  ...defaultSchema,
  protocols: {
    ...(defaultSchema.protocols ?? {}),
    href: ["http", "https", "mailto", "tel"],
    src: ["http", "https"],
  },
  attributes: {
    ...(defaultSchema.attributes ?? {}),
    a: [...((defaultSchema.attributes ?? {}).a ?? []), "title"],
    img: [...((defaultSchema.attributes ?? {}).img ?? []), "alt", "width", "height"],
  },
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) notFound()

  const host = (await headers()).get("host") || "localhost:3000"
  const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https"
  const articleUrl = `${protocol}://${host}/articles/${slug}`

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
          <figure className="mt-8 overflow-hidden rounded-2xl border border-border/60">
            <SafeImage
              src={article.coverImage}
              alt={article.title}
              className="h-full w-full object-cover"
              width={900}
              height={560}
            />
            {article.coverImageCredit && (
              <figcaption className="px-4 py-2 text-xs text-muted-foreground">
                {article.coverImageCredit}
              </figcaption>
            )}
          </figure>
        )}

        <div className="mt-10 space-y-5 leading-relaxed text-foreground/90">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, [rehypeSanitize, articleSchema]]}
            components={{
              h2: ({ children }) => (
                <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="font-serif text-xl font-semibold tracking-tight text-foreground">
                  {children}
                </h3>
              ),
              p: ({ children }) => <p className="text-pretty">{children}</p>,
              ul: ({ children }) => (
                <ul className="list-disc space-y-1 pl-6">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal space-y-1 pl-6">{children}</ol>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary/40 pl-4 italic text-muted-foreground">
                  {children}
                </blockquote>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  {children}
                </a>
              ),
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt}
                  className="mx-auto block h-auto max-h-[60vh] w-auto max-w-full rounded-lg border border-border/60"
                />
              ),
              hr: () => <hr className="border-border/60" />,
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        <div className="mt-12 flex items-center gap-3 border-t border-border/60 pt-6">
          <ShareArticle url={articleUrl} title={article.title} />
          <LikeButton articleId={article.id} />
        </div>

        <CommentsSection articleId={article.id} />
      </article>

      <SuggestedArticles currentSlug={slug} />
    </>
  )
}
