import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../../lib/auth'
import { LogIn, LogOut, Menu, Moon, Sun, X } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { EASE } from '../../lib/animations'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Features', to: '/features' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Resources', to: '/resources' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export function Navbar({ dark, onToggleDark }: { dark: boolean; onToggleDark: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { user, signOut } = useAuth()
  const userEmail = user?.email ?? null

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  async function handleSignOut() {
    await signOut()
  }

  return (
    <>
      <motion.div
        initial={{ y: -36, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        className="fixed inset-x-0 top-0 z-[60] flex h-9 items-center justify-center gap-2 border-b border-blush-500/20 bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 px-4 text-[11px] font-medium tracking-wide text-blush-300 backdrop-blur"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blush-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blush-500" />
        </span>
        Sasya is under development — some features are placeholders and may change.
      </motion.div>

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        className={`fixed inset-x-0 top-9 z-50 transition-all duration-500 ${
          scrolled ? 'py-2.5' : 'py-4'
        }`}
      >
        <nav className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 lg:px-8 ${
          scrolled ? 'glass-strong mx-4 rounded-2xl py-2.5 shadow-card lg:mx-auto lg:max-w-6xl' : ''
        }`}>
          <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
            <Logo size={30} />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `group relative rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-white/60 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    <span
                      className={`absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-gradient-to-r from-blush-400 to-blush-500 transition-transform duration-300 ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onToggleDark}
              aria-label="Toggle dark mode"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all hover:bg-white/10 hover:text-white"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={dark ? 'sun' : 'moon'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid place-items-center"
                >
                  {dark ? <Sun size={16} /> : <Moon size={16} />}
                </motion.span>
              </AnimatePresence>
            </button>
            {userEmail ? (
              <div className="flex items-center gap-2">
                <span className="hidden max-w-[160px] truncate text-[13px] font-medium text-white/70 md:block">
                  {userEmail}
                </span>
                <button
                  onClick={handleSignOut}
                  aria-label="Sign out"
                  title="Sign out"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all hover:bg-white/10 hover:text-white"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <Link
                to="/"
                className="hidden cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium text-white/70 transition-colors hover:text-white sm:flex"
              >
                <LogIn size={15} />
                Login
              </Link>
            )}
            <Link
              to="/pricing"
              className="btn-primary hidden rounded-full px-5 py-2 text-[13px] font-semibold sm:inline-flex"
            >
              Get Started
            </Link>
            <button
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white lg:hidden"
            >
              {open ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-forest-950/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center gap-2 px-8">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: EASE }}
                >
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `py-3 text-2xl font-semibold ${
                        isActive ? 'text-blush-400' : 'text-white/80 hover:text-white'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5, ease: EASE }}
              >
                <Link
                  to="/pricing"
                  onClick={() => setOpen(false)}
                  className="btn-primary mt-6 inline-block rounded-full px-8 py-3.5 font-semibold"
                >
                  Get Started
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5, ease: EASE }}
              >
                {userEmail ? (
                  <>
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-sm font-medium text-white/70">
                      {userEmail}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="mt-1 inline-flex cursor-pointer items-center gap-1.5 rounded-full px-6 py-2.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
                    >
                      <LogOut size={15} />
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/"
                    onClick={() => setOpen(false)}
                    className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full px-6 py-2.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
                  >
                    <LogIn size={15} />
                    Login
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
