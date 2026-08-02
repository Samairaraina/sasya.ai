import { PageHero } from '../components/layout/PageShell'
import { Features } from '../components/sections/Features'
import { FinalCTA } from '../components/sections/FinalCTA'

export function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Platform"
        title={
          <>
            Twelve tools. <span className="gradient-text">One intelligence.</span>
          </>
        }
        subtitle="Every feature works together — diagnosis, weather, markets, soil and finance — so your farm operates as one connected system."
      />
      <Features />
      <FinalCTA />
    </>
  )
}
