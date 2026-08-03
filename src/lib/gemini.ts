import { apiPost } from './api'

export function hasGeminiKey(): boolean {
  return true
}

export async function geminiChat(messages: { role: 'user' | 'model'; text: string }[]): Promise<string> {
  const data = await apiPost<{ text: string }>('/api/ai/chat', { messages })
  return data.text
}

export async function geminiVision(imageDataUrl: string, prompt: string): Promise<string> {
  const data = await apiPost<{ text: string }>('/api/ai/vision', { image: imageDataUrl, prompt })
  return data.text
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
