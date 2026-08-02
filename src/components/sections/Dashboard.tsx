import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CalendarDays, HeartPulse, TrendingUp, Wallet } from 'lucide-react'
import { SectionHeading, EASE } from '../../lib/animations'

const healthTrend = [
  { m: 'Jan', s: 62 }, { m: 'Feb', s: 68 }, { m: 'Mar', s: 64 },
  { m: 'Apr', s: 74 }, { m: 'May', s: 71 }, { m: 'Jun', s: 82 },
  { m: 'Jul', s: 86 }, { m: 'Aug', s: 84 }, { m: 'Sep', s: 90 },
]

const revenue = [
  { m: 'Q1', rev: 82000, exp: 48000 },
  { m: 'Q2', rev: 124000, exp: 61000 },
  { m: 'Q3', rev: 168000, exp: 74000 },
  { m: 'Q4', rev: 145000, exp: 68000 },
]

const expenseSplit = [
  { name: 'Fertilizers', value: 34, color: '#F38BBC' },
  { name: 'Seeds', value: 22, color: '#3DDC97' },
  { name: 'Labour', value: 26, color: '#FFF2A6' },
  { name: 'Water', value: 18, color: '#F9B4D0' },
]

const calendar = [
  { d: 'Mon', task: 'Irrigation', color: '#3DDC97' },
  { d: 'Tue', task: 'Foliar spray', color: '#F38BBC' },
  { d: 'Wed', task: 'Weed control', color: '#FFF2A6' },
  { d: 'Thu', task: 'Soil sample', color: '#F9B4D0' },
  { d: 'Fri', task: 'Market visit', color: '#3DDC97' },
]

const heatmap = Array.from({ length: 8 * 14 }).map((_, i) => {
  const r = Math.random()
  const base = Math.floor(i / 14) * 0.8
  return r * 0.5 + base * 0.3
})

function tooltipStyle() {
  return {
    background: 'rgba(13,38,36,0.95)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 12,
    fontSize: 12,
    color: '#fff',
  }
}

export function FarmDashboard() {
  return (
    <section id="dashboard" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Farm Dashboard"
          title={
            <>
              Your entire farm, <span className="gradient-text">one glance</span>.
            </>
          }
          subtitle="Live crop health, finances, calendar and satellite analytics — every metric that matters, beautifully visualized."
        />

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: EASE }}
          className="relative mt-16 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-6 shadow-card backdrop-blur lg:p-8"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-xl font-bold">Green Valley Farm</p>
              <p className="text-sm text-white/50">12.5 acres · Tomato + Chilli · Nashik</p>
            </div>
            <div className="flex items-center gap-2">
              {['Overview', 'Crops', 'Finance'].map((t, i) => (
                <span
                  key={t}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${
                    i === 0
                      ? 'bg-blush-500/15 text-blush-400'
                      : 'border border-white/10 text-white/50'
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-12">
            {/* Health score */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-3">
              <div className="flex items-center gap-2 text-sm text-white/50">
                <HeartPulse size={15} className="text-emerald-300" />
                Crop Health Score
              </div>
              <div className="relative mx-auto mt-6 h-32 w-32">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                  <motion.circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke="url(#hs)" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 50}
                    initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                    whileInView={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - 0.88) }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, ease: EASE }}
                  />
                  <defs>
                    <linearGradient id="hs" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#3DDC97" />
                      <stop offset="100%" stopColor="#F38BBC" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <p className="stat-font text-4xl font-bold text-emerald-300">88</p>
                    <p className="text-[10px] uppercase tracking-wider text-white/45">/ 100</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-white/55">
                Excellent · 2% ↑ this week
              </p>
              <div className="mt-5 space-y-2">
                {[
                  { l: 'Field A · Tomato', v: 92 },
                  { l: 'Field B · Chilli', v: 78 },
                  { l: 'Field C · Fallow', v: 85 },
                ].map((r) => (
                  <div key={r.l}>
                    <div className="flex justify-between text-[11px] text-white/55">
                      <span>{r.l}</span>
                      <span>{r.v}</span>
                    </div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-blush-400"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${r.v}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: EASE }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health chart */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/50">Health Trend · 9 months</p>
                <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                  +26 pts
                </span>
              </div>
              <div className="mt-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={healthTrend}>
                    <defs>
                      <linearGradient id="healthFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3DDC97" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#3DDC97" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} width={28} />
                    <Tooltip contentStyle={tooltipStyle()} />
                    <Area type="monotone" dataKey="s" stroke="#3DDC97" strokeWidth={2.5} fill="url(#healthFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue vs expense */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/50">Finance · FY 2025</p>
                <TrendingUp size={15} className="text-emerald-300" />
              </div>
              <div className="mt-4 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenue} barGap={4}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} width={40} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip contentStyle={tooltipStyle()} />
                    <Bar dataKey="rev" fill="#3DDC97" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="exp" fill="#F38BBC" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-white/55">
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Revenue ₹5.19L</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blush-500" /> Expense ₹2.51L</span>
              </div>
            </div>

            {/* Expense pie + calendar + heatmap */}
            <div className="grid gap-5 lg:col-span-7 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="flex items-center gap-2 text-sm text-white/50">
                  <Wallet size={14} className="text-blush-400" /> Expense Split
                </p>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={expenseSplit} dataKey="value" innerRadius={42} outerRadius={62} paddingAngle={3} strokeWidth={0}>
                        {expenseSplit.map((e) => (
                          <Cell key={e.name} fill={e.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle()} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-1 grid grid-cols-2 gap-2 text-[11px] text-white/55">
                  {expenseSplit.map((e) => (
                    <span key={e.name} className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ background: e.color }} />
                      {e.name} {e.value}%
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="flex items-center gap-2 text-sm text-white/50">
                  <CalendarDays size={14} className="text-emerald-300" /> This Week
                </p>
                <div className="mt-4 space-y-2.5">
                  {calendar.map((c) => (
                    <div key={c.d} className="flex items-center gap-3 text-sm">
                      <span className="w-9 text-xs font-medium text-white/45">{c.d}</span>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.color }} />
                      <span className="text-white/75">{c.task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Heatmap */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/50">Satellite Health · NDVI</p>
                <div className="flex items-center gap-1 text-[10px] text-white/45">
                  Low
                  {['#173b3a', '#1d554c', '#247d63', '#2fa87b', '#3ddc97'].map((c) => (
                    <span key={c} className="h-3 w-3 rounded-sm" style={{ background: c }} />
                  ))}
                  High
                </div>
              </div>
              <div className="mt-4 grid gap-1" style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}>
                {heatmap.map((v, i) => {
                  const idx = Math.min(4, Math.floor(v * 5))
                  return (
                    <motion.span
                      key={i}
                      className="aspect-square rounded-[3px]"
                      style={{ background: ['#173b3a', '#1d554c', '#247d63', '#2fa87b', '#3ddc97'][idx] }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.004 }}
                    />
                  )
                })}
              </div>
              <p className="mt-3 text-[11px] text-white/45">
                Field B showing mild stress in the north-east corner — flagged for irrigation check.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
