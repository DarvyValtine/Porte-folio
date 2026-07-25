import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArticleCard } from "@/components/article-card"
import { getSuggestedArticles } from "@/lib/queries"

export async function SuggestedArticles({ currentSlug }: { currentSlug: string }) {
  const articles = await getSuggestedArticles(currentSlug)

  if (articles.length === 0) return null

  return (
    <section className="border-t border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Suggestions de lecture
            </h2>
          </div>
          <Button
            asChild
            variant="outline"
            className="hidden shrink-0 rounded-full sm:inline-flex"
          >
            <Link href="/articles">
              Tous les articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}