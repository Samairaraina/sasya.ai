import { motion } from 'framer-motion'
import { CloudSun, Droplets, Gauge, Sparkles, Thermometer, Wind, Sun } from 'lucide-react'
import { SectionHeading, Reveal, EASE } from '../../lib/animations'

const forecast = [
  { day: 'Mon', icon: 'sun', hi: 33, lo: 21, rain: 0 },
  { day: 'Tue', icon: 'cloud', hi: 32, lo: 22, rain: 10 },
  { day: 'Wed', icon: 'rain', hi: 29, lo: 21, rain: 65 },
  { day: 'Thu', icon: 'rain', hi: 28, lo: 20, rain: 80 },
  { day: 'Fri', icon: 'cloud', hi: 31, lo: 21, rain: 30 },
  { day: 'Sat', icon: 'sun', hi: 34, lo: 22, rain: 0 },
  { day: 'Sun', icon: 'sun', hi: 35, lo: 23, rain: 0 },
]

function WeatherIcon({ type }: { type: string }) {
  if (type === 'sun')
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <motion.circle cx="12" cy="12" r="5" fill="#FFF2A6" />
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.line
            key={i}
            x1="12" y1="2.5" x2="12" y2="5"
            stroke="#FFF2A6" strokeWidth="1.8" strokeLinecap="round"
            transform={`rotate(${i * 45} 12 12)`}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </svg>
    )
  if (type === 'cloud')
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <motion.path
          d="M6 17a4 4 0 0 1-.5-7.97A5 5 0 0 1 15.5 7.6 4 4 0 0 1 16 17H6Z"
          fill="#9fb8c3"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    )
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M6 17a4 4 0 0 1-.5-7.97A5 5 0 0 1 15.5 7.6 4 4 0 0 1 16 17H6Z" fill="#9fb8c3" />
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.line
          key={i}
          x1={7 + i * 2.4} y1="18" x2={6 + i * 2.4} y2="21"
          stroke="#5bb8e8" strokeWidth="1.6" strokeLinecap="round"
          animate={{ y: [0, 1.5, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.25 }}
        />
      ))}
    </svg>
  )
}

const metrics = [
  { icon: Droplets, label: 'Humidity', value: '68%' },
  { icon: Wind, label: 'Wind', value: '12 km/h' },
  { icon: Gauge, label: 'UV Index', value: '6 · High' },
  { icon: Thermometer, label: 'Soil Temp', value: '27°C' },
]

export function Weather() {
  return (
    <section id="weather" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Weather Intelligence"
          title={
            <>
              Know the sky, <span className="gradient-text">before the sky changes</span>.
            </>
          }
          subtitle="Hyper-local weather with AI guidance — irrigation, spraying and harvest windows tuned to your exact field."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {/* Big current card */}
          <Reveal className="lg:col-span-2">
            <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 p-8 lg:p-10">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-butter/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-blush-500/10 blur-3xl" />

              <div className="relative flex flex-col justify-between gap-8 sm:flex-row">
                <div>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <CloudSun size={16} className="text-butter" />
                    Nashik, Maharashtra
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider">Live</span>
                  </div>
                  <div className="mt-6 flex items-end gap-4">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <WeatherIcon type="sun" />
                    </motion.div>
                    <span className="stat-font text-7xl font-bold lg:text-8xl">32°</span>
                    <div className="pb-3">
                      <p className="text-lg font-semibold text-white/80">Mostly Sunny</p>
                      <p className="text-sm text-white/50">Feels like 34° · H: 35° L: 21°</p>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {metrics.map((m) => (
                      <div key={m.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <m.icon size={16} className="text-blush-400" />
                        <p className="mt-2.5 stat-font text-lg font-semibold">{m.value}</p>
                        <p className="text-[11px] text-white/50">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-6 sm:w-56">
                  <div className="rounded-2xl border border-blush-500/25 bg-blush-500/[0.08] p-5">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-blush-400" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-blush-400">
                        AI Weather Advice
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-white/80">
                      Rain expected Wednesday evening. Delay irrigation. Ideal window to spray
                      neem-based fungicide: Tuesday 6–9 AM.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                      <Sun size={14} /> Spray Window
                    </div>
                    <p className="mt-3 stat-font text-2xl font-bold text-emerald-300">Tue · 6–9 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* 7-day forecast */}
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-wider text-white/50">7-Day Forecast</p>
              <div className="mt-5 flex flex-1 flex-col justify-between gap-3">
                {forecast.map((d, i) => (
                  <motion.div
                    key={d.day}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5, ease: EASE }}
                    className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 transition-colors hover:bg-white/[0.07]"
                  >
                    <span className="w-10 text-sm font-medium text-white/60">{d.day}</span>
                    <WeatherIcon type={d.icon} />
                    <span className="text-xs text-white/45">🌧 {d.rain}%</span>
                    <span className="stat-font text-sm font-semibold text-white/85">
                      {d.hi}° <span className="text-white/40">{d.lo}°</span>
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
