import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { EASE } from '../../lib/animations'
import { supabase, type Database } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { Activity } from 'lucide-react'
import { generateDashboardInsights } from '../../lib/gemini'

// Import all our new widgets
import { DashboardGreeting, QuickActions, FarmStatsBar } from '../dashboard/DashboardHeader'
import { CropHealthWidget, SoilHealthWidget } from '../dashboard/HealthWidgets'
import { WeatherWidget } from '../dashboard/WeatherWidget'
import { AIRecommendationsWidget, YieldPredictionWidget, IrrigationTrackerWidget, AIChatWidget } from '../dashboard/AIInsightsWidgets'
import { FinanceAnalyticsWidget, DiseaseAnalyticsWidget } from '../dashboard/AnalyticsWidgets'
import { CropProgressWidget, RecentScansWidget, ActivityTimelineWidget, FarmCalendarWidget } from '../dashboard/OperationsWidgets'
import { MarketPricesWidget, SchemesWidget, SmartNotificationsWidget, FarmMapWidget } from '../dashboard/EcosystemWidgets'
import { TasksWidget } from '../dashboard/TasksWidget'

type DiseaseReport = Database['public']['Tables']['disease_reports']['Row']
type Crop = Database['public']['Tables']['crops']['Row']
type Farm = Database['public']['Tables']['farms']['Row']

export function FarmDashboard() {
  const { user } = useAuth()
  
  const [reports, setReports] = useState<DiseaseReport[]>([])
  const [crops, setCrops] = useState<Crop[]>([])
  const [farms, setFarms] = useState<Farm[]>([])
  
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  const [pendingTasksCount, setPendingTasksCount] = useState(0)
  const [insights, setInsights] = useState<any>(null)
  
  const [prices, setPrices] = useState<any[]>([])
  const [schemes, setSchemes] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  
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
        
        // 1. Fetch Core Data
        const [
          { data: reportData },
          { data: cropData },
          { data: farmData },
          { data: incomeData },
          { data: expenseData },
          { data: priceData },
          { data: schemeData },
          { data: notifData }
        ] = await Promise.all([
          supabase.from('disease_reports').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }),
          supabase.from('crops').select('*').eq('user_id', user!.id),
          supabase.from('farms').select('*').eq('user_id', user!.id),
          supabase.from('crop_income').select('amount').eq('user_id', user!.id),
          supabase.from('crop_expenses').select('amount').eq('user_id', user!.id),
          supabase.from('market_prices').select('*').limit(4),
          supabase.from('government_schemes').select('*').limit(3),
          supabase.from('notifications').select('*').eq('user_id', user!.id).limit(4)
        ])

        setReports(reportData || [])
        setCrops(cropData || [])
        setFarms(farmData || [])
        setPrices(priceData || [])
        setSchemes(schemeData || [])
        setNotifications(notifData || [])

        const inc = (incomeData || []).reduce((acc, curr) => acc + (curr.amount || 0), 0)
        const exp = (expenseData || []).reduce((acc, curr) => acc + (curr.amount || 0), 0)
        setTotalIncome(inc)
        setTotalExpense(exp)

        // 2. Fetch AI Insights (Cached daily per user to save API calls)
        const todayStr = new Date().toISOString().split('T')[0]
        const cacheKey = `sasya_insights_${user!.id}_${todayStr}`
        const cached = localStorage.getItem(cacheKey)
        
        if (cached) {
          setInsights(JSON.parse(cached))
        } else {
          // Send summary of user data to Gemini for estimation
          const weatherSummary = { temp: 28, humidity: 65, condition: 'Sunny' } // Mock weather for now since weather API is separate
          const recentReports = (reportData || []).slice(0, 3).map(r => ({ crop: r.crop_name, disease: r.disease_name }))
          const activeCrops = (cropData || []).map(c => c.name)
          
          const newInsights = await generateDashboardInsights(weatherSummary, activeCrops, recentReports)
          if (newInsights) {
            setInsights(newInsights)
            localStorage.setItem(cacheKey, JSON.stringify(newInsights))
          }
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

  // Calculate Farm Stats
  const totalAcres = farms.reduce((acc, f) => acc + (f.size_acres || 0), 0)
  const fieldsCount = farms.length
  const activeCropsCount = crops.length
  const aiScansCount = reports.length

  return (
    <section id="dashboard" className="relative py-24 lg:py-32 bg-forest-950 min-h-screen">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        
        {loading ? (
          <div className="mt-16 flex min-h-[400px] flex-col items-center justify-center gap-4 text-white/50">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
            <p className="text-sm">Loading your intelligent dashboard...</p>
          </div>
        ) : !user ? (
          <div className="mt-16 flex min-h-[400px] flex-col items-center justify-center gap-4 text-center rounded-[20px] border border-white/10 bg-white/[0.02]">
            <span className="grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]">
              <Activity size={26} className="text-white/40" />
            </span>
            <div>
              <p className="font-display text-lg font-bold text-white">Please log in</p>
              <p className="mt-1 text-sm text-white/50">You need to be logged in to view your dashboard.</p>
            </div>
          </div>
        ) : error ? (
          <div className="mt-16 flex min-h-[400px] flex-col items-center justify-center gap-4 text-center rounded-[20px] border border-white/10 bg-white/[0.02]">
            <p className="text-sm text-red-400">Failed to load dashboard: {error}</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex flex-col gap-6"
          >
            {/* Header Area */}
            <div>
              <DashboardGreeting name={(user as any)?.user_metadata?.name || user?.email?.split('@')[0] || 'Farmer'} pendingTasks={pendingTasksCount} weatherSuitable={true} />
              <QuickActions />
              <FarmStatsBar 
                totalAcres={totalAcres || 0}
                fields={fieldsCount || 0}
                activeCrops={activeCropsCount || 0}
                tasksToday={pendingTasksCount}
                aiScans={aiScansCount || 0}
              />
            </div>

            {/* Grid Layout for Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Top Row: AI & Weather focus */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                <CropHealthWidget reports={reports} />
                <YieldPredictionWidget yieldEstimate={insights?.yield} />
              </div>
              <div className="lg:col-span-2">
                <WeatherWidget />
              </div>
              <div className="lg:col-span-1 flex flex-col gap-6">
                <AIRecommendationsWidget advice={insights?.advice} />
                <AIChatWidget />
              </div>

              {/* Analytics Row */}
              <FinanceAnalyticsWidget totalIncome={totalIncome} totalExpense={totalExpense} />
              <DiseaseAnalyticsWidget reports={reports} />
              <TasksWidget onPendingCountChange={setPendingTasksCount} />

              {/* Environment & Environment Row */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <SoilHealthWidget soil={insights?.soil} />
                <FarmMapWidget farms={farms} />
              </div>
              <div className="lg:col-span-1 flex flex-col gap-6">
                <IrrigationTrackerWidget />
                <CropProgressWidget crops={crops} />
              </div>
              <div className="lg:col-span-1 flex flex-col gap-6">
                <RecentScansWidget reports={reports.slice(0, 5)} />
                <FarmCalendarWidget />
              </div>

              {/* Ecosystem Row */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                <MarketPricesWidget prices={prices} />
              </div>
              <div className="lg:col-span-2 flex flex-col gap-6">
                <SchemesWidget schemes={schemes} />
              </div>
              <div className="lg:col-span-1 flex flex-col gap-6">
                <ActivityTimelineWidget reports={reports} />
                <SmartNotificationsWidget notifications={notifications} />
              </div>
              
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
