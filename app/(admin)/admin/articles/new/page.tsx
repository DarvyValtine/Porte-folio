import { ArticleForm } from "@/components/admin/article-form"
import { createArticle } from "@/lib/actions/articles"

export default function NewArticlePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Nouvel article</h1>
      </div>
      <ArticleForm action={createArticle} />
    </div>
  )
}
