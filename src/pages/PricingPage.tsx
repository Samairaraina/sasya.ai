import { PageHero } from '../components/layout/PageShell'
import { Pricing } from '../components/sections/Pricing'
import { FinalCTA } from '../components/sections/FinalCTA'

export function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={
          <>
            Simple pricing, <span className="gradient-text">growing returns</span>.
          </>
        }
        subtitle="Start free. Upgrade when your farm does. Every plan pays for itself with one good decision."
      />
      <Pricing />
      <FinalCTA />
    </>
  )
}
