import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { EASE } from '../../lib/animations'
import { supabase, type Database } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { Activity } from 'lucide-react'

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

export function FarmDashboard() {
  const { user } = useAuth()
  
  const [reports, setReports] = useState<DiseaseReport[]>([])
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  const [pendingTasksCount, setPendingTasksCount] = useState(0)
  
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
        
        // Fetch Scan History
        const { data: reportData, error: reportErr } = await supabase
          .from('disease_reports')
          .select('*')
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false })
          .limit(3)
        if (reportErr) throw reportErr
        setReports(reportData || [])

        // Fetch Financial Data
        const { data: incomeData } = await supabase.from('crop_income').select('amount').eq('user_id', user!.id)
        const { data: expenseData } = await supabase.from('crop_expenses').select('amount').eq('user_id', user!.id)
        
        const inc = (incomeData || []).reduce((acc, curr) => acc + (curr.amount || 0), 0)
        const exp = (expenseData || []).reduce((acc, curr) => acc + (curr.amount || 0), 0)
        setTotalIncome(inc)
        setTotalExpense(exp)

      } catch (err: any) {
        console.error('Error fetching dashboard:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user])

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
              <DashboardGreeting name="Samaira" pendingTasks={pendingTasksCount} weatherSuitable={true} />
              <QuickActions />
              <FarmStatsBar />
            </div>

            {/* Grid Layout for Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Top Row: AI & Weather focus */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                <CropHealthWidget />
                <YieldPredictionWidget />
              </div>
              <div className="lg:col-span-2">
                <WeatherWidget />
              </div>
              <div className="lg:col-span-1 flex flex-col gap-6">
                <AIRecommendationsWidget />
                <AIChatWidget />
              </div>

              {/* Analytics Row */}
              <FinanceAnalyticsWidget totalIncome={totalIncome} totalExpense={totalExpense} />
              <DiseaseAnalyticsWidget />
              <TasksWidget onPendingCountChange={setPendingTasksCount} />

              {/* Environment & Environment Row */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <SoilHealthWidget />
                <FarmMapWidget />
              </div>
              <div className="lg:col-span-1 flex flex-col gap-6">
                <IrrigationTrackerWidget />
                <CropProgressWidget />
              </div>
              <div className="lg:col-span-1 flex flex-col gap-6">
                <RecentScansWidget reports={reports} />
                <FarmCalendarWidget />
              </div>

              {/* Ecosystem Row */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                <MarketPricesWidget />
              </div>
              <div className="lg:col-span-2 flex flex-col gap-6">
                <SchemesWidget />
              </div>
              <div className="lg:col-span-1 flex flex-col gap-6">
                <ActivityTimelineWidget />
                <SmartNotificationsWidget />
              </div>
              
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
