import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE } from '../../lib/animations'

function GrowingPlant() {
  return (
    <svg width="92" height="92" viewBox="0 0 92 92" fill="none" className="overflow-visible">
      <defs>
        <linearGradient id="load-leaf" x1="20" y1="20" x2="72" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3DDC97" />
          <stop offset="100%" stopColor="#F38BBC" />
        </linearGradient>
      </defs>
      <motion.path
        d="M46 86 V50"
        stroke="url(#load-leaf)"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, delay: 0.2, ease: EASE }}
      />
      {[0, 1, 2, 3].map((i) => (
        <motion.path
          key={i}
          d={
            i % 2 === 0
              ? 'M46 52 C38 44 34 42 26 44'
              : 'M46 52 C54 44 58 42 66 44'
          }
          stroke="url(#load-leaf)"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 + i * 0.35, ease: EASE }}
        />
      ))}
      <motion.path
        d="M46 34 C38 26 34 24 27 25"
        stroke="#3DDC97"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.9, ease: EASE }}
      />
      <motion.path
        d="M46 34 C54 26 58 24 65 25"
        stroke="#F38BBC"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.15, ease: EASE }}
      />
      <motion.circle
        cx="60"
        cy="52"
        r="4"
        fill="#FFF2A6"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 1] }}
        transition={{ duration: 0.6, delay: 2.6, ease: EASE }}
      />
    </svg>
  )
}

export function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const start = performance.now()
    const dur = 2400
    let raf: number
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setProgress(Math.round(eased * 100))
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setGone(true)
          setTimeout(onDone, 600)
        }, 250)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-forest-900"
          exit={{ opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <GrowingPlant />
          </motion.div>

          <div className="flex flex-col items-center gap-3">
            <span className="font-display text-3xl font-extrabold tracking-tight">Sasya</span>
            <span className="text-sm uppercase tracking-[0.35em] text-white/50">AI Farming Assistant</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <motion.span
              className="text-xs tracking-widest text-blush-400/90"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              Growing Intelligence<span className="animate-pulse">...</span>
            </motion.span>
            <div className="relative h-[3px] w-56 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 via-blush-400 to-blush-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="stat-font text-xs text-white/60">{progress}%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
