import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { supabaseEnv } from './env'

/**
 * Refreshes the auth cookie on every request and tells the caller who the
 * user is. Returns a null user when Supabase isn't configured, so an
 * unconfigured deploy shows the setup notice rather than redirect-looping.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  const env = supabaseEnv()
  if (!env) return { response, user: null, configured: false as const }

  const supabase = createServerClient(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { response, user, configured: true as const }
}
