import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string
          first_name: string | null
          age_band: string | null
          diet_pattern: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          first_name?: string | null
          age_band?: string | null
          diet_pattern?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          first_name?: string | null
          age_band?: string | null
          diet_pattern?: string | null
          created_at?: string
        }
      }
      planner_sessions: {
        Row: {
          id: number
          user_id: string
          inputs: any
          output: any
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          inputs: any
          output: any
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          inputs?: any
          output?: any
          created_at?: string
        }
      }
      library_items: {
        Row: {
          id: number
          slug: string
          title: string
          category: string
          evidence_level: string
          summary: string
          how_to_take: string
          guardrails: string
          tags: string[]
          updated_at: string
        }
        Insert: {
          id?: number
          slug: string
          title: string
          category: string
          evidence_level: string
          summary: string
          how_to_take: string
          guardrails: string
          tags: string[]
          updated_at?: string
        }
        Update: {
          id?: number
          slug?: string
          title?: string
          category?: string
          evidence_level?: string
          summary?: string
          how_to_take?: string
          guardrails?: string
          tags?: string[]
          updated_at?: string
        }
      }
      habits: {
        Row: {
          id: number
          user_id: string
          title: string
          schedule: any
          reminder_time: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          title: string
          schedule: any
          reminder_time?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          title?: string
          schedule?: any
          reminder_time?: string | null
          created_at?: string
        }
      }
      habit_logs: {
        Row: {
          id: number
          habit_id: number
          user_id: string
          date: string
          done: boolean
        }
        Insert: {
          id?: number
          habit_id: number
          user_id: string
          date: string
          done: boolean
        }
        Update: {
          id?: number
          habit_id?: number
          user_id?: string
          date?: string
          done?: boolean
        }
      }
      forecasts: {
        Row: {
          id: number
          user_id: string
          inputs: any
          projection: any
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          inputs: any
          projection: any
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          inputs?: any
          projection?: any
          created_at?: string
        }
      }
      safety_checks: {
        Row: {
          id: number
          user_id: string
          supplements: string[]
          meds: string[]
          conditions: string[]
          result: any
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          supplements: string[]
          meds: string[]
          conditions: string[]
          result: any
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          supplements?: string[]
          meds?: string[]
          conditions?: string[]
          result?: any
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: number
          user_id: string
          title: string
          body: string
          tags: string[]
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          title: string
          body: string
          tags: string[]
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          title?: string
          body?: string
          tags?: string[]
          created_at?: string
        }
      }
      answers: {
        Row: {
          id: number
          question_id: number
          user_id: string
          body: string
          is_expert: boolean
          created_at: string
        }
        Insert: {
          id?: number
          question_id: number
          user_id: string
          body: string
          is_expert?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          question_id?: number
          user_id?: string
          body?: string
          is_expert?: boolean
          created_at?: string
        }
      }
    }
  }
}