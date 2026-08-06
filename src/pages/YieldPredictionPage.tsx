import { PageHero } from '../components/layout/PageShell'
import { YieldPredictionSection } from '../components/sections/YieldPrediction'
import { FinalCTA } from '../components/sections/FinalCTA'
import { AuthGate } from '../components/layout/AuthGate'

export function YieldPredictionPage() {
  return (
    <>
      <PageHero
        eyebrow="Yield Prediction"
        title={
          <>
            Forecast your harvest <span className="gradient-text">weeks ahead</span>.
          </>
        }
        subtitle="AI-driven ML models estimate your crop yield, harvest dates, and expected revenue based on your active fields and current weather trends."
      />
      <AuthGate>
        <YieldPredictionSection />
      </AuthGate>
      <FinalCTA />
    </>
  )
}
