import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ArticleMarkdown } from "@/components/article-markdown";
import { FullWidthImage } from "@/components/full-width-image";
import { getArticleBySlug } from "@/lib/queries";
import { ShareArticle } from "@/components/share-article";
import { TrackView } from "@/components/track-view";
import { LikeButton } from "@/components/like-button";
import { CommentsSection } from "@/components/comments-section";
import { SuggestedArticles } from "@/components/suggested-articles";
import { ReadingProgress } from "@/components/reading-progress";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const host = (await headers()).get("host") || "localhost:3000";
  const protocol =
    host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  const articleUrl = `${protocol}://${host}/articles/${slug}`;

  const words = article.content
    ? article.content.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const readingTime = Math.max(1, Math.round(words / 200));

  return (
    <>
      <TrackView slug={slug} />
      <ReadingProgress />
      <article className="mx-auto max-w-2xl px-5 py-10 sm:px-6 md:py-14">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Tous les articles
        </Link>

        {article.category && (
          <div className="mt-8">
            <Badge variant="secondary" className="rounded-full font-normal">
              {article.category}
            </Badge>
          </div>
        )}

        <h1 className="mt-4 font-serif text-[2.15rem] font-semibold leading-[1.15] tracking-tight text-foreground text-balance sm:text-[2.75rem]">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty sm:text-xl">
            {article.excerpt}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>{site.name}</span>
          <span aria-hidden>·</span>
          <span>{formatDate(article.createdAt)}</span>
          <span aria-hidden>·</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {readingTime} min de lecture
          </span>
          <span aria-hidden>·</span>
          <span className="flex items-center gap-1 text-xs">
            <Eye className="h-3 w-3" />
            {article.views} lecture{article.views > 1 ? "s" : ""}
          </span>
        </div>

        {article.coverImage && (
          <figure className="mt-8">
            <FullWidthImage
              src={article.coverImage}
              alt={article.title}
              fit="contain"
              fillFrame={false}
              maxHeight="min(24rem, 50vh)"
              sizes="(max-width: 680px) 100vw, 672px"
              className="rounded-lg max-w-2xl"
            />
            {article.coverImageCredit && (
              <figcaption className="mt-2 text-center text-xs text-muted-foreground">
                {article.coverImageCredit}
              </figcaption>
            )}
          </figure>
        )}

        <div className="mt-10">
          <ArticleMarkdown content={article.content} />
        </div>

        <div className="mt-12 flex items-center gap-3 border-t border-border/60 pt-6">
          <ShareArticle url={articleUrl} title={article.title} />
          <LikeButton articleId={article.id} />
        </div>

        <CommentsSection articleId={article.id} />
      </article>

      <SuggestedArticles currentSlug={slug} />
    </>
  );
}
