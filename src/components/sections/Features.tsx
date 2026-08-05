import {
  Bot,
  CalendarCheck,
  CloudSun,
  IndianRupee,
  Leaf,
  Map,
  ScanSearch,
  Sprout,
  TrendingUp,
  Users,
  Wallet,
  Wheat,
} from 'lucide-react'
import { motion, type Variants } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SectionHeading, EASE } from '../../lib/animations'
import { GlowCard } from '../ui/Tilt'

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 48, scale: 0.88, filter: 'blur(14px)' },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE },
  },
}

const cardRevealContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
}

const features = [
  {
    icon: ScanSearch,
    title: 'AI Disease Detection',
    desc: 'Snap a photo, get an instant diagnosis with confidence score, severity and treatment plan.',
    color: '#F38BBC',
    gradient: 'from-blush-500/25 to-transparent',
  },
  {
    icon: Bot,
    title: 'AI Chat Assistant',
    desc: 'Ask anything in your language. Voice and image support with real farming intelligence.',
    color: '#3DDC97',
    gradient: 'from-emerald-400/25 to-transparent',
  },
  {
    icon: CloudSun,
    title: 'Weather Intelligence',
    desc: 'Hyper-local forecasts, rain probability and AI advice on the perfect day to sow or spray.',
    color: '#FFF2A6',
    gradient: 'from-butter/25 to-transparent',
  },
  {
    icon: TrendingUp,
    title: 'Yield Prediction',
    desc: 'ML models forecast your harvest weeks ahead — so you can plan markets, labour and logistics.',
    color: '#F9B4D0',
    gradient: 'from-blush-400/25 to-transparent',
  },
  {
    icon: Map,
    title: 'Farm Analytics',
    desc: 'Every field mapped, measured and monitored. Insights that turn data into decisions.',
    color: '#3DDC97',
    gradient: 'from-emerald-400/25 to-transparent',
  },
  {
    icon: Leaf,
    title: 'Government Schemes',
    desc: 'Never miss a subsidy again. We match you to the schemes your farm qualifies for.',
    color: '#FFF2A6',
    gradient: 'from-butter/25 to-transparent',
    to: '/schemes',
  },
  {
    icon: CalendarCheck,
    title: 'Crop Calendar',
    desc: 'Smart sowing-to-harvest schedules generated for your crop, soil and region.',
    color: '#F38BBC',
    gradient: 'from-blush-500/25 to-transparent',
  },
  {
    icon: Sprout,
    title: 'Soil Health',
    desc: 'Upload soil reports or sync lab data. Get nutrient gaps and precise fertilizer plans.',
    color: '#3DDC97',
    gradient: 'from-emerald-400/25 to-transparent',
  },
  {
    icon: Map,
    title: 'Satellite Monitoring',
    desc: 'NDVI vegetation indices over your fields — spot stress before it becomes damage.',
    color: '#F9B4D0',
    gradient: 'from-blush-400/25 to-transparent',
  },
  {
    icon: IndianRupee,
    title: 'Market Intelligence',
    desc: 'Live mandi prices and demand trends. Know where to sell before you harvest.',
    color: '#FFF2A6',
    gradient: 'from-butter/25 to-transparent',
  },
  {
    icon: Wallet,
    title: 'Expense Tracking',
    desc: 'Crop-wise cost sheets and profit estimates. Know exactly what every acre earns.',
    color: '#3DDC97',
    gradient: 'from-emerald-400/25 to-transparent',
    to: '/expenses',
  },
  {
    icon: Users,
    title: 'Nearby Experts',
    desc: 'Connect with verified agronomists and KVK officers in your district, on demand.',
    color: '#F38BBC',
    gradient: 'from-blush-500/25 to-transparent',
  },
]

export function Features() {
  return (
    <section id="features" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Platform"
          title={
            <>
              Everything your farm needs.
              <br />
              <span className="gradient-text">Powered by one brain.</span>
            </>
          }
          subtitle="Twelve intelligent tools working together — diagnosis, weather, markets, soil and finance — so you can focus on growing."
        />

        <motion.div
          variants={cardRevealContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={cardReveal}
              className="h-full will-change-transform"
            >
              <GlowCard
                glowColor={`${f.color}1f`}
                className="relative h-full overflow-hidden border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:shadow-card-hover"
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${f.gradient} to-transparent opacity-60`} />
                <div className="relative">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                    <f.icon size={22} style={{ color: f.color }} strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{f.desc}</p>
                  {'to' in f && f.to ? (
                    <Link
                      to={f.to}
                      className="mt-5 inline-flex items-center gap-1 text-sm font-semibold transition-colors duration-300"
                      style={{ color: f.color }}
                    >
                      Explore
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        →
                      </motion.span>
                    </Link>
                  ) : (
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold transition-colors duration-300" style={{ color: f.color }}>
                      Explore
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        →
                      </motion.span>
                    </span>
                  )}
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
