import { Router } from 'express'
import { geminiChat, geminiVision } from '../lib/gemini'

const router = Router()

router.post('/chat', async (req, res) => {
  const { messages } = req.body ?? {}
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages must be an array.' })
  }
  const clean = messages
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'model') &&
        typeof m.text === 'string' &&
        m.text.trim(),
    )
    .slice(-10)
  if (!clean.length) {
    return res.status(400).json({ error: 'No messages to send.' })
  }
  const text = await geminiChat(clean)
  res.json({ text })
})

router.post('/vision', async (req, res) => {
  const { image, prompt } = req.body ?? {}
  if (typeof image !== 'string' || !image) {
    return res.status(400).json({ error: 'image is required.' })
  }
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'prompt is required.' })
  }
  const text = await geminiVision(image, prompt)
  res.json({ text })
})

export default router
