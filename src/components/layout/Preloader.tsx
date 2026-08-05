import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE } from '../../lib/animations'

function GrowingPlant() {
  return (
    <img
      src="/LOGO.png"
      alt="Sasya Logo"
      className="h-28 w-28 object-contain drop-shadow-2xl"
    />
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
