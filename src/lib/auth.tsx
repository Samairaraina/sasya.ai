import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'
import { apiGet, apiPost } from './api'

export type AuthUser = { id: string; email: string; name: string | null }

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, name?: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    apiGet<{ user: AuthUser | null }>('/api/auth/me')
      .then((data) => {
        if (!cancelled) setUser(data.user)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function signIn(email: string, password: string) {
    try {
      const data = await apiPost<{ user: AuthUser }>('/api/auth/login', { email, password })
      setUser(data.user)
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Sign in failed.' }
    }
  }

  async function signUp(email: string, password: string, name?: string) {
    try {
      const data = await apiPost<{ user: AuthUser }>('/api/auth/register', { email, password, name })
      setUser(data.user)
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Sign up failed.' }
    }
  }

  async function signOut() {
    try {
      await apiPost<void>('/api/auth/logout')
    } catch {
      // session may already be gone
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
