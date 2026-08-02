import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { SectionHeading, EASE } from '../../lib/animations'

const faqs = [
  {
    q: 'How accurate is Sasya\'s disease detection?',
    a: 'Our computer-vision models are trained on 45,000+ annotated disease images across 120 crops and achieve 96.2% diagnostic accuracy, validated against agronomy experts and KVK data. Confidence scores are always shown transparently.',
  },
  {
    q: 'Do I need internet or a smartphone to use Sasya?',
    a: 'Sasya works on any smartphone with 3G or better. A lightweight offline mode lets you capture photos and queue scans, and the app syncs your results the moment you\'re back online. We also provide an SMS helpline for feature phones.',
  },
  {
    q: 'Is Sasya available in regional languages?',
    a: 'Yes. The interface and AI assistant support Hindi, Marathi, Telugu, Tamil, Kannada, Bengali, Gujarati, Punjabi and English — with voice input so farmers can talk naturally in their own language.',
  },
  {
    q: 'What does the free plan include?',
    a: 'The free plan includes 10 AI disease scans per month, basic weather forecasts, a crop calendar, one farm profile and community support. No credit card required — upgrade anytime as your needs grow.',
  },
  {
    q: 'How do you protect my farm data?',
    a: 'Your data is encrypted in transit and at rest, stored on servers in India, and never sold to third parties. You own your data and can export or delete it at any time. We comply with Indian data protection guidelines.',
  },
  {
    q: 'Can Sasya help me get government subsidies?',
    a: 'Absolutely. Sasya continuously tracks central and state schemes, checks your eligibility against your farm profile, and generates ready-to-submit application documents — many farmers claim ₹20,000–₹60,000 per season.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="resources" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title={
            <>
              Questions, <span className="gradient-text">answered</span>.
            </>
          }
          subtitle="Everything you need to know before starting your smart farming journey."
        />

        <div className="mt-14 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: EASE }}
                className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
                  isOpen
                    ? 'border-blush-500/30 bg-white/[0.05]'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-display text-base font-semibold">{f.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border ${
                      isOpen ? 'border-blush-500/40 bg-blush-500/15 text-blush-400' : 'border-white/15 text-white/60'
                    }`}
                  >
                    <Plus size={16} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      <p className="px-6 pb-6 text-sm leading-relaxed text-white/60">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
