import { getSiteContent } from "@/lib/queries/site-content"
import { AdminPageLayout } from "@/components/admin/page-layout"
import { HomeContentForm } from "@/components/admin/home-content-form"
import { AProposContentForm } from "@/components/admin/apropos-content-form"
import { ParcoursContentForm } from "@/components/admin/parcours-content-form"
import { PageHeaderContentForm } from "@/components/admin/page-header-content-form"

export default async function ContenuPage() {
  const [hero, intro, focusAreas, cta, aPropos, parcours, articlesPage, pressePage] =
    await Promise.all([
      getSiteContent("home_hero"),
      getSiteContent("home_intro"),
      getSiteContent("home_focus_areas"),
      getSiteContent("home_cta"),
      getSiteContent("a_propos"),
      getSiteContent("parcours"),
      getSiteContent("articles_page"),
      getSiteContent("presse_page"),
    ])

  return (
    <AdminPageLayout title="Contenu du site" backHref="/admin">
      <div className="space-y-8">
        <div>
          <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">Page d&apos;accueil</h2>
          <HomeContentForm
            hero={hero as any}
            intro={intro as any}
            focusAreas={focusAreas as any}
            cta={cta as any}
          />
        </div>

        <div>
          <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">À propos</h2>
          <AProposContentForm data={aPropos as any} />
        </div>

        <div>
          <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">Parcours</h2>
          <ParcoursContentForm data={parcours as any} />
        </div>

        <div>
          <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">Pages Articles & Presse</h2>
          <div className="space-y-6">
            <PageHeaderContentForm sectionKey="articles_page" title="Page Articles" data={articlesPage as any} />
            <PageHeaderContentForm sectionKey="presse_page" title="Page Presse" data={pressePage as any} />
          </div>
        </div>
      </div>
    </AdminPageLayout>
  )
}
