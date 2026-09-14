import { createClient } from '@/lib/supabase/server'
import { supabaseEnv } from '@/lib/supabase/env'
import type { Child, Mentor } from '@/lib/domain/types'

export interface FamilyContext {
  userEmail: string
  family: { id: string; name: string; reminderDay: number; groundworkSkipped: boolean } | null
  children: Child[]
  /** Keys in completionKey() form: `itemId` for shared and groundwork, `childId:itemId` otherwise. */
  completed: Set<string>
  /** Completion key → ISO date it becomes available again. */
  deferred: Map<string, string>
  mentors: Mentor[]
  /** Most recent completed item, for the re-ramp. Null if he's done nothing. */
  lastProgressOn: string | null
}

interface ProgressRow {
  child_id: string | null
  item_id: string
  status: string
  deferred_until: string | null
  completed_on: string | null
}

function keyFor(row: Pick<ProgressRow, 'child_id' | 'item_id'>): string {
  return row.child_id ? `${row.child_id}:${row.item_id}` : row.item_id
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
    .select('family_id, families(id, name, reminder_day, groundwork_skipped_at)')
    .eq('user_id', user.id)
    .maybeSingle()

  const row = membership?.families as unknown as
    | { id: string; name: string; reminder_day: number; groundwork_skipped_at: string | null }
    | null

  if (!row) {
    return {
      userEmail: user.email ?? '',
      family: null,
      children: [],
      completed: new Set(),
      deferred: new Map(),
      mentors: [],
      lastProgressOn: null,
    }
  }

  const [{ data: children }, { data: progress }, { data: mentors }] = await Promise.all([
    supabase
      .from('children')
      .select('id, name, birthdate')
      .eq('family_id', row.id)
      .order('birthdate', { ascending: true }),
    supabase
      .from('arc_progress')
      .select('child_id, item_id, status, deferred_until, completed_on')
      .eq('family_id', row.id),
    supabase
      .from('mentors')
      .select('id, name, relationship, notes')
      .eq('family_id', row.id)
      .order('created_at', { ascending: true }),
  ])

  const completed = new Set<string>()
  const deferred = new Map<string, string>()
  let lastProgressOn: string | null = null
  for (const p of (progress ?? []) as ProgressRow[]) {
    if (p.status === 'deferred' && p.deferred_until) {
      deferred.set(keyFor(p), p.deferred_until)
    } else {
      completed.add(keyFor(p))
      if (p.completed_on && (!lastProgressOn || p.completed_on > lastProgressOn)) {
        lastProgressOn = p.completed_on
      }
    }
  }

  return {
    userEmail: user.email ?? '',
    family: {
      id: row.id,
      name: row.name,
      reminderDay: row.reminder_day ?? 0,
      groundworkSkipped: row.groundwork_skipped_at !== null,
    },
    children: (children ?? []) as Child[],
    completed,
    deferred,
    mentors: (mentors ?? []) as Mentor[],
    lastProgressOn,
  }
}
