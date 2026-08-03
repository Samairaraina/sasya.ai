import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth'
import cropsRouter from './routes/crops'
import aiRouter from './routes/ai'
import { requireAuth } from './middleware/auth'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')

export const app = express()

app.use(express.json({ limit: '12mb' }))
app.use(cookieParser())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRouter)
app.use('/api/crops', requireAuth, cropsRouter)
app.use('/api/ai', requireAuth, aiRouter)

app.use(express.static(distDir))

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(distDir, 'index.html'), (err) => {
    if (err) next(err)
  })
})

app.use(
  (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const rawStatus =
      typeof err === 'object' && err !== null && 'status' in err
        ? Number((err as { status: unknown }).status)
        : 500
    const status = Number.isFinite(rawStatus) && rawStatus >= 400 && rawStatus < 600 ? rawStatus : 500
    const message = err instanceof Error ? err.message : 'Internal server error'
    console.error(err)
    res.status(status).json({ error: message })
  },
)
