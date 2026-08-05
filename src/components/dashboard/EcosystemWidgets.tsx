import { TrendingUp, TrendingDown, Landmark, Bell, Map } from 'lucide-react'

// --- Market Prices ---
const marketPrices = [
  { crop: 'Rice', price: '₹2350', trend: 'up', change: '+₹15' },
  { crop: 'Wheat', price: '₹2120', trend: 'down', change: '-₹8' },
  { crop: 'Maize', price: '₹1820', trend: 'up', change: '+₹25' },
  { crop: 'Cotton', price: '₹7200', trend: 'up', change: '+₹110' },
]

export function MarketPricesWidget() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
        <TrendingUp size={16} className="text-orange-400" />
        Market Prices
      </div>
      
      <div className="flex flex-col gap-3">
        {marketPrices.map((item, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl bg-white/[0.02] p-3 border border-white/5">
            <span className="text-sm font-semibold text-white/90">{item.crop}</span>
            <div className="flex items-center gap-3">
              <span className="font-bold text-white">{item.price}</span>
              {item.trend === 'up' ? (
                <div className="flex items-center gap-1 text-emerald-400">
                  <TrendingUp size={14} />
                  <span className="text-[10px] font-bold">{item.change}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-400">
                  <TrendingDown size={14} />
                  <span className="text-[10px] font-bold">{item.change}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- Government Schemes ---
const schemes = [
  { name: 'PM-Kisan', status: 'Open', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  { name: 'Crop Insurance', status: 'Closing in 4 days', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
  { name: 'Solar Pump Subsidy', status: 'New', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
]

export function SchemesWidget() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
        <Landmark size={16} className="text-blue-400" />
        Eligible Schemes
      </div>
      
      <div className="flex flex-col gap-3">
        {schemes.map((s, i) => (
          <div key={i} className="flex flex-col gap-1 border-b border-white/5 pb-3 last:border-0 last:pb-0">
            <p className="text-sm font-semibold text-white/90">{s.name}</p>
            <div className="flex">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${s.color}`}>
                {s.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- Smart Notifications ---
const notifications = [
  { text: 'Heavy rain expected tomorrow.', type: 'alert' },
  { text: 'Disease detected in Rice.', type: 'warning' },
  { text: 'Government subsidy available.', type: 'info' },
  { text: 'Expense limit exceeded.', type: 'error' },
]

export function SmartNotificationsWidget() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
        <Bell size={16} className="text-blush-400" />
        Notifications
      </div>
      
      <div className="flex flex-col gap-3">
        {notifications.map((n, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${
              n.type === 'alert' ? 'bg-blue-400' :
              n.type === 'warning' ? 'bg-orange-400' :
              n.type === 'error' ? 'bg-red-400' : 'bg-emerald-400'
            }`} />
            <p className="text-xs text-white/80">{n.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- Farm Map Placeholder ---
export function FarmMapWidget() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur relative">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
        <Map size={16} className="text-emerald-400" />
        Farm Map
      </div>
      
      <div className="relative h-[150px] w-full rounded-xl bg-forest-950/50 border border-white/5 overflow-hidden p-2 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center p-2 text-center">
          <div><p className="text-xs font-bold text-emerald-400">Field A</p><p className="text-[10px] text-emerald-400/60">Healthy</p></div>
        </div>
        <div className="rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center p-2 text-center">
          <div><p className="text-xs font-bold text-amber-400">Field B</p><p className="text-[10px] text-amber-400/60">Needs Water</p></div>
        </div>
        <div className="col-span-2 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center p-2 text-center">
          <div><p className="text-xs font-bold text-red-400">Field C</p><p className="text-[10px] text-red-400/60">Disease Risk</p></div>
        </div>
      </div>
    </div>
  )
}
