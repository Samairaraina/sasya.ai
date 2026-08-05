import { motion } from 'framer-motion'
import { Check, Sparkles, Zap } from 'lucide-react'
import { SectionHeading, EASE } from '../../lib/animations'

const plans = [
  {
    name: 'Small Farmer',
    price: '₹49',
    period: '/month',
    desc: 'Perfect for small farms and first-time users.',
    features: [
      '30 AI disease scans / month',
      'Basic weather forecast',
      'Crop calendar',
      'Community support',
      '1 farm profile',
    ],
    highlight: false,
    cta: 'Get Started',
  },
  {
    name: 'Free',
    price: '₹0',
    period: '/month',
    desc: 'Basic features with limited scans.',
    features: [
      '10 AI disease scans / month',
      'Basic weather forecast',
      'Crop calendar',
      'Community support',
    ],
    highlight: false,
    cta: 'Start Free',
  },
  {
    name: 'Pro',
    price: '₹299',
    period: '/month',
    desc: 'For professional farmers and advanced crop management.',
    features: [
      'Unlimited AI disease scans',
      'Advanced weather + AI advice',
      'Yield prediction & analytics',
      'Market intelligence',
      'Government scheme matching',
      'Expense tracking & reports',
      'Voice + image AI assistant',
      'Priority expert connect',
    ],
    highlight: true,
    cta: 'Go Pro',
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: 'Custom Pricing',
    period: '',
    desc: 'For FPOs, NGOs, agribusinesses, cooperatives, and government organizations.',
    features: [
      'Everything in Pro',
      'Multi-farm & team management',
      'Satellite monitoring API',
      'Custom integrations & SSO',
      'Dedicated account manager',
      'On-site training & onboarding',
      'SLA & priority support',
    ],
    highlight: false,
    cta: 'Talk to Sales',
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title={
            <>
              Simple pricing, <span className="gradient-text">growing returns</span>.
            </>
          }
          subtitle="Start free. Upgrade when your farm does. Every plan pays for itself with one good decision."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:items-stretch">
          {plans.map((p, i) => {
            const price = p.price
            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: EASE }}
                className={`relative flex flex-col rounded-3xl p-8 transition-all duration-500 ${
                  p.highlight
                    ? 'gradient-border shadow-card lg:-translate-y-4 hover:shadow-glow'
                    : 'border border-white/10 bg-white/[0.03] backdrop-blur hover:-translate-y-2 hover:border-white/20'
                }`}
              >
                {p.badge && (
                  <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gradient-to-r from-blush-500 to-blush-400 px-4 py-1 text-xs font-bold text-forest-950">
                    <Sparkles size={12} /> {p.badge}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  {p.highlight && <Zap size={18} className="text-blush-400" />}
                  <h3 className="font-display text-xl font-bold">{p.name}</h3>
                </div>
                <p className="mt-2 text-sm text-white/55">{p.desc}</p>
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="stat-font text-5xl font-bold">
                    {price}
                  </span>
                  {p.period && <span className="text-sm text-white/45">{p.period}</span>}
                </div>
                <button
                  className={`mt-7 w-full rounded-full py-3 text-sm font-semibold transition-all ${
                    p.highlight
                      ? 'btn-primary'
                      : 'border border-white/15 bg-white/[0.05] hover:bg-white/10'
                  }`}
                >
                  {p.cta}
                </button>
                <div className="mt-8 space-y-3.5">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-start gap-3 text-sm">
                      <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${p.highlight ? 'bg-blush-500/20' : 'bg-emerald-400/15'}`}>
                        <Check size={12} className={p.highlight ? 'text-blush-400' : 'text-emerald-300'} />
                      </span>
                      <span className="text-white/75">{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
