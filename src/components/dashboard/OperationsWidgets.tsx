import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Clock, Calendar, Leaf, Scan } from 'lucide-react'

// --- Crop Progress ---
const crops = [
  { name: 'Rice', stage: 'Flowering', progress: 82 },
  { name: 'Cotton', stage: 'Growing', progress: 60 },
]

export function CropProgressWidget() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
        <Leaf size={16} className="text-emerald-400" />
        Crop Progress
      </div>
      
      <div className="flex flex-col gap-5">
        {crops.map(crop => (
          <div key={crop.name}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white">{crop.name}</span>
              <span className="text-sm font-semibold text-emerald-400">{crop.progress}%</span>
            </div>
            <p className="text-xs text-white/50 mb-2 uppercase tracking-wide">{crop.stage}</p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${crop.progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-emerald-400"
              />
            </div>
          </div>
        ))}
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
const timelineEvents = [
  { time: '10:20 AM', title: 'Rice scanned', color: 'bg-blue-400' },
  { time: '11:15 AM', title: 'Expense added', color: 'bg-blush-400' },
  { time: '12:00 PM', title: 'AI Recommendation generated', color: 'bg-purple-400' },
  { time: '2:30 PM', title: 'Weather updated', color: 'bg-emerald-400' },
]

export function ActivityTimelineWidget() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
        <Clock size={16} className="text-butter" />
        Activity Timeline
      </div>
      
      <div className="relative pl-4 pt-2">
        <div className="absolute bottom-0 left-[23px] top-4 w-px bg-white/10" />
        <div className="flex flex-col gap-6">
          {timelineEvents.map((ev, i) => (
            <div key={i} className="relative pl-6">
              <div className={`absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-forest-950 ${ev.color}`} />
              <p className="text-xs text-white/50 mb-1">{ev.time}</p>
              <p className="text-sm font-semibold text-white/80">{ev.title}</p>
            </div>
          ))}
        </div>
      </div>
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
