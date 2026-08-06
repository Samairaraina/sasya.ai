import { PageHero } from '../components/layout/PageShell'
import { CropCalendarSection } from '../components/sections/CropCalendarSection'
import { FinalCTA } from '../components/sections/FinalCTA'

export function CropCalendarPage() {
  return (
    <>
      <PageHero
        eyebrow="Crop Calendar"
        title={
          <>
            Smart <span className="gradient-text">schedules</span> generated for you.
          </>
        }
        subtitle="AI-driven sowing-to-harvest schedules tailored for your crop, soil type, region, and season."
      />
      <CropCalendarSection />
      <FinalCTA />
    </>
  )
}
