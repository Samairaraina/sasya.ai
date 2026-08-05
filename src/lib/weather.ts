export const WEATHER_KEY = import.meta.env.VITE_WEATHER_API_KEY as string
export const OPENAI_KEY  = import.meta.env.VITE_OPENAI_API_KEY as string
export const OWM         = 'https://api.openweathermap.org/data/2.5'

export interface CurrentWeather {
  city: string
  country: string
  temp: number
  feelsLike: number
  hi: number
  lo: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
  uvIndex: number
  pressure: number
  visibility: number
}

export interface ForecastDay {
  day: string
  iconCode: string
  hi: number
  lo: number
  rain: number
  description: string
}

export async function fetchCurrent(lat: number, lon: number): Promise<CurrentWeather> {
  const res = await fetch(
    `${OWM}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric`,
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(`OWM ${res.status}: ${err.message ?? res.statusText}`)
  }
  const d = await res.json()
  return {
    city: d.name,
    country: d.sys.country,
    temp: Math.round(d.main.temp),
    feelsLike: Math.round(d.main.feels_like),
    hi: Math.round(d.main.temp_max),
    lo: Math.round(d.main.temp_min),
    description: d.weather[0].description,
    icon: d.weather[0].icon,
    humidity: d.main.humidity,
    windSpeed: Math.round(d.wind.speed * 3.6),
    uvIndex: 0,
    pressure: d.main.pressure,
    visibility: Math.round((d.visibility ?? 10000) / 1000),
  }
}

export async function fetchForecast(lat: number, lon: number): Promise<ForecastDay[]> {
  const res = await fetch(
    `${OWM}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric&cnt=40`,
  )
  if (!res.ok) throw new Error('Forecast fetch failed')
  const d = await res.json()

  const days: Record<string, { temps: number[]; rain: number; icon: string; desc: string }> = {}
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  for (const item of d.list) {
    const date = new Date(item.dt * 1000)
    const key  = date.toDateString()
    if (!days[key]) {
      days[key] = { temps: [], rain: 0, icon: item.weather[0].icon, desc: item.weather[0].description }
    }
    days[key].temps.push(item.main.temp)
    days[key].rain = Math.max(days[key].rain, (item.pop ?? 0) * 100)
  }

  return Object.entries(days)
    .slice(0, 7)
    .map(([key, v]) => ({
      day: dayNames[new Date(key).getDay()],
      iconCode: v.icon,
      hi: Math.round(Math.max(...v.temps)),
      lo: Math.round(Math.min(...v.temps)),
      rain: Math.round(v.rain),
      description: v.desc,
    }))
}

export async function generateAIAdvice(weather: CurrentWeather, forecast: ForecastDay[]): Promise<string> {
  if (!OPENAI_KEY) return 'Add VITE_OPENAI_API_KEY to get AI farming advice.'

  const prompt = `You are an expert agronomist advising Indian farmers.
Current weather in ${weather.city}: ${weather.temp}°C, ${weather.description}, humidity ${weather.humidity}%, wind ${weather.windSpeed} km/h.
7-day forecast: ${forecast.map(f => `${f.day}: ${f.hi}°/${f.lo}°, rain ${f.rain}%`).join(' | ')}

Give 2-3 sentences of practical farming advice covering: best day to sow/spray, irrigation timing, and any disease risk warnings based on humidity/rain. Be specific and concise. No bullet points.`

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 150,
      }),
    })
    const json = await res.json()
    return json.choices?.[0]?.message?.content ?? 'Unable to generate advice.'
  } catch {
    return 'AI advice unavailable right now.'
  }
}

export function getBestSprayWindow(forecast: ForecastDay[]): string {
  const good = forecast.find(f => f.rain < 20 && f.hi < 35)
  return good ? `${good.day} · 6–9 AM` : 'Check forecast'
}
