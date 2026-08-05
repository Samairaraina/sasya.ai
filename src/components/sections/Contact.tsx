import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Mail, MapPin, MessageSquareText, Phone } from 'lucide-react'
import { Reveal, EASE } from '../../lib/animations'

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'samairaraina140801@gmail.com' },
  { icon: Phone, label: 'Phone', value: '---' },
  { icon: MapPin, label: 'Office', value: 'Agritech Hub, Bengaluru, India' },
  { icon: MessageSquareText, label: 'Support', value: 'WhatsApp (Hindi and English)' },
]

export function Contact() {
  const [sent, setSent] = useState(false)

  return (
    <section id="contact-page" className="relative pb-24 lg:pb-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Info side */}
          <Reveal className="lg:col-span-2">
            <div className="flex h-full flex-col gap-5">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur">
                <h2 className="font-display text-2xl font-bold">Let's grow together.</h2>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  Whether you're a farmer, an FPO, a government body or an investor — our
                  team will get back to you within one business day.
                </p>
                <div className="mt-8 space-y-5">
                  {contactInfo.map((c) => (
                    <div key={c.label} className="flex items-start gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]">
                        <c.icon size={18} className="text-blush-400" />
                      </span>
                      <div>
                        <p className="text-xs text-white/45">{c.label}</p>
                        <p className="text-sm font-semibold text-white/85">{c.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 rounded-3xl border border-blush-500/20 bg-gradient-to-br from-blush-500/[0.08] to-transparent p-8">
                <p className="text-sm text-white/60">Farmers in our network save an average of</p>
                <p className="mt-2 font-display text-4xl font-bold">
                  ₹42,000<span className="text-blush-400">/year</span>
                </p>
                <p className="mt-2 text-sm text-white/50">by making data-driven decisions with Sasya.</p>
              </div>
            </div>
          </Reveal>

          {/* Form side */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur lg:p-10">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex min-h-[420px] flex-col items-center justify-center gap-4 text-center"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                    className="grid h-20 w-20 place-items-center rounded-full bg-emerald-400/20"
                  >
                    <CheckCircle2 size={40} className="text-emerald-300" />
                  </motion.span>
                  <h3 className="font-display text-2xl font-bold">Message sent!</h3>
                  <p className="max-w-sm text-sm text-white/60">
                    Thank you for reaching out. Our team will connect with you within one
                    business day.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="btn-ghost mt-2 rounded-full px-6 py-2.5 text-sm font-medium"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    setSent(true)
                  }}
                  className="space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/45">Full Name</label>
                      <input
                        required
                        placeholder="Ravi Kumar"
                        className="w-full rounded-xl border border-white/10 bg-forest-950/60 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-blush-400/50"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/45">Phone</label>
                      <input
                        required
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full rounded-xl border border-white/10 bg-forest-950/60 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-blush-400/50"
                      />
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/45">Email</label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-white/10 bg-forest-950/60 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-blush-400/50"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/45">I am a…</label>
                      <select className="w-full appearance-none rounded-xl border border-white/10 bg-forest-950/60 px-4 py-3 text-sm text-white/80 outline-none transition-colors focus:border-blush-400/50">
                        <option className="bg-forest-900">Farmer</option>
                        <option className="bg-forest-900">FPO / Cooperative</option>
                        <option className="bg-forest-900">Agribusiness</option>
                        <option className="bg-forest-900">Government</option>
                        <option className="bg-forest-900">Investor</option>
                        <option className="bg-forest-900">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/45">Subject</label>
                    <input
                      placeholder="How can Sasya help you?"
                      className="w-full rounded-xl border border-white/10 bg-forest-950/60 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-blush-400/50"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/45">Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us about your farm or your goals…"
                      className="w-full resize-none rounded-xl border border-white/10 bg-forest-950/60 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-blush-400/50"
                    />
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary w-full rounded-full py-4 text-sm font-semibold"
                  >
                    Send Message
                  </motion.button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
