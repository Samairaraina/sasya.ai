import { PageHero } from '../components/layout/PageShell'
import { FAQ } from '../components/sections/FAQ'
import { Testimonials } from '../components/sections/Testimonials'
import { FinalCTA } from '../components/sections/FinalCTA'

export function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title={
          <>
            Answers, guides & <span className="gradient-text">farmer stories</span>.
          </>
        }
        subtitle="Everything you need to know about smart farming — plus stories from the 48,000 farmers already growing with Sasya."
      />
      <FAQ />
      <Testimonials />
      <FinalCTA />
    </>
  )
}
