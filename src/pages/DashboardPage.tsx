import { PageHero } from '../components/layout/PageShell'
import { FarmDashboard } from '../components/sections/Dashboard'
import { Trust } from '../components/sections/Trust'
import { FinalCTA } from '../components/sections/FinalCTA'

export function DashboardPage() {
  return (
    <>
      <PageHero
        eyebrow="Farm Dashboard"
        title={
          <>
            Your farm, <span className="gradient-text">live on one screen</span>.
          </>
        }
        subtitle="Health scores, finance, calendar and satellite analytics — every metric that matters, continuously updated."
      />
      <FarmDashboard />
      <Trust />
      <FinalCTA />
    </>
  )
}
