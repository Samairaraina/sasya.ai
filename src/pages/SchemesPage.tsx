import { PageHero } from '../components/layout/PageShell'
import { GovernmentSchemes } from '../components/sections/GovernmentSchemes'
import { FinalCTA } from '../components/sections/FinalCTA'

export function SchemesPage() {
  return (
    <>
      <PageHero
        eyebrow="Government Schemes"
        title={
          <>
            Subsidies you qualify for, <span className="gradient-text">matched to your farm</span>.
          </>
        }
        subtitle="Central and state schemes with honest pros and cons — what each one pays, what it asks in return, and whether your farm fits."
      />
      <GovernmentSchemes />
      <FinalCTA />
    </>
  )
}
