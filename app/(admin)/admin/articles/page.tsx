import Link from "next/link"
import { Plus, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAllArticlesAdmin } from "@/lib/db/admin-queries"
import { deleteArticle, toggleArticlePublished } from "@/lib/actions/articles"
import { DeleteButton } from "@/components/admin/delete-button"
import { PublishToggle } from "@/components/admin/publish-toggle"

export default async function AdminArticlesPage() {
  const articles = await getAllArticlesAdmin()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">Articles</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {articles.length} article{articles.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/articles/new">
            <Plus className="h-4 w-4" />
            Nouvel article
          </Link>
        </Button>
      </div>

      {articles.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
          Aucun article pour l&apos;instant. Créez le premier.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Titre</th>
                <th className="px-4 py-3 font-medium">Catégorie</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{article.title}</p>
                    <p className="text-xs text-muted-foreground">/articles/{article.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{article.category || "—"}</td>
                  <td className="px-4 py-3">
                    <PublishToggle
                      published={article.published}
                      onToggle={async (next) => {
                        "use server"
                        await toggleArticlePublished(article.id, next)
                      }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="icon-sm" aria-label="Modifier">
                        <Link href={`/admin/articles/${article.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteButton
                        confirmMessage={`Supprimer « ${article.title} » ?`}
                        onDelete={async () => {
                          "use server"
                          await deleteArticle(article.id)
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
