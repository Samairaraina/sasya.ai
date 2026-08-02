const MODEL = 'gemini-2.5-flash'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

export function hasGeminiKey(): boolean {
  return Boolean(import.meta.env.VITE_GEMINI_API_KEY)
}

async function request(body: Record<string, unknown>): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': import.meta.env.VITE_GEMINI_API_KEY as string,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text().catch(() => '')
    throw new Error(`Gemini API ${res.status}: ${err.slice(0, 200)}`)
  }
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('')
  if (!text) throw new Error('Gemini returned an empty response')
  return text
}

export async function geminiChat(messages: { role: 'user' | 'model'; text: string }[]): Promise<string> {
  const system =
    'You are Sasya AI, a friendly farming assistant for Indian farmers. Answer in simple, practical language. ' +
    'Use clear advice on crops, weather, disease, fertilizers, and market prices. Keep answers under 120 words unless asked for detail.'
  const contents = [
    { role: 'user', parts: [{ text: system }] },
    ...messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
  ]
  return request({ contents })
}

export async function geminiVision(imageDataUrl: string, prompt: string): Promise<string> {
  const mimeType = imageDataUrl.match(/^data:([^;]+);/)?.[1] ?? 'image/jpeg'
  const base64 = imageDataUrl.split(',')[1] ?? ''
  return request({
    contents: [
      {
        parts: [
          { inlineData: { mimeType, data: base64 } },
          { text: prompt },
        ],
      },
    ],
  })
}

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
