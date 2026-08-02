import { motion } from 'framer-motion'
import { MeshBackground, Leaves } from '../ui/Ambient'
import { EASE } from '../../lib/animations'
import { Reveal } from '../../lib/animations'

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: React.ReactNode
  subtitle?: string
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 lg:pb-24 lg:pt-44">
      <MeshBackground />
      <Leaves count={8} />
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-5 px-5 text-center lg:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-blush-400 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-blush-500" />
            {eyebrow}
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">{title}</h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={0.16}>
            <p className="max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">{subtitle}</p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
