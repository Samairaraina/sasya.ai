// Calls Gemini REST API directly — no npm package needed, works on any host.

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string
const BASE = 'https://generativelanguage.googleapis.com/v1beta/models'
const MODEL = 'gemini-2.0-flash'

export function hasGeminiKey(): boolean {
  return Boolean(API_KEY)
}

// ─── Text chat ───────────────────────────────────────────────────────────────
export async function geminiChat(
  messages: { role: 'user' | 'model'; text: string }[],
): Promise<string> {
  const contents = messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }))

  const res = await fetch(`${BASE}/${MODEL}:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents }),
  })

  if (!res.ok) throw new Error(`Gemini chat error ${res.status}: ${await res.text()}`)
  const json = await res.json()
  return json.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

// ─── Vision / Disease Detection ───────────────────────────────────────────────
export async function geminiVision(imageDataUrl: string, prompt: string): Promise<string> {
  // Split data URL into mime type and base64 payload
  const [header, base64Data] = imageDataUrl.split(',')
  const mimeType = header.match(/data:([^;]+)/)?.[1] ?? 'image/jpeg'

  const body = {
    contents: [
      {
        parts: [
          { text: prompt },
          { inline_data: { mime_type: mimeType, data: base64Data } },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,   // Low = more factual, consistent disease identification
      topP: 0.8,
      maxOutputTokens: 2048,
    },
  }

  const res = await fetch(`${BASE}/${MODEL}:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) throw new Error(`Gemini vision error ${res.status}: ${await res.text()}`)
  const json = await res.json()
  return json.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
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
