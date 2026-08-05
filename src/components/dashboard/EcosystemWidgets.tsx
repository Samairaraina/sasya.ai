import { TrendingUp, TrendingDown, Landmark, Bell, Map } from 'lucide-react'

// --- Market Prices ---

export function MarketPricesWidget({ prices = [] }: { prices?: any[] }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur h-full">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
        <TrendingUp size={16} className="text-orange-400" />
        Market Prices
      </div>
      
      {prices.length > 0 ? (
        <div className="flex flex-col gap-3">
          {prices.map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl bg-white/[0.02] p-3 border border-white/5">
              <span className="text-sm font-semibold text-white/90">{item.crop}</span>
              <div className="flex items-center gap-3">
                <span className="font-bold text-white">₹{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-center py-6 opacity-50">
          <TrendingUp className="mb-2" size={24} />
          <p className="text-sm">No market data available.</p>
        </div>
      )}
    </div>
  )
}

// --- Government Schemes ---

export function SchemesWidget({ schemes = [] }: { schemes?: any[] }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur h-full">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
        <Landmark size={16} className="text-blue-400" />
        Eligible Schemes
      </div>
      
      {schemes.length > 0 ? (
        <div className="flex flex-col gap-3">
          {schemes.map((s, i) => (
            <div key={i} className="flex flex-col gap-1 border-b border-white/5 pb-3 last:border-0 last:pb-0">
              <p className="text-sm font-semibold text-white/90">{s.title}</p>
              <div className="flex">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded border text-emerald-400 bg-emerald-400/10 border-emerald-400/20">
                  Open
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-center py-6 opacity-50">
          <Landmark className="mb-2" size={24} />
          <p className="text-sm">No relevant schemes found.</p>
        </div>
      )}
    </div>
  )
}

// --- Smart Notifications ---

export function SmartNotificationsWidget({ notifications = [] }: { notifications?: any[] }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur h-full">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
        <Bell size={16} className="text-blush-400" />
        Notifications
      </div>
      
      {notifications.length > 0 ? (
        <div className="flex flex-col gap-3">
          {notifications.map((n, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="mt-1 h-1.5 w-1.5 rounded-full shrink-0 bg-blue-400" />
              <p className="text-xs text-white/80">{n.title || n.message}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-center py-6 opacity-50">
          <Bell className="mb-2" size={24} />
          <p className="text-sm">You're all caught up!</p>
        </div>
      )}
    </div>
  )
}

// --- Farm Map Placeholder ---
export function FarmMapWidget({ farms = [] }: { farms?: any[] }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur relative">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
        <Map size={16} className="text-emerald-400" />
        Farm Map
      </div>
      
      {farms.length > 0 ? (
        <div className="relative h-[150px] w-full rounded-xl bg-forest-950/50 border border-white/5 overflow-hidden p-2 grid grid-cols-2 gap-2">
          {farms.map((farm, i) => (
            <div key={farm.id} className="rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center p-2 text-center">
              <div><p className="text-xs font-bold text-emerald-400">{farm.name}</p><p className="text-[10px] text-emerald-400/60">{farm.size_acres} Acres</p></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[150px] text-center opacity-50">
          <Map className="mb-2" size={24} />
          <p className="text-sm">No farms added yet.</p>
        </div>
      )}
    </div>
  )
}
