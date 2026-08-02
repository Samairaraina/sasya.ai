import { PageHero } from '../components/layout/PageShell'
import { Trust } from '../components/sections/Trust'
import { Testimonials } from '../components/sections/Testimonials'
import { FinalCTA } from '../components/sections/FinalCTA'
import { Reveal } from '../lib/animations'

const values = [
  { title: 'Innovation', desc: 'AI-first thinking applied to every acre of agriculture.', color: '#F38BBC' },
  { title: 'Trust', desc: 'Transparent models, honest confidence scores, secure data.', color: '#3DDC97' },
  { title: 'Simplicity', desc: 'A farmer with a ₹5,000 phone should feel at home.', color: '#FFF2A6' },
  { title: 'Accessibility', desc: 'Nine Indian languages, voice input, offline-first.', color: '#F9B4D0' },
  { title: 'Sustainability', desc: 'Fewer chemicals, less waste, healthier soil for generations.', color: '#3DDC97' },
  { title: 'Intelligence', desc: 'Every recommendation grounded in agronomy and data.', color: '#F38BBC' },
]

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={
          <>
            Building the world's smartest <span className="gradient-text">farming platform</span>.
          </>
        }
        subtitle="Sasya was born in the fields of Maharashtra — from the belief that every farmer deserves a digital partner that thinks, learns and grows with them."
      />
      <Trust />

      <section className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
              What we stand for
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.06}>
                <div className="group h-full rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-500 hover:-translate-y-2 hover:border-white/20">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]" style={{ color: v.color }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <FinalCTA />
    </>
  )
}
