import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_ANON_KEY and NEXT_PUBLIC_SUPABASE_URL')
} else if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
} else if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing Supabase environment variable: NEXT_PUBLIC_SUPABASE_URL')
}

export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)