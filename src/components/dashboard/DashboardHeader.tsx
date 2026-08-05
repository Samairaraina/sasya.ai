import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ScanLine, IndianRupee, ClipboardList, Sparkles, Landmark, TrendingUp, Sun, CheckCircle2, Edit2 } from 'lucide-react'

export function DashboardGreeting({ name, pendingTasks = 2, weatherSuitable = true }: { name: string, pendingTasks?: number, weatherSuitable?: boolean }) {
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-6 mb-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-white tracking-tight">
          Good Evening, {name} <span className="inline-block animate-wave">👋</span>
        </h1>
        <p className="mt-2 text-white/60">Here's today's farm overview. — {dateStr}</p>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-3 md:mt-0">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70">
          <CheckCircle2 size={14} className={pendingTasks > 0 ? "text-amber-400" : "text-emerald-400"} />
          {pendingTasks} tasks pending
        </div>
        {weatherSuitable && (
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300">
            <Sun size={14} /> Weather suitable for spraying
          </div>
        )}
      </div>
    </div>
  )
}

export function QuickActions() {
  const actions = [
    { icon: ScanLine, label: 'Scan Crop', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { icon: IndianRupee, label: 'Add Expense', color: 'text-blush-400', bg: 'bg-blush-400/10' },
    { icon: ClipboardList, label: 'Add Task', color: 'text-butter', bg: 'bg-butter/10' },
    { icon: Sparkles, label: 'Ask AI', color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { icon: Landmark, label: 'View Schemes', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { icon: TrendingUp, label: 'Market Prices', color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {actions.map((action, i) => (
        <motion.button
          key={action.label}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-col items-center justify-center gap-3 rounded-[20px] border border-white/10 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.05] hover:border-white/20"
        >
          <div className={`rounded-xl ${action.bg} p-3`}>
            <action.icon size={20} className={action.color} />
          </div>
          <span className="text-xs font-semibold text-white/80">{action.label}</span>
        </motion.button>
      ))}
    </div>
  )
}

export function FarmStatsBar({ 
  totalAcres, fields, activeCrops, tasksToday, aiScans 
}: { 
  totalAcres: number, fields: number, activeCrops: number, tasksToday: number, aiScans: number 
}) {
  const statItems = [
    { label: 'Total Acres', value: totalAcres },
    { label: 'Fields', value: fields },
    { label: 'Active Crops', value: activeCrops },
    { label: 'Tasks Today', value: tasksToday },
    { label: 'AI Scans', value: aiScans },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {statItems.map((stat) => (
        <div key={stat.label} className="group relative overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-5 backdrop-blur transition-colors hover:bg-white/[0.04]">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">{stat.label}</p>
          <div className="mt-2 flex items-center relative">
            <span className="stat-font text-3xl font-bold text-white bg-transparent outline-none w-full border-b border-transparent transition-colors">
              {stat.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
