import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fricraexcepedkxdigsa.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyaWNyYWV4Y2VwZWRreGRpZ3NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMzY2NTMsImV4cCI6MjA3NjgxMjY1M30.UthrNpOGx12Cgfdeuj5Kw5AEwgSt9efHp08FI7mw8vY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-client-info': 'cinematech-web'
    }
  }
})
