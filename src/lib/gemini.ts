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
