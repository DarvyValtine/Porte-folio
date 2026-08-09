import { PageHeader } from "@/components/page-header"
import { ArticleCard } from "@/components/article-card"
import { getPublishedArticles } from "@/lib/queries"

export const metadata = {
  title: "Articles & publications — Dr. Grâce Estia",
  description:
    "Analyses, témoignages et réflexions sur la protection de l'enfance, les droits des femmes, la santé mentale, la jeunesse, l'éducation, les droits humains et les enjeux de développement.",
}

export const dynamic = "force-dynamic"

export default async function ArticlesPage() {
  const articles = await getPublishedArticles()

  return (
    <>
      <PageHeader
        eyebrow="Publications"
        title="Articles & réflexions"
        description="À travers ce blog, je partage des analyses, des témoignages et des réflexions inspirés de mon expérience professionnelle, de mes engagements associatifs et de mon intérêt pour les questions de société. J'y aborde notamment la protection de l'enfance, les droits des femmes, la santé mentale, la jeunesse, l'éducation, les droits humains et les enjeux de développement. Mon ambition n'est pas d'apporter toutes les réponses, mais de contribuer à la réflexion collective et de nourrir le dialogue autour de sujets qui nous concernent tous."
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
