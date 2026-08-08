// AI service — migrated to use Groq API (OpenAI compatible)
// Keeps the same exported function signatures so no other file needs changing.

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY as string
const BASE_URL = `https://api.groq.com/openai/v1/chat/completions`

export function hasGeminiKey(): boolean {
  return Boolean(GROQ_KEY)
}

// ─── Text chat ────────────────────────────────────────────────────────
export async function geminiChat(
  messages: { role: 'user' | 'model'; text: string }[],
): Promise<string> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_KEY}` },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: messages.map((m) => ({
        role: m.role === 'model' ? 'assistant' : 'user',
        content: m.text,
      })),
      temperature: 0.7,
      max_tokens: 1024,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq chat error ${res.status}: ${err}`)
  }

  const json = await res.json()
  return json.choices?.[0]?.message?.content ?? ''
}

// ─── Vision / Disease Detection ───────────────────────────────────────
export async function geminiVision(imageDataUrl: string, prompt: string): Promise<string> {
  // imageDataUrl is usually "data:image/jpeg;base64,....."
  if (imageDataUrl.includes('image/svg')) {
    // If it's an SVG (like the fallback camera), just simulate failure to use demo data
    throw new Error("SVG format not supported by Groq Vision API")
  }

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_KEY}` },
    body: JSON.stringify({
      model: 'llama-3.2-11b-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { url: imageDataUrl }
            }
          ]
        }
      ],
      temperature: 0.1, // Low = precise, consistent disease identification
      max_tokens: 2048,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Groq vision error ${res.status}: ${err}`)
  }

  const json = await res.json()
  return json.choices?.[0]?.message?.content ?? ''
}

// ─── JSON extractor ───────────────────────────────────────────────────
export function extractJson<T>(text: string): T | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  const candidate = fenced ? fenced[1] : text
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  const arrStart = candidate.indexOf('[')
  const arrEnd = candidate.lastIndexOf(']')
  
  let jsonStr = candidate;
  if (start !== -1 && end !== -1 && end > start && (arrStart === -1 || start < arrStart)) {
    jsonStr = candidate.slice(start, end + 1)
  } else if (arrStart !== -1 && arrEnd !== -1 && arrEnd > arrStart) {
    jsonStr = candidate.slice(arrStart, arrEnd + 1)
  }

  try {
    return JSON.parse(jsonStr) as T
  } catch {
    return null
  }
}

// ─── Dashboard Insights Generator ─────────────────────────────────────
export async function generateDashboardInsights(
  weather: any,
  crops: any[],
  reports: any[]
): Promise<{
  advice: string[]
  yield: { amount: string; confidence: number; revenue: string }
  soil: { moisture: string; temp: string; nitrogen: string; phosphorus: string; potassium: string; ph: string }
} | null> {
  const prompt = `
You are an expert AI agronomist for Sasya AI. 
Generate a realistic, personalized farm dashboard estimate based on the following user data.
Since we don't have IoT soil sensors or satellite yield imagery, you MUST estimate plausible, scientifically sound values based on the weather, their active crops, and their recent disease history.

DATA:
Weather: ${JSON.stringify(weather)}
Active Crops: ${JSON.stringify(crops)}
Recent Disease Scans: ${JSON.stringify(reports)}

REQUIREMENTS:
1. advice: An array of 3 actionable, short bullet points (e.g., "Spray fungicide for Leaf Blight", "Irrigate field tomorrow").
2. yield: An estimate for their primary crop. { amount: string (e.g., "4.2 Tons"), confidence: number (0-100), revenue: string (e.g., "₹2.4L") }
3. soil: Plausible soil health metrics. { moisture: string (e.g., "68%"), temp: string (e.g., "28°C"), nitrogen: string (Low/Medium/Good), phosphorus: string (Low/Medium/Good), potassium: string (Low/Medium/Good), ph: string (e.g., "6.7") }

OUTPUT FORMAT:
Return ONLY valid JSON matching this interface exactly. Do not include markdown formatting.
{
  "advice": ["...", "...", "..."],
  "yield": { "amount": "...", "confidence": 90, "revenue": "..." },
  "soil": { "moisture": "...", "temp": "...", "nitrogen": "...", "phosphorus": "...", "potassium": "...", "ph": "..." }
}
`

  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        response_format: { type: 'json_object' }
      }),
    })

    if (!res.ok) throw new Error('API Error')
    const json = await res.json()
    const content = json.choices?.[0]?.message?.content ?? ''
    return extractJson(content) || JSON.parse(content) 
  } catch (err) {
    console.error('Insight generation failed:', err)
    return null
  }
}

// ─── Yield Prediction Generator ───────────────────────────────────────
export interface YieldPrediction {
  cropId: string;
  cropName: string;
  estimatedYieldRange: string;
  expectedHarvestDate: string;
  confidenceScore: number;
  marketPriceTrend: 'Up' | 'Stable' | 'Down';
  revenueEstimate: string;
  keyFactors: string[];
}

export async function generateYieldPredictions(
  crops: any[],
  farms: any[]
): Promise<YieldPrediction[]> {
  if (!crops || crops.length === 0) return [];

  const prompt = `
You are an expert agricultural AI. 
Generate a yield prediction forecast for the following crops.
For each crop, estimate realistic values based on typical Indian farming conditions.

DATA:
Farms: ${JSON.stringify(farms)}
Active Crops: ${JSON.stringify(crops)}

REQUIREMENTS:
Return a JSON array of objects wrapped in a "predictions" key, with each object strictly matching this interface:
{
  "cropId": "string (the exact id from the provided crop)",
  "cropName": "string",
  "estimatedYieldRange": "string (e.g., '4.2 - 4.8 Tons')",
  "expectedHarvestDate": "string (e.g., 'Mid-October 2026')",
  "confidenceScore": number (0-100),
  "marketPriceTrend": "Up" | "Stable" | "Down",
  "revenueEstimate": "string (e.g., '₹2.4L - ₹2.8L')",
  "keyFactors": ["string", "string", "string"] (3 actionable factors affecting the yield)
}

OUTPUT FORMAT:
Return ONLY valid JSON matching this format exactly, with no extra markdown.
{
  "predictions": [
    { ... }
  ]
}
`

  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        response_format: { type: 'json_object' }
      }),
    })

    if (!res.ok) throw new Error('API Error')
    const json = await res.json()
    const content = json.choices?.[0]?.message?.content ?? ''
    
    const parsed = extractJson<{predictions: YieldPrediction[]}>(content) || JSON.parse(content)
    return parsed.predictions || [];
  } catch (err) {
    console.error('Yield prediction generation failed:', err)
    return []
  }
}

