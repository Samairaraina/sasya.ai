import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string

export function hasGeminiKey(): boolean {
  return Boolean(API_KEY)
}

function getClient() {
  if (!API_KEY) throw new Error('VITE_GEMINI_API_KEY is not set')
  return new GoogleGenerativeAI(API_KEY)
}

// ─── Text chat ───────────────────────────────────────────────────────────────
export async function geminiChat(
  messages: { role: 'user' | 'model'; text: string }[],
): Promise<string> {
  const genAI = getClient()
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }))
  const last = messages[messages.length - 1]
  const chat = model.startChat({ history })
  const result = await chat.sendMessage(last.text)
  return result.response.text()
}

// ─── Vision / Disease Detection ───────────────────────────────────────────────
export async function geminiVision(imageDataUrl: string, prompt: string): Promise<string> {
  const genAI = getClient()
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature: 0.1,   // Low temp = more factual, consistent
      topP: 0.8,
      maxOutputTokens: 2048,
    },
  })

  // Convert data URL to inline image part
  const [header, base64Data] = imageDataUrl.split(',')
  const mimeType = header.match(/data:([^;]+)/)?.[1] ?? 'image/jpeg'

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        mimeType,
        data: base64Data,
      },
    },
  ])

  return result.response.text()
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
