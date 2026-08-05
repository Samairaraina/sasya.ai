import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SectionHeading, EASE } from '../../lib/animations'
import { supabase, type Database } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { Activity, Clock, Image as ImageIcon } from 'lucide-react'

type DiseaseReport = Database['public']['Tables']['disease_reports']['Row']

export function FarmDashboard() {
  const { user } = useAuth()
  const [reports, setReports] = useState<DiseaseReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    async function fetchHistory() {
      try {
        const { data, error } = await supabase
          .from('disease_reports')
          .select('*')
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setReports(data || [])
      } catch (err: any) {
        console.error('Error fetching history:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [user])

  return (
    <section id="dashboard" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Input History"
          title={
            <>
              Your recent <span className="gradient-text">scans and reports</span>.
            </>
          }
          subtitle="A complete timeline of your AI crop diagnoses, available at a glance."
        />

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: EASE }}
          className="relative mt-16 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-6 shadow-card backdrop-blur lg:p-8"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <p className="font-display text-xl font-bold">Scan History</p>
              <p className="mt-1 text-sm text-white/50">Keep track of your crop health over time</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-400/15 px-4 py-2 text-[12px] font-semibold text-emerald-300">
                {reports.length} Total Scans
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-white/50">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-blush-400 border-t-transparent" />
              <p className="text-sm">Loading your history...</p>
            </div>
          ) : !user ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]">
                <Activity size={26} className="text-white/40" />
              </span>
              <div>
                <p className="font-display text-lg font-bold">Please log in</p>
                <p className="mt-1 text-sm text-white/50">You need to be logged in to view your scan history.</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
              <p className="text-sm text-red-400">Failed to load history: {error}</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]">
                <ImageIcon size={26} className="text-blush-400/50" />
              </span>
              <div>
                <p className="font-display text-lg font-bold">No scans yet</p>
                <p className="mt-1 text-sm text-white/50">Use the AI Scanner to diagnose your crops.</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map((report, i) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:bg-white/[0.05]"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-forest-950">
                    {report.image ? (
                      <img src={report.image} alt="Scan" className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full place-items-center text-white/20">
                        <ImageIcon size={32} />
                      </div>
                    )}
                    <div className="absolute left-3 top-3 rounded-full bg-forest-950/80 px-2.5 py-1 text-[10px] font-semibold text-emerald-300 backdrop-blur">
                      {report.confidence ? `${report.confidence}% Match` : 'Result'}
                    </div>
                  </div>
                  
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-2 flex items-center justify-between text-xs text-white/50">
                      <span className="flex items-center gap-1.5"><Clock size={12} /> {new Date(report.created_at).toLocaleDateString()}</span>
                      <span className="rounded-full bg-white/[0.06] px-2 py-0.5">{report.crop_name}</span>
                    </div>
                    
                    <h4 className="font-display text-base font-bold text-white line-clamp-2">
                      {report.disease_name || 'Healthy'}
                    </h4>
                    
                    <p className="mt-3 text-sm text-white/60 line-clamp-3">
                      {report.recommendation || 'No specific recommendations provided.'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
