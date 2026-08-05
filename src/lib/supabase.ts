import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          phone: string | null
          role: 'FARMER' | 'EXPERT' | 'ADMIN'
          language: string
          location: string | null
          profile_image: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          phone?: string | null
          role?: 'FARMER' | 'EXPERT' | 'ADMIN'
          language?: string
          location?: string | null
          profile_image?: string | null
        }
        Update: {
          name?: string | null
          phone?: string | null
          role?: 'FARMER' | 'EXPERT' | 'ADMIN'
          language?: string
          location?: string | null
          profile_image?: string | null
        }
      }
      disease_reports: {
        Row: {
          id: string
          user_id: string
          crop_name: string
          disease_name: string | null
          confidence: number | null
          image: string
          recommendation: string | null
          created_at: string
        }
      }
      farms: {
        Row: {
          id: string
          user_id: string
          name: string
          location: string | null
          size_acres: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          location?: string | null
          size_acres?: number | null
          created_at?: string
        }
      }
      crops: {
        Row: {
          id: string
          user_id: string
          farm_id: string
          name: string
          variety: string | null
          planted_at: string | null
          health: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          farm_id: string
          name: string
          variety?: string | null
          planted_at?: string | null
          health?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          variety?: string | null
          planted_at?: string | null
          health?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      crop_expenses: {
        Row: {
          id: string
          crop_id: string
          user_id: string
          category: 'Seeds' | 'Fertilizer' | 'Labour' | 'Water' | 'Pesticides' | 'Machinery' | 'Transport' | 'Other'
          amount: number
          expense_date: string
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          crop_id: string
          user_id: string
          category: 'Seeds' | 'Fertilizer' | 'Labour' | 'Water' | 'Pesticides' | 'Machinery' | 'Transport' | 'Other'
          amount: number
          expense_date?: string
          note?: string | null
          created_at?: string
        }
        Update: {
          category?: 'Seeds' | 'Fertilizer' | 'Labour' | 'Water' | 'Pesticides' | 'Machinery' | 'Transport' | 'Other'
          amount?: number
          expense_date?: string
          note?: string | null
        }
      }
      crop_income: {
        Row: {
          id: string
          crop_id: string
          user_id: string
          amount: number
          income_date: string
          source: string | null
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          crop_id: string
          user_id: string
          amount: number
          income_date?: string
          source?: string | null
          note?: string | null
          created_at?: string
        }
        Update: {
          amount?: number
          income_date?: string
          source?: string | null
          note?: string | null
        }
      }
      weather: {
        Row: {
          id: string
          location: string
          temperature: number
          humidity: number
          rainfall: number | null
          updated_at: string
        }
      }
      market_prices: {
        Row: {
          id: string
          crop: string
          market: string
          state: string
          price: number
          updated_at: string
        }
      }
      government_schemes: {
        Row: {
          id: string
          title: string
          description: string
          eligibility: string
          category: string | null
          pros: string | null
          cons: string | null
          min_acres: number | null
          link: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          is_read: boolean
          created_at: string
        }
      }
      feedback: {
        Row: {
          id: string
          user_id: string
          rating: number
          message: string
          created_at: string
        }
      }
    }
  }
}
