import { Sparkles, Sprout, Droplets, ArrowRight } from 'lucide-react'

export function AIRecommendationsWidget() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-blush-500/20 bg-gradient-to-br from-blush-500/10 to-transparent p-6 backdrop-blur">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blush-400 uppercase tracking-wider">
        <Sparkles size={16} />
        Today's AI Advice
      </div>
      
      <ul className="flex flex-col gap-3 flex-1 text-sm text-white/80">
        <li className="flex items-start gap-2">
          <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blush-400 shrink-0" />
          <p>Spray fungicide tomorrow morning. Rain expected in 2 days.</p>
        </li>
        <li className="flex items-start gap-2">
          <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blush-400 shrink-0" />
          <p>Nitrogen levels appear low. Inspect Field #3.</p>
        </li>
        <li className="flex items-start gap-2">
          <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blush-400 shrink-0" />
          <p>Recommended irrigation: 6 PM today.</p>
        </li>
      </ul>
    </div>
  )
}

export function YieldPredictionWidget() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur relative">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />
      
      <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
        <Sprout size={16} className="text-emerald-400" />
        Yield Prediction
      </div>
      
      <div className="flex items-end justify-between mb-2">
        <div>
          <p className="text-xs text-white/50 mb-1">Expected Harvest (Rice)</p>
          <p className="stat-font text-3xl font-bold text-white">4.2 <span className="text-lg text-white/40">Tons</span></p>
        </div>
        <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-300">
          92% Confidence
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">Estimated Revenue</span>
          <span className="font-semibold text-emerald-400">₹2.4L</span>
        </div>
      </div>
    </div>
  )
}

export function IrrigationTrackerWidget() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
      <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
        <Droplets size={16} className="text-blue-400" />
        Irrigation Tracker
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-[10px] uppercase text-white/50 mb-1">Today's Usage</p>
          <p className="font-bold text-xl text-white">420<span className="text-xs text-white/40 ml-1">L</span></p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-white/50 mb-1">Monthly Usage</p>
          <p className="font-bold text-xl text-white">12.3k<span className="text-xs text-white/40 ml-1">L</span></p>
        </div>
      </div>
      
      <div className="mt-auto flex items-center justify-between rounded-xl bg-blue-500/10 p-3 border border-blue-500/20">
        <span className="text-sm text-blue-200">Next Irrigation</span>
        <span className="font-bold text-blue-400">6:00 PM</span>
      </div>
    </div>
  )
}

export function AIChatWidget() {
  return (
    <div className="flex items-center justify-between overflow-hidden rounded-[20px] border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-transparent p-6 backdrop-blur">
      <div>
        <h3 className="font-display font-bold text-white text-lg">Need farming advice?</h3>
        <p className="text-sm text-white/60 mt-1">Ask Sasya AI for personalized solutions.</p>
      </div>
      <button className="flex items-center gap-2 rounded-xl bg-purple-500 hover:bg-purple-600 transition-colors px-4 py-2 text-sm font-bold text-white shadow-lg">
        Ask Now <ArrowRight size={14} />
      </button>
    </div>
  )
}
