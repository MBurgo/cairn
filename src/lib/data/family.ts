import { createClient } from '@/lib/supabase/server'
import { supabaseEnv } from '@/lib/supabase/env'
import type { Child } from '@/lib/domain/types'

export interface FamilyContext {
  userEmail: string
  family: { id: string; name: string } | null
  children: Child[]
  /** Keys in completionKey() form: `itemId` for shared, `childId:itemId` otherwise. */
  completed: Set<string>
}

/**
 * Everything the home screen needs, in one pass. Returns family: null for a
 * signed-in user who hasn't set one up yet — the caller sends them to /setup.
 */
export async function getFamilyContext(): Promise<FamilyContext | null> {
  // Treated as 'not signed in' rather than thrown, so a missing env var shows
  // the setup notice instead of a stack trace.
  if (!supabaseEnv()) return null

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: membership } = await supabase
    .from('family_members')
    .select('family_id, families(id, name)')
    .eq('user_id', user.id)
    .maybeSingle()

  const family = (membership?.families as unknown as { id: string; name: string } | null) ?? null
  if (!family) {
    return { userEmail: user.email ?? '', family: null, children: [], completed: new Set() }
  }

  const [{ data: children }, { data: progress }] = await Promise.all([
    supabase
      .from('children')
      .select('id, name, birthdate')
      .eq('family_id', family.id)
      .order('birthdate', { ascending: true }),
    supabase.from('arc_progress').select('child_id, item_id').eq('family_id', family.id),
  ])

  const completed = new Set(
    (progress ?? []).map((row) => (row.child_id ? `${row.child_id}:${row.item_id}` : row.item_id))
  )

  return {
    userEmail: user.email ?? '',
    family,
    children: (children ?? []) as Child[],
    completed,
  }
}
