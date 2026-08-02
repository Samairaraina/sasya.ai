import { motion } from 'framer-motion'

const blobs = [
  { top: '-10%', left: '-8%', size: 560, color: '#2a5754', delay: 0, dur: 18 },
  { top: '25%', left: '55%', size: 480, color: '#0f5f53', delay: 4, dur: 22 },
  { top: '55%', left: '-12%', size: 420, color: '#1d403e', delay: 8, dur: 20 },
  { top: '70%', left: '70%', size: 520, color: '#5b3a52', delay: 2, dur: 24 },
  { top: '-5%', left: '35%', size: 340, color: '#0d2624', delay: 6, dur: 16 },
]

export function MeshBackground({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-0 grid-pattern" />
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="mesh-blob"
          style={{ top: b.top, left: b.left, width: b.size, height: b.size, background: b.color }}
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -50, 40, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: b.dur,
            delay: b.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export function Leaves({ count = 14 }: { count?: number }) {
  const items = Array.from({ length: count })
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((_, i) => {
        const left = Math.random() * 100
        const size = 14 + Math.random() * 20
        const dur = 14 + Math.random() * 16
        const delay = -Math.random() * 30
        const pink = Math.random() > 0.75
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${left}%`, top: '-6%' }}
            animate={{ y: ['0vh', '110vh'], rotate: [0, 200 + Math.random() * 200] }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: 'linear' }}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill="none"
              className={pink ? 'text-blush-500/40' : 'text-emerald-400/30'}
            >
              <path
                d="M12 2C7 2 4 6 4 9c0 5 4 13 8 13s8-8 8-13c0-3-3-7-8-7Z"
                fill="currentColor"
                opacity="0.7"
              />
            </svg>
          </motion.div>
        )
      })}
    </div>
  )
}
