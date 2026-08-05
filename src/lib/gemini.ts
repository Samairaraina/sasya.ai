// AI service — uses OpenAI GPT-4o for vision (disease detection) and chat.
// Keeps the same exported function signatures so no other file needs changing.

const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY as string
const BASE = 'https://api.openai.com/v1/chat/completions'

export function hasGeminiKey(): boolean {
  // Returns true if OpenAI key is set (name kept for backwards compatibility)
  return Boolean(OPENAI_KEY)
}

// ─── Text chat (GPT-4o-mini — fast and cheap) ────────────────────────────────
export async function geminiChat(
  messages: { role: 'user' | 'model'; text: string }[],
): Promise<string> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
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
    throw new Error(`OpenAI chat error ${res.status}: ${err}`)
  }

  const json = await res.json()
  return json.choices?.[0]?.message?.content ?? ''
}

// ─── Vision / Disease Detection (GPT-4o — best multimodal model) ─────────────
export async function geminiVision(imageDataUrl: string, prompt: string): Promise<string> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: imageDataUrl,
                detail: 'high', // Use high detail for accurate disease detection
              },
            },
          ],
        },
      ],
      temperature: 0.1,   // Low = precise, consistent disease identification
      max_tokens: 2048,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI vision error ${res.status}: ${err}`)
  }

  const json = await res.json()
  return json.choices?.[0]?.message?.content ?? ''
}

// ─── JSON extractor ───────────────────────────────────────────────────────────
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

// ─── Dashboard Insights Generator (GPT-4o-mini) ──────────────────────────────
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
    const res = await fetch(BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
      }),
    })

    if (!res.ok) throw new Error('API Error')
    const json = await res.json()
    const content = json.choices?.[0]?.message?.content ?? ''
    return extractJson(content)
  } catch (err) {
    console.error('Insight generation failed:', err)
    return null
  }
}
