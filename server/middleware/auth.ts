import type { NextFunction, Request, Response } from 'express'
import { prisma } from '../../lib/prisma'
import { SESSION_COOKIE } from '../lib/session'

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[SESSION_COOKIE] as string | undefined
  if (!token) {
    return res.status(401).json({ error: 'Not signed in.' })
  }
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: { select: { id: true, email: true, name: true } } },
  })
  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } }).catch(() => {})
    }
    return res.status(401).json({ error: 'Session expired. Please sign in again.' })
  }
  req.user = session.user
  next()
}
