import React, { useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: React.ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 20, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 260, damping: 20, mass: 0.6 })

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      x.set((e.clientX - rect.left - rect.width / 2) * strength)
      y.set((e.clientY - rect.top - rect.height / 2) * strength)
    },
    [strength, x, y],
  )

  const onLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className ?? ''}`}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  )
}

export function Ripple({ color = 'rgba(255,255,255,0.45)' }: { color?: string }) {
  return (
    <span
      className="ripple"
      style={{ background: color, width: 40, height: 40, left: 0, top: 0 }}
    />
  )
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  href,
  to,
  magnetic = true,
}: {
  children: React.ReactNode
  variant?: 'primary' | 'ghost' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: (e: React.MouseEvent) => void
  href?: string
  to?: string
  magnetic?: boolean
}) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null)

  const ripple = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const span = document.createElement('span')
    const d = Math.max(rect.width, rect.height)
    span.className = 'ripple'
    span.style.width = span.style.height = `${d}px`
    span.style.left = `${e.clientX - rect.left - d / 2}px`
    span.style.top = `${e.clientY - rect.top - d / 2}px`
    span.style.background = 'rgba(255,255,255,0.5)'
    el.appendChild(span)
    setTimeout(() => span.remove(), 700)
  }, [])

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  const variants = {
    primary: 'btn-primary',
    ghost: 'btn-ghost text-white',
    dark: 'bg-forest-900 text-white border border-white/15 hover:bg-forest-800 transition-all',
  }

  const base = `group inline-flex items-center justify-center gap-2 rounded-full font-medium ${sizes[size]} ${variants[variant]} ${className}`

  const inner = (e: React.MouseEvent) => {
    ripple(e)
    onClick?.(e)
  }

  const content = (
    <>
      {children}
      <span className="transition-transform duration-300 group-hover:translate-x-0.5" />
    </>
  )

  const el = to ? (
    <Link ref={ref} to={to} className={base} onClick={inner as React.MouseEventHandler<HTMLAnchorElement>}>
      {content}
    </Link>
  ) : href ? (
    <a ref={ref} href={href} className={base} onClick={inner}>
      {content}
    </a>
  ) : (
    <button ref={ref} className={base} onClick={inner}>
      {content}
    </button>
  )

  if (!magnetic) return el
  return <Magnetic strength={0.2}>{el}</Magnetic>
}
