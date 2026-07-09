import { notFound } from "next/navigation"
import { ArticleForm } from "@/components/admin/article-form"
import { updateArticle } from "@/lib/actions/articles"
import { getArticleByIdAdmin } from "@/lib/db/admin-queries"

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const article = await getArticleByIdAdmin(Number(id))

  if (!article) notFound()

  const updateWithId = updateArticle.bind(null, article.id)

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Modifier l&apos;article</h1>
      </div>
      <ArticleForm article={article} action={updateWithId} />
    </div>
  )
}
