import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  CloudSun,
  Droplets,
  IndianRupee,
  Leaf,
  ScanLine,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { MeshBackground, Leaves } from '../ui/Ambient'
import { Button } from '../ui/MagneticButton'
import { Logo } from '../ui/Logo'
import { EASE, staggerContainer, staggerItem } from '../../lib/animations'

function PhoneMockup() {
  return (
    <motion.div
      className="relative aspect-[9/18] w-full max-w-[250px] rounded-[2.6rem] border border-white/15 bg-gradient-to-b from-forest-800 to-forest-950 p-2 shadow-card"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-forest-900">
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-4 text-[9px] text-white/60">
          <span>9:41</span>
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
        </div>

        {/* App header */}
        <div className="mt-2 flex items-center justify-between px-5">
          <div>
            <p className="text-[10px] text-white/50">Crop Scan</p>
            <p className="text-sm font-semibold">Tomato Field A</p>
          </div>
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10">
            <Sparkles size={13} className="text-blush-400" />
          </span>
        </div>

        {/* Scan area */}
        <div className="mx-4 mt-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/25 via-forest-700 to-blush-500/20">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              <path
                d="M50 8 C20 20 12 44 30 62 C18 60 10 48 14 36 C24 30 40 26 50 8 Z"
                fill="#3DDC97"
                opacity="0.55"
              />
              <path
                d="M50 8 C80 20 88 44 70 62 C82 60 90 48 86 36 C76 30 60 26 50 8 Z"
                fill="#F38BBC"
                opacity="0.5"
              />
              <path d="M50 12 C42 34 42 52 50 70" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <path d="M50 30 C36 38 30 46 30 58" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
              <path d="M50 30 C64 38 70 46 70 58" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
            </svg>
            {/* Scan corners */}
            <div className="absolute left-3 top-3 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-emerald-300" />
            <div className="absolute right-3 top-3 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-emerald-300" />
            <div className="absolute bottom-3 left-3 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-emerald-300" />
            <div className="absolute bottom-3 right-3 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-emerald-300" />
            {/* Scan pulse */}
            <div className="absolute inset-x-6 overflow-hidden rounded-2xl">
              <motion.div
                className="absolute left-1/2 top-0 h-full w-1 rounded-full bg-gradient-to-b from-transparent via-blush-400 to-transparent shadow-glow"
                animate={{ x: ['45%', '55%', '45%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute inset-x-0 top-[15%] h-0.5 rounded-full bg-white/10"
                animate={{ opacity: [0.4, 0.05, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute inset-x-0 top-[55%] h-0.5 rounded-full bg-white/10"
                animate={{ opacity: [0.05, 0.45, 0.05] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </div>

        {/* Result chip */}
        <div className="mx-4 mt-3 rounded-xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-white/50">Detected</p>
              <p className="text-xs font-semibold">Early Blight</p>
            </div>
            <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[9px] font-semibold text-emerald-300">
              96.4%
            </span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-blush-400"
              initial={{ width: 0 }}
              animate={{ width: '96.4%' }}
              transition={{ duration: 1.6, delay: 0.6, ease: EASE }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mx-4 mt-3 grid grid-cols-2 gap-2">
          <div className="flex items-center justify-center gap-1.5 rounded-xl bg-blush-500/90 py-2 text-[10px] font-semibold text-forest-950">
            <Leaf size={11} /> Treatment
          </div>
          <div className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.05] py-2 text-[10px] font-semibold">
            <ScanLine size={11} /> Full Report
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const floatingCards = [
  {
    className: 'left-0 top-6 hidden md:flex lg:-left-14',
    delay: 0,
    dur: 6,
    icon: <CloudSun size={15} className="text-butter" />,
    label: 'Weather',
    value: '32°C',
    sub: 'Rain 20%',
  },
  {
    className: '-right-4 top-16 hidden sm:flex lg:-right-16',
    delay: 1.2,
    dur: 7,
    icon: <Leaf size={15} className="text-emerald-300" />,
    label: 'Disease',
    value: 'Early Blight',
    sub: '96% match',
    pink: true,
  },
  {
    className: '-left-8 bottom-24 hidden sm:flex lg:-left-20',
    delay: 0.6,
    dur: 8,
    icon: <IndianRupee size={15} className="text-butter" />,
    label: 'Market',
    value: '₹32/kg',
    sub: '+6.2% today',
  },
  {
    className: 'right-0 bottom-8 hidden md:flex lg:-right-10',
    delay: 1.8,
    dur: 6.5,
    icon: <TrendingUp size={15} className="text-emerald-300" />,
    label: 'Yield',
    value: '12.4 t/ha',
    sub: '+18% vs avg',
  },
]

function FloatingCard({
  className,
  delay,
  dur,
  icon,
  label,
  value,
  sub,
  pink,
}: (typeof floatingCards)[number]) {
  return (
    <motion.div
      className={`absolute z-10 ${className}`}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 1 + delay, ease: EASE }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
        className="glass flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-card"
      >
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${
            pink ? 'bg-blush-500/20 text-blush-400' : 'bg-white/10'
          }`}
        >
          {icon}
        </span>
        <div>
          <p className="text-[10px] text-white/50">{label}</p>
          <p className="text-xs font-semibold leading-tight">{value}</p>
          <p className="text-[10px] text-emerald-300">{sub}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 20 })
  const sy = useSpring(my, { stiffness: 60, damping: 20 })
  const rotX = useTransform(sy, [-0.5, 0.5], [8, -8])
  const rotY = useTransform(sx, [-0.5, 0.5], [-10, 10])
  const tx = useTransform(sx, [-0.5, 0.5], [-14, 14])
  const ty = useTransform(sy, [-0.5, 0.5], [-10, 10])

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <section
      id="home"
      ref={ref}
      onMouseMove={onMove}
      className="relative flex min-h-screen items-center overflow-hidden pb-24 pt-32 lg:pb-32"
    >
      <MeshBackground />
      <Leaves count={12} />

      {/* Moving light beam */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[60vh] w-[50vw] -translate-x-1/2"
        style={{
          background: 'radial-gradient(50% 60% at 50% 0%, rgba(61,220,151,0.16), transparent 70%)',
        }}
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 px-5 lg:grid-cols-2 lg:px-8">
        {/* Left column */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start"
        >
          <motion.span
            variants={staggerItem}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Introducing Sasya AI — your farm's digital brain
          </motion.span>

          <motion.h1
            variants={staggerItem}
            className="mt-7 text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl"
          >
            Smarter Farming.
            <br />
            <span className="gradient-text">Healthier Crops.</span>
            <br />
            Better Tomorrow.
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg"
          >
            Sasya combines Artificial Intelligence, crop disease detection, weather
            intelligence, satellite insights, and personalized recommendations into one
            intelligent farming platform.
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="mt-8 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-4 shadow-card sm:flex-row sm:items-center"
          >
            <Logo size={34} />
            <div>
              <p className="text-sm font-semibold text-white">Sasya</p>
              <p className="text-sm text-white/60">AI farming assistant for agriculture teams</p>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="mt-9 flex flex-wrap items-center gap-4">
            <Button to="/solutions" size="lg">
              <ScanLine size={18} />
              Start Free Scan
            </Button>
            <Button to="/contact" variant="ghost" size="lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              Book Live Demo
            </Button>
          </motion.div>

        </motion.div>

        {/* Right column - phone */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
          className="relative mx-auto flex w-full max-w-[420px] items-center justify-center py-10"
          style={{ perspective: 1200 }}
        >
          <motion.div
            className="relative"
            style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
          >
            <motion.div
              style={{ x: tx, y: ty }}
              className="relative z-[5] will-change-transform"
            >
              {/* Levitation sway — the whole cluster drifts side to side on an arc */}
              <motion.div
                className="relative will-change-transform"
                animate={{
                  x: [0, 16, 0, -16, 0],
                  y: [0, -10, 0, -10, 0],
                  rotate: [0, 2.5, 0, -2.5, 0],
                }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  times: [0, 0.25, 0.5, 0.75, 1],
                }}
              >
                <PhoneMockup />
                {floatingCards.map((c) => (
                  <FloatingCard key={c.label} {...c} />
                ))}

              </motion.div>
            </motion.div>
          </motion.div>

          {/* Glow behind phone */}
          <motion.div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              background: 'radial-gradient(45% 45% at 50% 50%, rgba(243,139,188,0.22), transparent 70%)',
            }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.a
        href="#features"
        onClick={(e) => {
          e.preventDefault()
          document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/40 lg:flex"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-8 w-px bg-gradient-to-b from-white/60 to-transparent" />
      </motion.a>
    </section>
  )
}
