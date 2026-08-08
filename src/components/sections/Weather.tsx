import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  CloudSun, Droplets, Gauge, Sparkles,
  Thermometer, Wind, Sun, MapPin, RefreshCw,
} from 'lucide-react'
import { SectionHeading, Reveal, EASE } from '../../lib/animations'

import {
  WEATHER_KEY,
  CurrentWeather, ForecastDay,
  fetchCurrent, fetchForecast,
  generateAIAdvice, getBestSprayWindow
} from '../../lib/weather'

// ─── Icon helpers ─────────────────────────────────────────────────────────────
function WeatherIcon({ code, size = 36 }: { code: string; size?: number }) {
  return (
    <img
      src={`https://openweathermap.org/img/wn/${code}@2x.png`}
      alt="weather"
      width={size}
      height={size}
      className="drop-shadow-lg"
    />
  )
}

// ─── Component ────────────────────────────────────────────────────────────────
export function Weather() {
  const [current, setCurrent]   = useState<CurrentWeather | null>(null)
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [advice, setAdvice]     = useState<string>('')
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [locName, setLocName]   = useState('Detecting location…')

  const loadWeather = async (lat: number, lon: number) => {
    try {
      setLoading(true)
      setError(null)
      const [cur, fore] = await Promise.all([
        fetchCurrent(lat, lon),
        fetchForecast(lat, lon),
      ])
      setCurrent(cur)
      setForecast(fore)
      setLocName(`${cur.city}, ${cur.country}`)
      generateAIAdvice(cur, fore).then(setAdvice)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setError(`Weather error: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!WEATHER_KEY) {
      setError('Add VITE_WEATHER_API_KEY on Vercel to load live weather.')
      setLoading(false)
      return
    }
    // Try geolocation, fallback to Nashik, Maharashtra
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadWeather(pos.coords.latitude, pos.coords.longitude),
        ()    => loadWeather(20.0059, 73.7997),
        { timeout: 6000 },
      )
    } else {
      loadWeather(20.0059, 73.7997)
    }
  }, [])

  const metrics = current
    ? [
        { icon: Droplets,    label: 'Humidity',    value: `${current.humidity}%` },
        { icon: Wind,        label: 'Wind',         value: `${current.windSpeed} km/h` },
        { icon: Gauge,       label: 'Pressure',     value: `${current.pressure} hPa` },
        { icon: Thermometer, label: 'Feels Like',   value: `${current.feelsLike}°C` },
      ]
    : []

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
          subtitle="Hyper-local forecasts, rain probability and AI advice on the perfect day to sow or spray."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {/* ── Current conditions ── */}
          <Reveal className="lg:col-span-2">
            <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 p-8 lg:p-10">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-butter/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-blush-500/10 blur-3xl" />

              <div className="relative flex flex-col justify-between gap-8 sm:flex-row">
                <div className="flex-1">
                  {/* Location row */}
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <CloudSun size={16} className="text-butter" />
                    <MapPin size={13} />
                    <span>{locName}</span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider">
                      {loading ? 'Loading…' : 'Live'}
                    </span>
                    {!loading && (
                      <button
                        onClick={() => navigator.geolocation?.getCurrentPosition(
                          p => loadWeather(p.coords.latitude, p.coords.longitude),
                          () => loadWeather(20.0059, 73.7997),
                        )}
                        className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
                        title="Refresh"
                      >
                        <RefreshCw size={12} />
                      </button>
                    )}
                  </div>

                  {/* Temperature */}
                  {loading ? (
                    <div className="mt-6 flex items-end gap-4">
                      <div className="h-20 w-20 animate-pulse rounded-2xl bg-white/10" />
                      <div className="space-y-2">
                        <div className="h-16 w-40 animate-pulse rounded-xl bg-white/10" />
                        <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
                      </div>
                    </div>
                  ) : error ? (
                    <p className="mt-6 text-sm text-blush-400">{error}</p>
                  ) : current ? (
                    <div className="mt-6 flex items-end gap-4">
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <WeatherIcon code={current.icon} size={72} />
                      </motion.div>
                      <div>
                        <span className="stat-font text-7xl font-bold lg:text-8xl">{current.temp}°</span>
                        <div className="pb-3">
                          <p className="text-lg font-semibold capitalize text-white/80">{current.description}</p>
                          <p className="text-sm text-white/50">
                            Feels {current.feelsLike}° · H: {current.hi}° L: {current.lo}°
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Metrics grid */}
                  {!loading && !error && current && (
                    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {metrics.map((m) => (
                        <div key={m.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                          <m.icon size={16} className="text-blush-400" />
                          <p className="mt-2.5 stat-font text-lg font-semibold">{m.value}</p>
                          <p className="text-[11px] text-white/50">{m.label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI advice + spray window */}
                <div className="flex flex-col justify-between gap-6 sm:w-60">
                  <div className="rounded-2xl border border-blush-500/25 bg-blush-500/[0.08] p-5">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-blush-400" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-blush-400">
                        AI Farming Advice
                      </span>
                    </div>
                    {loading ? (
                      <div className="mt-3 space-y-2">
                        <div className="h-3 w-full animate-pulse rounded bg-white/10" />
                        <div className="h-3 w-4/5 animate-pulse rounded bg-white/10" />
                        <div className="h-3 w-3/5 animate-pulse rounded bg-white/10" />
                      </div>
                    ) : (
                      <p className="mt-3 text-sm leading-relaxed text-white/80">
                        {advice || 'Generating advice…'}
                      </p>
                    )}
                  </div>

                  {!loading && forecast.length > 0 && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                        <Sun size={14} /> Best Spray Window
                      </div>
                      <p className="mt-3 stat-font text-2xl font-bold text-emerald-300">
                        {getBestSprayWindow(forecast)}
                      </p>
                      <p className="mt-1 text-[11px] text-white/40">Low rain · Cool temp · Early morning</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Reveal>

          {/* ── 7-day forecast ── */}
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-wider text-white/50">
                {forecast.length}-Day Forecast
              </p>
              <div className="mt-5 flex flex-1 flex-col justify-between gap-2">
                {loading
                  ? Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="h-12 animate-pulse rounded-xl bg-white/[0.04]" />
                    ))
                  : forecast.map((d, i) => (
                      <motion.div
                        key={d.day + i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06, duration: 0.5, ease: EASE }}
                        className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 transition-colors hover:bg-white/[0.07]"
                      >
                        <span className="w-10 text-sm font-medium text-white/60">{d.day}</span>
                        <WeatherIcon code={d.iconCode} size={28} />
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
