import { PageHero } from '../components/layout/PageShell'
import { Scanner } from '../components/sections/Scanner'
import { Weather } from '../components/sections/Weather'
import { FinalCTA } from '../components/sections/FinalCTA'

export function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title={
          <>
            Scan. Predict. <span className="gradient-text">Protect your harvest.</span>
          </>
        }
        subtitle="From instant disease detection to weather intelligence — the tools that protect your crop before problems become losses."
      />
      <Scanner />
      <Weather />
      <FinalCTA />
    </>
  )
}
