import { PageHeader } from "@/components/page-header";
import { ArticleCard } from "@/components/article-card";
import { getPublishedArticles } from "@/lib/queries";
import { getSiteContent } from "@/lib/queries/site-content";

export const dynamic = "force-dynamic";

type PageHeaderData = {
  eyebrow: string;
  title: string;
  description: string;
};

export async function generateMetadata() {
  const content = await getSiteContent<PageHeaderData>("articles_page");
  return {
    title: `${content.title} — Grâce Estia`,
    description: content.description,
  };
}

export default async function ArticlesPage() {
  const [articles, content] = await Promise.all([
    getPublishedArticles(),
    getSiteContent<PageHeaderData>("articles_page"),
  ]);

  return (
    <>
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
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
  );
}
