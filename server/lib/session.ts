import { randomBytes } from 'node:crypto'
import type { Response } from 'express'
import { prisma } from '../../lib/prisma'

export const SESSION_COOKIE = 'sasya_session'
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30

export async function createSession(userId: string) {
  const token = randomBytes(32).toString('hex')
  return prisma.session.create({
    data: { token, userId, expiresAt: new Date(Date.now() + SESSION_TTL_MS) },
  })
}

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: SESSION_TTL_MS,
}

export function setSessionCookie(res: Response, token: string) {
  res.cookie(SESSION_COOKIE, token, cookieOptions)
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(SESSION_COOKIE, cookieOptions)
}
