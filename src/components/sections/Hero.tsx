import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
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

const slideImages = [
  '/slideshow/slide1.jpg',
  '/slideshow/slide2.jpg',
  '/slideshow/slide3.jpg',
  '/slideshow/slide4.jpg',
  '/slideshow/slide5.png',
]

function ImageSlideshow() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slideImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      className="relative aspect-[3/4] w-[280px] overflow-hidden rounded-[2rem] border border-white/15 bg-forest-900 shadow-card"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={slideImages[index]}
          alt="Sasya farming"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent" />
      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-md w-max">
          <Sparkles size={14} className="text-emerald-300" />
          <span className="text-xs font-medium text-white shadow-sm">AI Enhanced</span>
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
                <ImageSlideshow />
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
