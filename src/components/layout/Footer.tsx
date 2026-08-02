import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Github, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { Reveal } from '../../lib/animations'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'AI Scanner', to: '/solutions' },
      { label: 'Weather Intelligence', to: '/solutions' },
      { label: 'Farm Dashboard', to: '/dashboard' },
      { label: 'Features', to: '/features' },
      { label: 'Pricing', to: '/pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Careers', to: '/about' },
      { label: 'Investors', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Resources', to: '/resources' },
      { label: 'Home', to: '/' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Farmer Stories', to: '/resources' },
      { label: 'Help Center', to: '/resources' },
      { label: 'FAQ', to: '/resources' },
      { label: 'Blog', to: '/resources' },
      { label: 'Status', to: '/' },
      { label: 'Sitemap', to: '/' },
    ],
  },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  return (
    <footer className="relative overflow-hidden border-t border-white/10 pt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="flex flex-col items-center gap-8 rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center backdrop-blur lg:flex-row lg:justify-between lg:text-left">
            <div className="max-w-md">
              <h3 className="font-display text-2xl font-bold">Get the <span className="gradient-text">growing insights</span> in your inbox.</h3>
              <p className="mt-2 text-sm text-white/55">Monthly crop intelligence, market trends and scheme alerts. No spam, ever.</p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-3 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 text-sm font-medium text-emerald-300">
                ✓ You're on the list. Happy growing!
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (email) setSubscribed(true)
                }}
                className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@farm.com"
                  className="w-full flex-1 rounded-full border border-white/15 bg-forest-950/60 px-5 py-3 text-sm text-white placeholder-white/35 outline-none transition-colors focus:border-blush-400/50"
                />
                <button type="submit" className="btn-primary shrink-0 rounded-full px-7 py-3 text-sm font-semibold">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </Reveal>

        <div className="mt-16 grid gap-12 pb-16 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo size={34} />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
              The AI farming assistant helping 48,000+ farmers make smarter decisions —
              from disease detection to market intelligence, all in one platform.
            </p>
            <div className="mt-6 flex gap-3">
              {[Twitter, Linkedin, Instagram, Youtube, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="/contact"
                  aria-label="Social link"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/55 transition-all hover:-translate-y-1 hover:border-blush-500/40 hover:text-blush-400"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-white/60 transition-colors hover:text-blush-400">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 sm:flex-row">
          <p className="text-xs text-white/40">© 2026 Sasya Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs text-white/40">
            <Link to="/" className="hover:text-white/70">Privacy</Link>
            <Link to="/" className="hover:text-white/70">Terms</Link>
            <Link to="/" className="hover:text-white/70">Security</Link>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-white/40">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            All systems operational
          </p>
        </div>
      </div>
    </footer>
  )
}
