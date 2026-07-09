import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAllArticlesAdmin } from "@/lib/db/admin-queries"
import { ArticlesTable } from "./articles-table"

export const dynamic = "force-dynamic"

export default async function AdminArticlesPage() {
  const articles = await getAllArticlesAdmin()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            Articles
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {articles.length} article
            {articles.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/articles/new">
            <Plus className="h-4 w-4" />
            Nouvel article
          </Link>
        </Button>
      </div>

      <ArticlesTable articles={articles} />
    </div>
  )
}
