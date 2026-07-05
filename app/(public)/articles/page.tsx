import { PageHeader } from "@/components/page-header"
import { ArticleCard } from "@/components/article-card"
import { getPublishedArticles } from "@/lib/queries"

export const metadata = {
  title: "Articles & publications — Dr. Grace Estia",
  description:
    "Articles, tribunes et réflexions sur la psychologie, les droits humains et la santé.",
}

export const dynamic = "force-dynamic"

export default async function ArticlesPage() {
  const articles = await getPublishedArticles()

  return (
    <>
      <PageHeader
        eyebrow="Publications"
        title="Articles & réflexions"
        description="Mes écrits sur la psychologie clinique, les droits des femmes et des enfants, et la santé sexuelle et reproductive."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        {articles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-secondary/30 py-20 text-center">
            <p className="text-muted-foreground">
              Aucun article publié pour le moment. Revenez prochainement.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
