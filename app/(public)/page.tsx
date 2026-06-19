import { Hero } from "@/components/home/hero"
import { FocusAreas } from "@/components/home/focus-areas"
import { IntroSplit } from "@/components/home/intro-split"
import { LatestArticles } from "@/components/home/latest-articles"
import { HomeCta } from "@/components/home/cta"

export default function HomePage() {
  return (
    <>
      <Hero />
      <FocusAreas />
      <IntroSplit />
      <LatestArticles />
      <HomeCta />
    </>
  )
}
