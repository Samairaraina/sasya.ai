import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, CalendarDays, IndianRupee, ShieldAlert, Sprout, Activity } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import { supabase } from '../../lib/supabase'
import { generateYieldPredictions, type YieldPrediction } from '../../lib/gemini'
import { EASE } from '../../lib/animations'

export function YieldPredictionSection() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [predictions, setPredictions] = useState<YieldPrediction[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    async function fetchData() {
      try {
        setLoading(true)
        
        // Fetch active crops and farms
        const [{ data: crops }, { data: farms }] = await Promise.all([
          supabase.from('crops').select('*').eq('user_id', user!.id),
          supabase.from('farms').select('*').eq('user_id', user!.id)
        ])

        if (!crops || crops.length === 0) {
          setPredictions([])
          return
        }

        // Generate AI Prediction
        const preds = await generateYieldPredictions(crops, farms || [])
        setPredictions(preds)

      } catch (err: any) {
        console.error('Error fetching yield data:', err)
        setError('Failed to load yield predictions. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (loading) {
    return (
      <section className="relative py-24 bg-forest-950 flex flex-col items-center justify-center min-h-[500px]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
        <p className="mt-4 text-white/50 text-sm">Our ML models are analyzing your fields...</p>
      </section>
    )
  }

  return (
    <section className="relative py-24 bg-forest-950 min-h-screen">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        
        {error ? (
           <div className="flex flex-col items-center justify-center gap-4 text-center rounded-[20px] border border-red-500/20 bg-red-500/10 p-10">
             <ShieldAlert size={32} className="text-red-400" />
             <p className="text-sm text-red-200">{error}</p>
           </div>
        ) : predictions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 text-center rounded-[20px] border border-white/10 bg-white/[0.02] p-16">
            <span className="grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]">
              <Sprout size={26} className="text-white/40" />
            </span>
            <div>
              <p className="font-display text-lg font-bold text-white">No active crops found</p>
              <p className="mt-2 text-sm text-white/50 max-w-md mx-auto">
                Add your fields and crops in the Dashboard to get personalized AI yield predictions.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictions.map((pred, i) => (
              <motion.div
                key={pred.cropId || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
                className="group relative flex flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.04]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-2xl font-bold text-white">{pred.cropName}</h3>
                    <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">
                      <Activity size={14} />
                      {pred.confidenceScore}% Confidence
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-white/50 mb-1 flex items-center gap-2">
                        <TrendingUp size={16} /> Estimated Yield
                      </p>
                      <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-butter to-emerald-400">
                        {pred.estimatedYieldRange}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                      <div>
                        <p className="text-xs text-white/40 mb-1 flex items-center gap-1.5">
                          <IndianRupee size={12} /> Revenue Est.
                        </p>
                        <p className="text-base font-semibold text-white/90">{pred.revenueEstimate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 mb-1 flex items-center gap-1.5">
                          <CalendarDays size={12} /> Harvest Date
                        </p>
                        <p className="text-base font-semibold text-white/90">{pred.expectedHarvestDate}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Key Factors</p>
                      <ul className="space-y-2">
                        {pred.keyFactors.map((factor, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-white/70">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
