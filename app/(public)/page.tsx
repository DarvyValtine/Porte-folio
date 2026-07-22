import { getSiteContent } from "@/lib/queries/site-content"
import { Hero } from "@/components/home/hero"
import { FocusAreas } from "@/components/home/focus-areas"
import { IntroSplit } from "@/components/home/intro-split"
import { LatestArticles } from "@/components/home/latest-articles"
import { HomeCta } from "@/components/home/cta"

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [hero, intro, focusAreas, cta] = await Promise.all([
    getSiteContent("home_hero"),
    getSiteContent("home_intro"),
    getSiteContent("home_focus_areas"),
    getSiteContent("home_cta"),
  ])

  return (
    <>
      <Hero data={hero as any} />
      <FocusAreas data={focusAreas as any} />
      <IntroSplit data={intro as any} />
      <LatestArticles />
      <HomeCta data={cta as any} />
    </>
  )
}
