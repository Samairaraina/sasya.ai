import { Wheat, Tractor, CloudSun, Leaf } from 'lucide-react'
import { Marquee } from '../ui/Marquee'
import { CountUp } from '../ui/CountUp'
import { Reveal, staggerContainer, staggerItem } from '../../lib/animations'
import { motion } from 'framer-motion'

const logos = [
  { name: 'AgriTech Alliance', icon: Leaf },
  { name: 'GreenField India', icon: Wheat },
  { name: 'FarmWorks', icon: Tractor },
  { name: 'KrishiNet', icon: CloudSun },
  { name: 'SoilSense', icon: Leaf },
  { name: 'HarvestHub', icon: Wheat },
  { name: 'CropVista', icon: Tractor },
  { name: 'EcoGrow', icon: Leaf },
]

const stats = [
  { value: 48000, suffix: '+', label: 'Active Farmers', decimals: 0 },
  { value: 120, suffix: '+', label: 'Crops Covered', decimals: 0 },
  { value: 14, suffix: '', label: 'Countries', decimals: 0 },
  { value: 28, suffix: '', label: 'States & Regions', decimals: 0 },
  { value: 45000, suffix: '+', label: 'Disease Database', decimals: 0 },
  { value: 96.2, suffix: '%', label: 'AI Accuracy', decimals: 1 },
]

export function Trust() {
  return (
    <section id="trust" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <p className="text-center text-sm text-white/50">
            Trusted by farmers. <span className="text-blush-400">Future-ready</span> for enterprises.
          </p>
        </Reveal>

        <div className="mt-10 overflow-hidden" style={{ maskImage: 'linear-gradient(90deg, transparent, black 15%, black 85%, transparent)' }}>
          <Marquee>
            {logos.map((l, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 text-white/35 transition-colors duration-300 hover:text-white/80"
              >
                <l.icon size={26} strokeWidth={1.5} />
                <span className="font-display text-lg font-bold tracking-tight">{l.name}</span>
              </div>
            ))}
          </Marquee>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-6"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={staggerItem}
              className="group flex flex-col items-center justify-center gap-2 bg-forest-900/95 px-4 py-10 text-center transition-colors duration-300 hover:bg-forest-800"
            >
              <CountUp
                to={s.value}
                suffix={s.suffix}
                decimals={s.decimals}
                className="text-3xl font-bold text-white transition-colors group-hover:text-blush-400 lg:text-4xl"
              />
              <span className="text-xs text-white/50">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
