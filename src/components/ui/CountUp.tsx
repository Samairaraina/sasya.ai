import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

export function CountUp({
  to,
  duration = 2,
  decimals = 0,
  suffix = '',
  prefix = '',
  className = '',
}: {
  to: number
  duration?: number
  decimals?: number
  suffix?: string
  prefix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { duration: duration * 1000, bounce: 0 })

  useEffect(() => {
    if (inView) mv.set(to)
  }, [inView, mv, to])

  useEffect(() => {
    const unsub = spring.on('change', (v) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${suffix}`
      }
    })
    return unsub
  }, [spring, decimals, suffix, prefix])

  return (
    <span ref={ref} className={`stat-font ${className}`}>
      {prefix}0{suffix}
    </span>
  )
}
