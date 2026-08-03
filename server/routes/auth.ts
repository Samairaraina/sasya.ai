import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../../lib/prisma'
import { requireAuth } from '../middleware/auth'
import {
  clearSessionCookie,
  createSession,
  SESSION_COOKIE,
  setSessionCookie,
} from '../lib/session'

const router = Router()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function publicUser(user: { id: string; email: string; name: string | null }) {
  return { id: user.id, email: user.email, name: user.name }
}

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body ?? {}
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return res.status(400).json({ error: 'Enter a valid email address.' })
  }
  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' })
  }
  const normalizedEmail = email.trim().toLowerCase()
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' })
  }
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      password: passwordHash,
      name: typeof name === 'string' && name.trim() ? name.trim() : null,
      farms: { create: { name: 'My Farm' } },
    },
  })
  const session = await createSession(user.id)
  setSessionCookie(res, session.token)
  res.status(201).json({ user: publicUser(user) })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {}
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password are required.' })
  }
  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Incorrect email or password.' })
  }
  const session = await createSession(user.id)
  setSessionCookie(res, session.token)
  res.json({ user: publicUser(user) })
})

router.post('/logout', async (req, res) => {
  const token = req.cookies?.[SESSION_COOKIE] as string | undefined
  if (token) {
    await prisma.session.deleteMany({ where: { token } }).catch(() => {})
  }
  clearSessionCookie(res)
  res.status(204).end()
})

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user })
})

export default router
