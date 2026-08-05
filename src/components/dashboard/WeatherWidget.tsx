import { useEffect, useState } from 'react'
import { CloudSun, Droplets, Wind, Sun, Sunrise, Sunset, ThermometerSun } from 'lucide-react'
import { fetchCurrent, CurrentWeather, fetchForecast, ForecastDay, getBestSprayWindow } from '../../lib/weather'

export function WeatherWidget() {
  const [weather, setWeather] = useState<CurrentWeather | null>(null)
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const lat = 20.0059
        const lon = 73.7997
        const [cur, fore] = await Promise.all([
          fetchCurrent(lat, lon),
          fetchForecast(lat, lon)
        ])
        setWeather(cur)
        setForecast(fore)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return <div className="animate-pulse h-[300px] rounded-[20px] bg-white/5"></div>
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-forest-900 p-6 lg:row-span-2">
      <div className="mb-4 flex items-center justify-between text-sm font-semibold text-white/50 uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <CloudSun size={16} className="text-butter" />
          7-Day Weather
        </div>
      </div>
      
      {weather ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="stat-font text-5xl font-bold">{weather.temp}°</p>
              <p className="text-sm text-white/60 capitalize mt-1">{weather.description}</p>
            </div>
            <img src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`} alt="icon" className="w-20 h-20 drop-shadow-lg" />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="rounded-xl bg-white/5 p-3 flex items-center gap-3">
              <Droplets size={16} className="text-blue-400" />
              <div><p className="text-[10px] text-white/50 uppercase">Humidity</p><p className="font-semibold text-sm">{weather.humidity}%</p></div>
            </div>
            <div className="rounded-xl bg-white/5 p-3 flex items-center gap-3">
              <Wind size={16} className="text-emerald-400" />
              <div><p className="text-[10px] text-white/50 uppercase">Wind</p><p className="font-semibold text-sm">{weather.windSpeed} km/h</p></div>
            </div>
            <div className="rounded-xl bg-white/5 p-3 flex items-center gap-3">
              <Sun size={16} className="text-amber-400" />
              <div><p className="text-[10px] text-white/50 uppercase">UV Index</p><p className="font-semibold text-sm">Moderate (4)</p></div>
            </div>
            <div className="rounded-xl bg-white/5 p-3 flex items-center gap-3">
              <ThermometerSun size={16} className="text-orange-400" />
              <div><p className="text-[10px] text-white/50 uppercase">Soil Temp</p><p className="font-semibold text-sm">24°C</p></div>
            </div>
            <div className="rounded-xl bg-white/5 p-3 flex items-center gap-3">
              <Sunrise size={16} className="text-blush-400" />
              <div><p className="text-[10px] text-white/50 uppercase">Sunrise</p><p className="font-semibold text-sm">6:12 AM</p></div>
            </div>
            <div className="rounded-xl bg-white/5 p-3 flex items-center gap-3">
              <Sunset size={16} className="text-purple-400" />
              <div><p className="text-[10px] text-white/50 uppercase">Sunset</p><p className="font-semibold text-sm">6:45 PM</p></div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            {forecast.slice(0, 4).map((d, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-white/[0.02] px-4 py-2 hover:bg-white/[0.05] transition-colors">
                <span className="w-10 text-sm text-white/70">{d.day}</span>
                <img src={`https://openweathermap.org/img/wn/${d.iconCode}.png`} className="w-8 h-8" />
                <span className="text-xs text-blue-300 w-12 text-right">{d.rain}% 🌧</span>
                <span className="text-sm font-semibold w-16 text-right">{d.hi}° <span className="text-white/40">{d.lo}°</span></span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-white/40 text-sm">Data unavailable</div>
      )}
    </div>
  )
}
