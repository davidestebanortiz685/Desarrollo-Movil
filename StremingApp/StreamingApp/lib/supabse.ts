import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://samcgcibyibfrgunkwdj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhbWNnY2lieWliZnJndW5rd2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY3MDc1NjEsImV4cCI6MjA0MjI4MzU2MX0.VdHH6myxebytKkHW_YRGy5LMN_7nCwyukYlOII7vjlY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})