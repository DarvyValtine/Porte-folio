import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { db } from "@/lib/db"
import { articles, articleComments } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { notFound } from "next/navigation"
import { CommentsManager } from "./comments-manager"

export const dynamic = "force-dynamic"

export default async function AdminArticleCommentsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const articleId = Number(id)
  const article = await db.select().from(articles).where(eq(articles.id, articleId)).limit(1)
  if (!article[0]) notFound()

  const comments = await db
    .select()
    .from(articleComments)
    .where(eq(articleComments.articleId, articleId))
    .orderBy(desc(articleComments.createdAt))

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux articles
        </Link>
        <h1 className="mt-4 font-serif text-2xl font-semibold text-foreground">
          Commentaires — {article[0].title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {comments.length} commentaire{comments.length > 1 ? "s" : ""}
        </p>
      </div>

      <CommentsManager comments={comments} />
    </div>
  )
}