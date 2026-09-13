import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { requireSupabaseEnv } from './env'

export async function createClient() {
  const { url, publishableKey } = requireSupabaseEnv()
  const cookieStore = await cookies()

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // Session refresh is handled in middleware instead.
        }
      },
    },
  })
}
