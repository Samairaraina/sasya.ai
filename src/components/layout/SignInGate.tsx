import { motion } from 'framer-motion'
import { SignInButton, SignUpButton, useAuth } from '@clerk/clerk-react'
import { LogoMark, Wordmark } from '../ui/Logo'
import { EASE, fadeUp, staggerContainer } from '../../lib/animations'

const hasClerk = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)

export function SignInGate({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth()

  if (!hasClerk) return <>{children}</>

  if (!isLoaded) {
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

  if (isSignedIn) return <>{children}</>

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
        <motion.div variants={fadeUp} className="flex w-full flex-col items-center gap-3">
          <SignInButton mode="modal">
            <span className="btn-primary inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold transition-transform hover:scale-[1.02]">
              Sign in
            </span>
          </SignInButton>
          <SignUpButton mode="modal">
            <span className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
              Create account
            </span>
          </SignUpButton>
        </motion.div>
        <motion.p variants={fadeUp} transition={{ duration: 0.8, ease: EASE }} className="text-[11px] text-white/35">
          Secured by Clerk · Powered by Sasya AI
        </motion.p>
      </motion.div>
    </div>
  )
}
