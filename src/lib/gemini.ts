// AI service — uses Google Gemini 1.5 Flash for vision (disease detection), chat, and insights.
// Keeps the same exported function signatures so no other file needs changing.

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY as string
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`

export function hasGeminiKey(): boolean {
  return Boolean(GEMINI_KEY)
}

// ─── Text chat ────────────────────────────────────────────────────────
export async function geminiChat(
  messages: { role: 'user' | 'model'; text: string }[],
): Promise<string> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      })),
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini chat error ${res.status}: ${err}`)
  }

  const json = await res.json()
  return json.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

// ─── Vision / Disease Detection ───────────────────────────────────────
export async function geminiVision(imageDataUrl: string, prompt: string): Promise<string> {
  // imageDataUrl is usually "data:image/jpeg;base64,....."
  // Extract mime_type and base64 string
  let mimeType = 'image/jpeg'
  let base64Data = imageDataUrl

  if (imageDataUrl.startsWith('data:')) {
    const parts = imageDataUrl.split(',')
    if (parts.length === 2) {
      mimeType = parts[0].replace('data:', '').split(';')[0]
      base64Data = parts[1]
    }
  }

  // Gemini vision does not support SVG. If we receive SVG (like the DEMO_LEAF), we will just send the text prompt 
  // or throw an error. But actually DEMO_LEAF isn't base64, it's URL encoded!
  // Wait, the UI only calls start() with DEMO_LEAF if we use the camera button. We fixed that earlier to trigger `!dataUrl` internally. 
  // Let's ensure SVG is stripped or rejected gracefully if it somehow gets here.
  if (mimeType.includes('svg')) {
    // If it's an SVG (like the fallback camera), just send a blank prompt or simulate failure to use demo data
    throw new Error("SVG format not supported by Gemini Vision API")
  }

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1, // Low = precise, consistent disease identification
        maxOutputTokens: 2048,
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini vision error ${res.status}: ${err}`)
  }

  const json = await res.json()
  return json.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

// ─── JSON extractor ───────────────────────────────────────────────────
export function extractJson<T>(text: string): T | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  const candidate = fenced ? fenced[1] : text
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  try {
    return JSON.parse(candidate.slice(start, end + 1)) as T
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
Return ONLY valid JSON wrapped in a codeblock matching this interface exactly. Do not include markdown formatting outside the codeblock.
\`\`\`json
{
  "advice": ["...", "...", "..."],
  "yield": { "amount": "...", "confidence": 90, "revenue": "..." },
  "soil": { "moisture": "...", "temp": "...", "nitrogen": "...", "phosphorus": "...", "potassium": "...", "ph": "..." }
}
\`\`\`
`

  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.5,
          responseMimeType: 'application/json',
        },
      }),
    })

    if (!res.ok) throw new Error('API Error')
    const json = await res.json()
    const content = json.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    return extractJson(content) || JSON.parse(content) // fallback to direct parse if response_mime_type worked well
  } catch (err) {
    console.error('Insight generation failed:', err)
    return null
  }
}

