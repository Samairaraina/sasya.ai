import { type FormEvent, type ReactNode, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../lib/auth'
import { LogoMark, Wordmark } from '../ui/Logo'
import { EASE, fadeUp, staggerContainer } from '../../lib/animations'

const inputClass =
  'w-full rounded-full border border-white/15 bg-white/[0.05] px-5 py-3 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-blush-400/70 focus:bg-white/[0.08]'

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading, signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-forest-900 dark:bg-[#0a1f1d]">
        <motion.div
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-5"
        >
          <LogoMark size={64} />
          <Wordmark size="text-2xl" />
        </motion.div>
      </div>
    )
  }

  if (user) return <>{children}</>

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (mode === 'signup' && password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setSubmitting(true)
    const result =
      mode === 'signin' ? await signIn(email, password) : await signUp(email, password, name)
    setSubmitting(false)
    if (result.error) setError(result.error)
  }

  function switchMode(next: 'signin' | 'signup') {
    setMode(next)
    setError(null)
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-forest-900 px-5 py-10 dark:bg-[#0a1f1d]">
      <div className="noise" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-blush-500/20 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-48 -left-24 h-[420px] w-[420px] rounded-full bg-forest-500/25 blur-[140px]" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-[380px] w-[380px] rounded-full bg-blush-400/10 blur-[120px]" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="glass-strong relative z-10 flex w-full max-w-md flex-col items-center gap-7 rounded-3xl px-8 py-12 text-center sm:px-12"
      >
        <motion.div variants={fadeUp}>
          <LogoMark size={60} />
        </motion.div>
        <motion.div variants={fadeUp} className="flex flex-col items-center gap-2">
          <Wordmark size="text-2xl" />
          <p className="text-sm font-medium text-white/50">AI Farming Assistant</p>
        </motion.div>
        <motion.div variants={fadeUp} className="flex flex-col items-center gap-3">
          <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl">
            Welcome to your
            <br />
            smart farm workspace
          </h1>
          <p className="max-w-xs text-sm leading-relaxed text-white/55">
            Sign in to unlock disease scanning, weather intelligence, market prices, and AI crop advice.
          </p>
        </motion.div>
        <motion.form variants={fadeUp} onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
          {mode === 'signup' && (
            <input
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name (optional)"
              className={inputClass}
            />
          )}
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className={inputClass}
          />
          <input
            type="password"
            required
            minLength={6}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={inputClass}
          />
          {mode === 'signup' && (
            <input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm password"
              className={inputClass}
            />
          )}
          {error && (
            <p className="rounded-2xl border border-blush-500/30 bg-blush-500/10 px-4 py-2.5 text-[13px] text-blush-300">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </motion.form>
        <motion.div variants={fadeUp} className="flex w-full flex-col items-center gap-2">
          {mode === 'signin' ? (
            <button
              onClick={() => switchMode('signup')}
              className="text-[13px] font-medium text-white/55 transition-colors hover:text-white"
            >
              Don't have an account? <span className="text-blush-400">Create one</span>
            </button>
          ) : (
            <button
              onClick={() => switchMode('signin')}
              className="text-[13px] font-medium text-white/55 transition-colors hover:text-white"
            >
              Already have an account? <span className="text-blush-400">Sign in</span>
            </button>
          )}
        </motion.div>
        <motion.p variants={fadeUp} transition={{ duration: 0.8, ease: EASE }} className="text-[11px] text-white/35">
          Secured by Sasya Auth · Powered by Sasya AI
        </motion.p>
      </motion.div>
    </div>
  )
}
