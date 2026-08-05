import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Clock, Calendar, Leaf, Scan } from 'lucide-react'

// --- Crop Progress ---

export function CropProgressWidget({ crops = [] }: { crops?: any[] }) {
  // Generate random deterministic progress based on crop name to avoid having 0 progress for everything.
  // In a full app, this would be computed from planted_at vs expected harvest.
  const getProgress = (name: string) => {
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return Math.abs(hash % 100)
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
        <Leaf size={16} className="text-emerald-400" />
        Crop Progress
      </div>
      
      <div className="flex flex-col gap-5 flex-1">
        {crops.length > 0 ? crops.map(crop => {
          const progress = getProgress(crop.name)
          const stage = progress > 80 ? 'Harvesting' : progress > 40 ? 'Flowering' : 'Growing'
          return (
            <div key={crop.id}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white">{crop.name}</span>
                <span className="text-sm font-semibold text-emerald-400">{progress}%</span>
              </div>
              <p className="text-xs text-white/50 mb-2 uppercase tracking-wide">{stage}</p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-emerald-400"
                />
              </div>
            </div>
          )
        }) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-6">
            <div className="rounded-full bg-white/5 p-4 mb-3">
              <Leaf size={24} className="text-white/20" />
            </div>
            <p className="text-sm font-semibold text-white/70">No active crops</p>
            <p className="text-xs text-white/40 mt-1">Add crops to track progress.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// --- Recent Scans ---
export function RecentScansWidget({ reports }: { reports: any[] }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
        <Scan size={16} className="text-blue-400" />
        Recent AI Scans
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {reports && reports.length > 0 ? reports.slice(0, 3).map((report, i) => {
          const isHealthy = report.disease_name?.toLowerCase().includes('healthy') || report.disease_name === 'No Disease'
          return (
            <div key={report.id || i} className="flex items-center gap-4 rounded-xl bg-white/[0.03] p-3 border border-white/5 transition-colors hover:bg-white/[0.06]">
              {report.image_url ? (
                <img src={report.image_url} alt="Scan" className="h-12 w-12 rounded-lg object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5">
                  <Leaf size={20} className="text-white/20" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-sm text-white truncate">{report.disease_name || 'Unknown'}</p>
                <p className="text-xs text-white/50 mt-1">{new Date(report.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {isHealthy ? <CheckCircle2 size={16} className="text-emerald-400" /> : <AlertCircle size={16} className="text-red-400" />}
                <span className="text-[10px] font-bold text-white/40">{(report.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          )
        }) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-6">
            <div className="rounded-full bg-white/5 p-4 mb-3">
              <Scan size={24} className="text-white/20" />
            </div>
            <p className="text-sm font-semibold text-white/70">No scans yet</p>
            <p className="text-xs text-white/40 mt-1">Start your first AI diagnosis.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// --- Activity Timeline ---
export function ActivityTimelineWidget({ reports = [] }: { reports?: any[] }) {
  // Sort reports by date descending and take top 4
  const sortedReports = [...reports].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 4)

  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur h-full">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
        <Clock size={16} className="text-butter" />
        Activity Timeline
      </div>
      
      {sortedReports.length > 0 ? (
        <div className="relative pl-4 pt-2">
          <div className="absolute bottom-0 left-[23px] top-4 w-px bg-white/10" />
          <div className="flex flex-col gap-6">
            {sortedReports.map((ev, i) => {
              const time = new Date(ev.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              const colors = ['bg-blue-400', 'bg-blush-400', 'bg-purple-400', 'bg-emerald-400']
              return (
                <div key={i} className="relative pl-6">
                  <div className={`absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-forest-950 ${colors[i % colors.length]}`} />
                  <p className="text-xs text-white/50 mb-1">{time}</p>
                  <p className="text-sm font-semibold text-white/80">{ev.crop_name} scanned</p>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-center py-6 opacity-50">
          <Clock className="mb-2" size={24} />
          <p className="text-sm">No recent activity.</p>
        </div>
      )}
    </div>
  )
}

// --- Farm Calendar ---
export function FarmCalendarWidget() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
      <div className="mb-4 flex items-center justify-between text-sm font-semibold text-white/50 uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-blush-400" />
          Farm Calendar
        </div>
        <span className="text-xs text-white/40">Today</span>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 rounded-xl bg-blue-500/10 border border-blue-500/20 p-3">
          <div className="w-1 h-8 rounded bg-blue-400" />
          <div>
            <p className="text-xs font-semibold text-blue-300 uppercase">Watering</p>
            <p className="text-sm text-white/80">Irrigate Field A & B</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 rounded-xl bg-purple-500/10 border border-purple-500/20 p-3">
          <div className="w-1 h-8 rounded bg-purple-400" />
          <div>
            <p className="text-xs font-semibold text-purple-300 uppercase">Spray</p>
            <p className="text-sm text-white/80">Fungicide application</p>
          </div>
        </div>
      </div>
    </div>
  )
}
