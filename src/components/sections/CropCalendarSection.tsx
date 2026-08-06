import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarDays,
  CheckCircle2,
  CloudRain,
  Droplets,
  FlaskConical,
  Leaf,
  Loader2,
  Bug,
  Sprout,
  Sun,
  Bot
} from 'lucide-react'
import { EASE } from '../../lib/animations'

const CROPS = ['Tomato', 'Rice', 'Wheat', 'Cotton', 'Maize', 'Potato']
const REGIONS = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'Karnataka']
const SOILS = ['Loamy', 'Clay', 'Sandy', 'Black Soil', 'Red Soil']
const SEASONS = ['Kharif', 'Rabi', 'Zaid']

const TIMELINE_DATA = [
  { week: 1, title: 'Prepare Land & Compost', icon: Leaf, status: 'done', date: 'Oct 1', ai: 'Add 5 tons/acre organic compost. Conf: 99%' },
  { week: 2, title: 'Sow Seeds', icon: Sprout, status: 'done', date: 'Oct 8', ai: 'Sow at 2-3 cm depth. Conf: 95%' },
  { week: 3, title: 'First Irrigation', icon: Droplets, status: 'current', date: 'Oct 15', ai: 'Recommended: Every 3 days. Conf: 97%' },
  { week: 4, title: 'Nitrogen Fertilizer', icon: FlaskConical, status: 'pending', date: 'Oct 22', ai: 'Apply 20kg/acre Urea. Conf: 92%' },
  { week: 6, title: 'Pest Inspection', icon: Bug, status: 'pending', date: 'Nov 5', ai: 'Watch out for early blight. Conf: 88%' },
  { week: 8, title: 'Weed Management', icon: Leaf, status: 'pending', date: 'Nov 19', ai: 'Manual weeding recommended. Conf: 94%' },
  { week: 10, title: 'Flowering Stage', icon: Sun, status: 'pending', date: 'Dec 3', ai: 'Ensure soil moisture is optimal. Conf: 96%' },
  { week: 14, title: 'Harvest Ready', icon: CalendarDays, status: 'pending', date: 'Dec 31', ai: 'Harvest before upcoming rains. Conf: 91%' },
]

export function CropCalendarSection() {
  const [crop, setCrop] = useState(CROPS[0])
  const [region, setRegion] = useState(REGIONS[0])
  const [soil, setSoil] = useState(SOILS[0])
  const [season, setSeason] = useState(SEASONS[0])
  
  const [loadingStep, setLoadingStep] = useState(0) // 0: idle, 1, 2, 3: loading, 4: done
  const [showResults, setShowResults] = useState(false)

  const handleGenerate = () => {
    setLoadingStep(1)
    setShowResults(false)
    
    setTimeout(() => setLoadingStep(2), 800)
    setTimeout(() => setLoadingStep(3), 1600)
    setTimeout(() => {
      setLoadingStep(4)
      setShowResults(true)
    }, 2400)
  }

  return (
    <section className="relative py-24 bg-forest-950 min-h-screen overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: FORM */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex flex-col rounded-[24px] border border-white/10 bg-white/[0.02] p-8 backdrop-blur shadow-2xl"
            >
              <h2 className="font-display text-2xl font-bold text-white mb-2">Build Your Schedule</h2>
              <p className="text-white/50 text-sm mb-8">Select your parameters to generate a personalized AI farming timeline.</p>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">Crop</label>
                  <select 
                    value={crop} onChange={(e) => setCrop(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/50 transition-all hover:bg-white/[0.03]"
                  >
                    {CROPS.map(c => <option key={c} value={c} className="bg-forest-900">{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">Region</label>
                  <select 
                    value={region} onChange={(e) => setRegion(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/50 transition-all hover:bg-white/[0.03]"
                  >
                    {REGIONS.map(r => <option key={r} value={r} className="bg-forest-900">{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">Soil Type</label>
                  <select 
                    value={soil} onChange={(e) => setSoil(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/50 transition-all hover:bg-white/[0.03]"
                  >
                    {SOILS.map(s => <option key={s} value={s} className="bg-forest-900">{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">Season</label>
                  <select 
                    value={season} onChange={(e) => setSeason(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/50 transition-all hover:bg-white/[0.03]"
                  >
                    {SEASONS.map(s => <option key={s} value={s} className="bg-forest-900">{s}</option>)}
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loadingStep > 0 && loadingStep < 4}
                className="mt-8 group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-4 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] disabled:opacity-80 disabled:pointer-events-none"
              >
                {loadingStep > 0 && loadingStep < 4 ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {loadingStep === 1 && "Analyzing crop..."}
                    {loadingStep === 2 && "Checking regional weather..."}
                    {loadingStep === 3 && "Generating personalized schedule..."}
                  </>
                ) : (
                  <>
                    <Bot size={18} />
                    Generate AI Calendar
                  </>
                )}
              </button>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: TIMELINE */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!showResults ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex h-full flex-col items-center justify-center text-center rounded-[24px] border border-white/10 bg-white/[0.01] p-16 border-dashed"
                >
                   <CalendarDays size={48} className="text-white/20 mb-4" />
                   <p className="text-white/50">Your AI-generated calendar will appear here.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="relative rounded-[24px] border border-emerald-500/20 bg-emerald-950/20 p-6 md:p-8 backdrop-blur"
                >
                  {/* Floating Weather Card */}
                  <div className="absolute -top-6 -right-2 md:-right-6 flex flex-col gap-1 rounded-2xl border border-white/10 bg-black/60 p-4 shadow-xl backdrop-blur-md animate-float">
                    <div className="flex items-center gap-3">
                      <Sun size={24} className="text-butter" />
                      <div>
                        <p className="text-sm font-bold text-white">32°C</p>
                        <p className="text-[10px] text-white/60 uppercase">Humidity 64%</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 rounded bg-blue-500/20 px-2 py-1">
                      <CloudRain size={12} className="text-blue-400" />
                      <span className="text-[10px] font-semibold text-blue-300">Rain in 3 days</span>
                    </div>
                  </div>

                  <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-white mb-6">
                    <Sprout className="text-emerald-400" /> Personalized Crop Plan
                  </h2>

                  {/* Progress Bar */}
                  <div className="mb-10">
                    <div className="flex justify-between text-xs font-semibold text-white/50 mb-2">
                      <span>Progress</span>
                      <span className="text-emerald-400">Week 3 of 14</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '25%' }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" 
                      />
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="relative border-l-2 border-white/10 pl-6 space-y-8">
                    {TIMELINE_DATA.map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 + (i * 0.1) }}
                        className="group relative"
                      >
                        {/* Timeline Node */}
                        <div className={`absolute -left-[35px] flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                          item.status === 'done' ? 'bg-emerald-500 border-emerald-500' :
                          item.status === 'current' ? 'bg-forest-950 border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' :
                          'bg-forest-950 border-white/20'
                        }`}>
                          {item.status === 'current' && <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                        </div>

                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-xs font-bold text-white/40 uppercase w-14">Week {item.week}</span>
                              <h4 className={`font-semibold ${item.status === 'current' ? 'text-emerald-400 text-lg' : 'text-white'}`}>
                                {item.title}
                              </h4>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <item.icon size={14} className="text-white/40" />
                              <span className="text-sm font-medium text-white/80 bg-white/5 rounded px-2 py-0.5">{item.date}</span>
                            </div>
                          </div>
                          
                          <div className="flex-1 md:max-w-[220px] rounded-xl border border-white/5 bg-black/20 p-3 transition-colors group-hover:bg-white/[0.03]">
                            <p className="text-xs text-white/70 leading-relaxed">
                              {item.ai}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* AI Insight Card */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="mt-12 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 flex gap-4"
                  >
                    <div className="shrink-0 mt-0.5">
                      <Bot size={20} className="text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-400 mb-1">AI Recommendation</h4>
                      <p className="text-sm text-emerald-100/80 leading-relaxed">
                        Based on your selected crop, local weather, soil conditions and season, irrigation should be delayed by one day due to expected rainfall.
                      </p>
                    </div>
                  </motion.div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}
