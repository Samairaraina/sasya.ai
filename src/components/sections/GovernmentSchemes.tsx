import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ExternalLink, Scale, XCircle } from 'lucide-react'
import { SectionHeading, Reveal, EASE } from '../../lib/animations'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'

interface SchemeRow {
  id: string
  title: string
  description: string
  eligibility: string
  category: string | null
  pros: string | null
  cons: string | null
  min_acres: number | null
  link: string | null
}

interface FarmRow {
  id: string
  size_acres: number | null
}

const chipClass = (active: boolean) =>
  `rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
    active
      ? 'bg-butter/15 text-butter ring-1 ring-butter/40'
      : 'border border-white/10 text-white/55 hover:border-white/25 hover:text-white'
  }`

export function GovernmentSchemes() {
  const { user } = useAuth()
  const [schemes, setSchemes] = useState<SchemeRow[]>([])
  const [farmAcres, setFarmAcres] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('All')

  useEffect(() => {
    const uid = user?.id
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const { data, error: schemeErr } = await supabase
          .from('government_schemes')
          .select('*')
          .order('title', { ascending: true })
        if (schemeErr) throw new Error(schemeErr.message)
        if (cancelled) return
        setSchemes((data ?? []) as SchemeRow[])

        if (uid) {
          const { data: farmData, error: farmErr } = await supabase
            .from('farms')
            .select('size_acres')
            .eq('user_id', uid)
            .limit(1)
          if (farmErr) throw new Error(farmErr.message)
          const first = (farmData ?? [])[0] as FarmRow | undefined
          if (!cancelled) setFarmAcres(first?.size_acres ?? null)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load schemes.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [user?.id])

  const categories = useMemo(() => {
    const set = new Set(schemes.map((s) => s.category).filter(Boolean) as string[])
    return ['All', ...set]
  }, [schemes])

  const visible = useMemo(
    () => (filter === 'All' ? schemes : schemes.filter((s) => s.category === filter)),
    [schemes, filter],
  )

  const qualifies = useCallback(
    (s: SchemeRow) => {
      if (s.min_acres === null || s.min_acres === undefined) return 'unknown'
      if (farmAcres === null) return 'unknown'
      return farmAcres >= s.min_acres ? 'yes' : 'no'
    },
    [farmAcres],
  )

  return (
    <section id="schemes" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Government Schemes"
          title={
            <>
              Never miss a <span className="gradient-text">subsidy again</span>.
            </>
          }
          subtitle="We match central and state schemes against your farm size, then show the real trade-offs — what each one pays, and what it asks in return."
        />

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: EASE }}
          className="relative mt-14 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-6 shadow-card backdrop-blur lg:p-8"
        >
          {error && (
            <div className="mb-5 rounded-xl border border-blush-500/30 bg-blush-500/10 px-4 py-2.5 text-sm text-blush-300">
              {error}
            </div>
          )}

          {!loading && farmAcres !== null && (
            <div className="mb-6 flex items-center gap-2 text-sm text-white/60">
              <Scale size={15} className="text-emerald-300" />
              Matched against your farm — {farmAcres} acre{farmAcres === 1 ? '' : 's'}.
              <span className="hidden text-white/35 sm:inline">
                Update your farm size to refine matches.
              </span>
            </div>
          )}

          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={chipClass(filter === c)}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid place-items-center py-20 text-sm text-white/50">Loading schemes…</div>
          ) : visible.length === 0 ? (
            <div className="py-16 text-center text-sm text-white/50">No schemes in this category yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
                    <th className="px-3 py-3 font-medium">Scheme</th>
                    <th className="px-3 py-3 font-medium">Pros</th>
                    <th className="px-3 py-3 font-medium">Cons</th>
                    <th className="px-3 py-3 text-right font-medium">Fit</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((s) => {
                    const fit = qualifies(s)
                    const pros = (s.pros ?? '').split('·').map((p) => p.trim()).filter(Boolean)
                    const cons = (s.cons ?? '').split('·').map((c) => c.trim()).filter(Boolean)
                    return (
                      <tr
                        key={s.id}
                        className="border-b border-white/[0.06] align-top transition-colors hover:bg-white/[0.03]"
                      >
                        <td className="px-3 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-white">{s.title}</span>
                            {s.category && (
                              <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/45">
                                {s.category}
                              </span>
                            )}
                          </div>
                          <p className="mt-1.5 text-xs leading-relaxed text-white/50">{s.description}</p>
                          <p className="mt-1.5 text-xs italic text-white/35">{s.eligibility}</p>
                        </td>
                        <td className="px-3 py-4">
                          <ul className="space-y-1 text-xs text-emerald-200/80">
                            {pros.map((p) => (
                              <li key={p} className="flex gap-1.5">
                                <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-emerald-400" />
                                <span className="text-white/65">{p}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-3 py-4">
                          <ul className="space-y-1 text-xs">
                            {cons.map((c) => (
                              <li key={c} className="flex gap-1.5">
                                <XCircle size={13} className="mt-0.5 shrink-0 text-blush-400" />
                                <span className="text-white/55">{c}</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-3 py-4 text-right">
                          {fit === 'yes' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-200 ring-1 ring-emerald-400/40">
                              <CheckCircle2 size={12} /> You qualify
                            </span>
                          ) : fit === 'no' ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1 text-xs text-white/50">
                              Needs {s.min_acres} acres
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1 text-xs text-white/50">
                              Check eligibility
                            </span>
                          )}
                          {s.link && (
                            <a
                              href={s.link}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blush-400 transition-colors hover:text-blush-300"
                            >
                              Apply <ExternalLink size={12} />
                            </a>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        <Reveal className="mt-8 text-center text-xs text-white/35">
          Scheme data is indicative — always confirm current rules on the official portal before applying.
        </Reveal>
      </div>
    </section>
  )
}
