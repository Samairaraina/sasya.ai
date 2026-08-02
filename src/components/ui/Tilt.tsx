import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export function Tilt({
  children,
  className,
  max = 10,
}: {
  children: React.ReactNode
  className?: string
  max?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  const sx = useSpring(useTransform(px, [0, 1], [max, -max]), { stiffness: 200, damping: 20 })
  const sy = useSpring(useTransform(py, [0, 1], [-max, max]), { stiffness: 200, damping: 20 })

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={() => {
        px.set(0.5)
        py.set(0.5)
      }}
      style={{ rotateX: sx, rotateY: sy, transformStyle: 'preserve-3d' }}
      whileHover={{ scale: 1.015 }}
    >
      {children}
    </motion.div>
  )
}

export function GlowCard({
  children,
  className,
  glowColor = 'rgba(243,139,188,0.28)',
}: {
  children: React.ReactNode
  className?: string
  glowColor?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 150, damping: 20 })
  const sy = useSpring(y, { stiffness: 150, damping: 20 })

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set(e.clientX - rect.left)
    y.set(e.clientY - rect.top)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`group relative overflow-hidden rounded-3xl ${className ?? ''}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: useTransform(
            [sx, sy],
            ([bx, by]) => `radial-gradient(360px circle at ${bx}px ${by}px, ${glowColor}, transparent 65%)`,
          ),
        }}
      />
      {children}
    </div>
  )
}
