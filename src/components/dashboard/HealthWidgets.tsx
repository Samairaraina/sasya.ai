import { Activity, Leaf, Droplets, Thermometer, FlaskConical } from 'lucide-react'

// Helper for circular progress
function CircularProgress({ percentage, color, label, sublabel }: { percentage: number, color: string, label: string, sublabel?: string }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center">
        <svg className="h-24 w-24 transform -rotate-90">
          <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
          <circle 
            cx="48" cy="48" r={radius} 
            stroke="currentColor" strokeWidth="6" fill="transparent" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            className={`transition-all duration-1000 ease-out ${color}`} 
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="stat-font text-xl font-bold text-white">{percentage}%</span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-white/80">{label}</p>
      {sublabel && <p className="text-xs text-white/40">{sublabel}</p>}
    </div>
  )
}

export function CropHealthWidget({ reports = [] }: { reports?: any[] }) {
  const healthyCount = reports.filter(r => (r.disease_name || '').toLowerCase() === 'healthy').length
  const criticalCount = reports.filter(r => (r.disease_name || '').toLowerCase() !== 'healthy' && (r.confidence || 0) >= 0.8).length
  const warningCount = reports.length - healthyCount - criticalCount

  const overallScore = reports.length === 0 ? 100 : Math.round((healthyCount / reports.length) * 100)

  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
          <Leaf size={16} className="text-emerald-400" />
          Crop Health
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <CircularProgress percentage={overallScore} color="text-emerald-400" label="Overall Score" />
        
        <div className="flex flex-col gap-4 w-1/2">
          <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-sm text-white/70">Healthy</span>
            </div>
            <span className="font-bold">{healthyCount}</span>
          </div>
          
          <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-sm text-white/70">Warning</span>
            </div>
            <span className="font-bold">{warningCount}</span>
          </div>
          
          <div className="flex items-center justify-between rounded-xl bg-white/[0.03] p-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-400" />
              <span className="text-sm text-white/70">Critical</span>
            </div>
            <span className="font-bold">{criticalCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricPill({ icon: Icon, label, value, statusColor }: { icon: any, label: string, value: string, statusColor: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg bg-white/5 p-2 ${statusColor}`}><Icon size={16} /></div>
        <span className="text-sm text-white/70">{label}</span>
      </div>
      <span className="font-bold text-white">{value}</span>
    </div>
  )
}

export function SoilHealthWidget({ soil }: { soil?: any }) {
  const getStatusColor = (val: string) => {
    if (!val) return 'text-white/50'
    const lower = val.toLowerCase()
    if (lower.includes('low') || lower.includes('poor')) return 'text-amber-400'
    if (lower.includes('critical')) return 'text-red-400'
    return 'text-emerald-400' // good/medium/high
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
          <Activity size={16} className="text-butter" />
          AI Soil Health Estimate
        </div>
      </div>
      
      {!soil ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 py-4">
          <Activity className="mb-2" size={24} />
          <p className="text-sm">Analyzing local conditions...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <MetricPill icon={Droplets} label="Moisture" value={soil.moisture} statusColor="text-blue-400" />
          <MetricPill icon={Thermometer} label="Temp" value={soil.temp} statusColor="text-orange-400" />
          <MetricPill icon={FlaskConical} label="Nitrogen" value={soil.nitrogen} statusColor={getStatusColor(soil.nitrogen)} />
          <MetricPill icon={FlaskConical} label="Phosphorus" value={soil.phosphorus} statusColor={getStatusColor(soil.phosphorus)} />
          <MetricPill icon={FlaskConical} label="Potassium" value={soil.potassium} statusColor={getStatusColor(soil.potassium)} />
          <MetricPill icon={FlaskConical} label="pH Level" value={soil.ph} statusColor="text-emerald-400" />
        </div>
      )}
    </div>
  )
}
