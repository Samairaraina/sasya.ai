import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SectionHeading, EASE } from '../../lib/animations'
import { supabase, type Database } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { Activity, Clock, Image as ImageIcon, CloudSun, Droplets, Wind, Wallet, TrendingUp, TrendingDown, CalendarClock, ArrowRight, CheckCircle2 } from 'lucide-react'
import { fetchCurrent, CurrentWeather, fetchForecast, ForecastDay, getBestSprayWindow } from '../../lib/weather'

type DiseaseReport = Database['public']['Tables']['disease_reports']['Row']

const STATIC_REMINDERS = [
  { id: 1, task: 'Apply Nitrogen Fertilizer', date: 'Today', status: 'pending' },
  { id: 2, task: 'Check Soil Moisture', date: 'Tomorrow', status: 'pending' },
  { id: 3, task: 'Schedule Harvesting for Wheat', date: 'In 3 days', status: 'upcoming' },
  { id: 4, task: 'Buy Seeds for next season', date: 'Next Week', status: 'upcoming' },
]

export function FarmDashboard() {
  const { user } = useAuth()
  
  const [reports, setReports] = useState<DiseaseReport[]>([])
  const [weather, setWeather] = useState<CurrentWeather | null>(null)
  const [sprayWindow, setSprayWindow] = useState<string>('Check forecast')
  
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    async function loadDashboardData() {
      try {
        setLoading(true)
        
        // 1. Fetch Scan History
        const { data: reportData, error: reportErr } = await supabase
          .from('disease_reports')
          .select('*')
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false })
          .limit(3)
        if (reportErr) throw reportErr
        setReports(reportData || [])

        // 2. Fetch Financial Data
        const { data: incomeData } = await supabase.from('crop_income').select('amount').eq('user_id', user!.id)
        const { data: expenseData } = await supabase.from('crop_expenses').select('amount').eq('user_id', user!.id)
        
        const inc = (incomeData || []).reduce((acc, curr) => acc + (curr.amount || 0), 0)
        const exp = (expenseData || []).reduce((acc, curr) => acc + (curr.amount || 0), 0)
        setTotalIncome(inc)
        setTotalExpense(exp)

        // 3. Fetch Weather (Nashik default for now if geolocation fails, or just default to Nashik for speed)
        try {
          const lat = 20.0059
          const lon = 73.7997
          const cur = await fetchCurrent(lat, lon)
          const fore = await fetchForecast(lat, lon)
          setWeather(cur)
          setSprayWindow(getBestSprayWindow(fore))
        } catch (wErr) {
          console.warn('Weather fetch failed in dashboard', wErr)
        }

      } catch (err: any) {
        console.error('Error fetching dashboard:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user])

  const netProfit = totalIncome - totalExpense

  return (
    <section id="dashboard" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Farm Dashboard"
          title={
            <>
              Your farm at a <span className="gradient-text">glance</span>.
            </>
          }
          subtitle="A comprehensive summary of your weather, finances, reminders, and AI scans."
        />

        {loading ? (
          <div className="mt-16 flex min-h-[400px] flex-col items-center justify-center gap-4 text-white/50">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blush-400 border-t-transparent" />
            <p className="text-sm">Loading your dashboard...</p>
          </div>
        ) : !user ? (
          <div className="mt-16 flex min-h-[400px] flex-col items-center justify-center gap-4 text-center rounded-3xl border border-white/10 bg-white/[0.02]">
            <span className="grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]">
              <Activity size={26} className="text-white/40" />
            </span>
            <div>
              <p className="font-display text-lg font-bold">Please log in</p>
              <p className="mt-1 text-sm text-white/50">You need to be logged in to view your dashboard.</p>
            </div>
          </div>
        ) : error ? (
          <div className="mt-16 flex min-h-[400px] flex-col items-center justify-center gap-4 text-center rounded-3xl border border-white/10 bg-white/[0.02]">
            <p className="text-sm text-red-400">Failed to load dashboard: {error}</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, ease: EASE }}
            className="mt-16 grid gap-6 lg:grid-cols-3 lg:grid-rows-[auto_auto]"
          >
            
            {/* 1. WEATHER WIDGET */}
            <div className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-forest-900 p-6 lg:p-8">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
                <CloudSun size={16} className="text-butter" />
                Weather
              </div>
              {weather ? (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="stat-font text-5xl font-bold">{weather.temp}°</p>
                      <p className="text-sm text-white/60 capitalize mt-1">{weather.description}</p>
                    </div>
                    <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="icon" className="w-16 h-16" />
                  </div>
                  <div className="mt-6 flex gap-4 text-sm text-white/70">
                    <span className="flex items-center gap-1"><Droplets size={14} className="text-blush-400"/> {weather.humidity}%</span>
                    <span className="flex items-center gap-1"><Wind size={14} className="text-blush-400"/> {weather.windSpeed} km/h</span>
                  </div>
                  <div className="mt-6 rounded-xl bg-white/[0.05] p-3 text-sm">
                    <span className="text-emerald-300 font-semibold block mb-1">Best Spray Window</span>
                    {sprayWindow}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-white/40 my-auto">Weather data unavailable</p>
              )}
            </div>

            {/* 2. FINANCIAL WIDGET */}
            <div className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-forest-900 p-6 lg:p-8">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
                <Wallet size={16} className="text-emerald-400" />
                Finances
              </div>
              <div className="flex-1 flex flex-col justify-center gap-6">
                <div>
                  <p className="text-xs text-white/50 mb-1">Net Profit / Loss</p>
                  <p className={`stat-font text-4xl font-bold ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    ₹{Math.abs(netProfit).toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between gap-4">
                  <div className="flex-1 rounded-xl bg-white/[0.05] p-3">
                    <span className="flex items-center gap-1 text-[10px] uppercase text-emerald-400 mb-1"><TrendingUp size={12}/> Income</span>
                    <p className="stat-font font-semibold text-lg">₹{totalIncome.toLocaleString()}</p>
                  </div>
                  <div className="flex-1 rounded-xl bg-white/[0.05] p-3">
                    <span className="flex items-center gap-1 text-[10px] uppercase text-red-400 mb-1"><TrendingDown size={12}/> Expense</span>
                    <p className="stat-font font-semibold text-lg">₹{totalExpense.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. REMINDERS WIDGET (Spans 2 rows on Desktop) */}
            <div className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:p-8 lg:row-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
                  <CalendarClock size={16} className="text-blush-400" />
                  Upcoming Tasks
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-3">
                {STATIC_REMINDERS.map(reminder => (
                  <div key={reminder.id} className="group flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.06]">
                    <CheckCircle2 size={18} className="mt-0.5 text-white/20 group-hover:text-emerald-400 transition-colors cursor-pointer" />
                    <div>
                      <p className="text-sm font-medium text-white/90">{reminder.task}</p>
                      <p className="text-xs text-blush-300 mt-1">{reminder.date}</p>
                    </div>
                  </div>
                ))}
                <button className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-white/[0.05] py-3 text-sm font-semibold text-white/70 transition-colors hover:bg-white/[0.1] hover:text-white">
                  View Full Calendar <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* 4. SCAN HISTORY WIDGET (Spans 2 cols on Desktop) */}
            <div className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-2 lg:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
                  <Activity size={16} className="text-emerald-400" />
                  Recent Scans
                </div>
                <a href="#scanner" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                  New Scan <ArrowRight size={12}/>
                </a>
              </div>

              {reports.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <ImageIcon size={24} className="text-white/20 mb-3" />
                  <p className="text-sm text-white/50">No scans yet. Use the AI Scanner to diagnose crops.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-3">
                  {reports.map((report) => (
                    <div key={report.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-forest-950 transition-colors hover:border-white/20">
                      <div className="aspect-[4/3] w-full overflow-hidden bg-forest-900">
                        {report.image ? (
                          <img src={report.image} alt="Scan" className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <div className="grid h-full place-items-center text-white/10"><ImageIcon size={24} /></div>
                        )}
                        <div className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 backdrop-blur">
                          {report.confidence ? `${report.confidence}% Match` : 'Result'}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between text-[10px] text-white/40 mb-1.5">
                          <span className="flex items-center gap-1"><Clock size={10} /> {new Date(report.created_at).toLocaleDateString()}</span>
                          <span className="rounded bg-white/10 px-1.5 py-0.5">{report.crop_name}</span>
                        </div>
                        <h4 className="font-display text-sm font-bold text-white line-clamp-1">
                          {report.disease_name || 'Healthy'}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </motion.div>
        )}
      </div>
    </section>
  )
}
