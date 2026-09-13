/**
 * Supabase config, read once. Returns null rather than throwing when it isn't
 * configured yet, so a fresh clone renders a setup screen instead of a stack
 * trace.
 */
export interface SupabaseEnv {
  url: string
  publishableKey: string
}

export function supabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !publishableKey) return null
  return { url, publishableKey }
}

export function requireSupabaseEnv(): SupabaseEnv {
  const env = supabaseEnv()
  if (!env) {
    throw new Error(
      'Supabase is not configured. Copy .env.example to .env.local and fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    )
  }
  return env
}
