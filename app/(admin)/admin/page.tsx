import Link from "next/link"
import { Newspaper, Images, Megaphone, Mail, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import { articles, galleryItems, pressItems, appointments } from "@/lib/db/schema"
import { desc, eq, sql } from "drizzle-orm"

export default async function AdminDashboardPage() {
  const [
    [{ value: articlesCountRaw }],
    [{ value: publishedCountRaw }],
    [{ value: galleryCountRaw }],
    [{ value: pressCountRaw }],
    [{ value: appointmentsCountRaw }],
    [{ value: pendingMessagesRaw }],
    recentArticles,
    recentAppointments,
  ] = await Promise.all([
    db.select({ value: sql<number>`count(*)` }).from(articles),
    db
      .select({ value: sql<number>`count(*)` })
      .from(articles)
      .where(eq(articles.published, true)),
    db.select({ value: sql<number>`count(*)` }).from(galleryItems),
    db.select({ value: sql<number>`count(*)` }).from(pressItems),
    db.select({ value: sql<number>`count(*)` }).from(appointments),
    db
      .select({ value: sql<number>`count(*)` })
      .from(appointments)
      .where(eq(appointments.status, "pending")),
    db
      .select({
        id: articles.id,
        title: articles.title,
        published: articles.published,
        createdAt: articles.createdAt,
      })
      .from(articles)
      .orderBy(desc(articles.createdAt))
      .limit(3),
    db
      .select({
        id: appointments.id,
        name: appointments.name,
        subject: appointments.subject,
        status: appointments.status,
      })
      .from(appointments)
      .orderBy(desc(appointments.createdAt))
      .limit(3),
  ])

  const articlesCount = Number(articlesCountRaw)
  const publishedCount = Number(publishedCountRaw)
  const galleryCount = Number(galleryCountRaw)
  const pressCount = Number(pressCountRaw)
  const appointmentsCount = Number(appointmentsCountRaw)
  const pendingMessages = Number(pendingMessagesRaw)

  const cards = [
    {
      href: "/admin/articles",
      label: "Articles",
      icon: Newspaper,
      value: articlesCount,
      sub: `${publishedCount} publié${publishedCount > 1 ? "s" : ""}`,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      href: "/admin/galerie",
      label: "Photos",
      icon: Images,
      value: galleryCount,
      sub: null,
      color: "text-chart-2",
      bg: "bg-chart-2/10",
    },
    {
      href: "/admin/presse",
      label: "Articles de presse",
      icon: Megaphone,
      value: pressCount,
      sub: null,
      color: "text-chart-3",
      bg: "bg-chart-3/10",
    },
    {
      href: "/admin/rdv",
      label: "Rendez-vous",
      icon: Mail,
      value: appointmentsCount,
      sub:
        pendingMessages > 0
          ? `${pendingMessages} en attente`
          : "Aucun en attente",
      color: "text-chart-1",
      bg: "bg-chart-1/10",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Tableau de bord
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vue d&apos;ensemble du contenu du site.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="flex">
            <Card className="flex w-full flex-col border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/5">
              <CardContent className="flex flex-1 flex-col justify-between space-y-3 p-5">
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${c.bg}`}
                >
                  <c.icon className={`h-5 w-5 ${c.color}`} />
                </span>
                <div>
                  <p className="font-serif text-3xl font-semibold text-foreground">
                    {c.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  {c.sub && (
                    <p className="mt-1 text-xs font-medium text-muted-foreground">
                      {c.sub}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold">
                Derniers articles
              </h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/articles">
                  Voir tout
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
            {recentArticles.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                Aucun article pour l&apos;instant.
              </p>
            ) : (
              <div className="space-y-3">
                {recentArticles.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {a.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(a.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                        })}
                      </p>
                    </div>
                    <Badge
                      variant={a.published ? "default" : "secondary"}
                      className="shrink-0"
                    >
                      {a.published ? "Publié" : "Brouillon"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold">
                Derniers rendez-vous
              </h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/rdv">
                  Voir tout
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
            {recentAppointments.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                Aucun rendez-vous pour l&apos;instant.
              </p>
            ) : (
              <div className="space-y-3">
                {recentAppointments.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {a.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {a.subject || "Sans sujet"}
                      </p>
                    </div>
                    <Badge
                      variant={
                        a.status === "pending"
                          ? "default"
                          : a.status === "contacted"
                          ? "outline"
                          : "secondary"
                      }
                      className="shrink-0"
                    >
                      {a.status === "pending"
                        ? "En attente"
                        : a.status === "contacted"
                        ? "Contacté"
                        : "Clôturé"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
