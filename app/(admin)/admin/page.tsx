import Link from "next/link"
import { Newspaper, Images, Megaphone, Mail } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { db } from "@/lib/db"
import { articles, galleryItems, pressItems, appointments } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export default async function AdminDashboardPage() {
  const [allArticles, allGallery, allPress, allAppointments] = await Promise.all([
    db.select().from(articles),
    db.select().from(galleryItems),
    db.select().from(pressItems),
    db.select().from(appointments),
  ])

  const publishedCount = allArticles.filter((a) => a.published).length
  const pendingMessages = allAppointments.filter((a) => a.status === "pending").length

  const cards = [
    {
      href: "/admin/articles",
      label: "Articles",
      icon: Newspaper,
      value: allArticles.length,
      sub: `${publishedCount} publié${publishedCount > 1 ? "s" : ""}`,
    },
    {
      href: "/admin/galerie",
      label: "Photos en galerie",
      icon: Images,
      value: allGallery.length,
      sub: null,
    },
    {
      href: "/admin/presse",
      label: "Articles de presse",
      icon: Megaphone,
      value: allPress.length,
      sub: null,
    },
    {
      href: "/admin/messages",
      label: "Messages",
      icon: Mail,
      value: allAppointments.length,
      sub: pendingMessages > 0 ? `${pendingMessages} en attente` : "Aucun en attente",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Tableau de bord</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vue d&apos;ensemble du contenu du site.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href}>
            <Card className="border-border/60 transition-shadow hover:shadow-md hover:shadow-primary/5">
              <CardContent className="space-y-3 p-5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <c.icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="font-serif text-2xl font-semibold text-foreground">{c.value}</p>
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  {c.sub && <p className="mt-1 text-xs text-muted-foreground">{c.sub}</p>}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
