import { motion, type Variants } from 'framer-motion'

export const EASE = [0.22, 1, 0.36, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
}

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

export const viewport = { once: true, margin: '-80px' } as const

export function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  eyebrow: string
  title: React.ReactNode
  subtitle?: string
  align?: 'center' | 'left'
}) {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start'
  return (
    <div className={`flex flex-col gap-5 ${alignment} max-w-3xl mx-auto`}>
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-blush-400 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-blush-500" />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">{title}</h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.16}>
          <p className="max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">{subtitle}</p>
        </Reveal>
      )}
    </div>
  )
}
