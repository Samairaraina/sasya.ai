import { PageHero } from '../components/layout/PageShell'
import { Contact } from '../components/sections/Contact'

export function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Talk to <span className="gradient-text">the Sasya team</span>.
          </>
        }
        subtitle="Questions about pricing, partnerships or deployment? We reply within one business day — in the language you're most comfortable in."
      />
      <Contact />
    </>
  )
}
