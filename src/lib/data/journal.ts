import { createClient } from '@/lib/supabase/server'
import { supabaseEnv } from '@/lib/supabase/env'

export interface Capture {
  id: string
  childId: string | null
  body: string
  occurredOn: string
  sourceItemId: string | null
}

export interface Prayer {
  id: string
  childId: string
  body: string
  scriptureRef: string | null
  loggedOn: string
  nextReviewOn: string
  status: 'waiting' | 'answered' | 'changed' | 'closed'
}

export interface PrayerReview {
  prayerId: string
  reviewedOn: string
  outcome: string
  note: string | null
}

export interface Journal {
  captures: Capture[]
  prayers: Prayer[]
  reviews: PrayerReview[]
  /** Waiting prayers whose review date has arrived — the whole point. */
  due: Prayer[]
}

function today(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export async function getJournal(familyId: string): Promise<Journal> {
  if (!supabaseEnv()) return { captures: [], prayers: [], reviews: [], due: [] }
  const supabase = await createClient()

  const [{ data: captures }, { data: prayers }, { data: reviews }] = await Promise.all([
    supabase
      .from('captures')
      .select('id, child_id, body, occurred_on, source_item_id')
      .eq('family_id', familyId)
      .order('occurred_on', { ascending: false })
      .limit(100),
    supabase
      .from('prayers')
      .select('id, child_id, body, scripture_ref, logged_on, next_review_on, status')
      .eq('family_id', familyId)
      .order('logged_on', { ascending: false })
      .limit(200),
    supabase
      .from('prayer_reviews')
      .select('prayer_id, reviewed_on, outcome, note')
      .order('reviewed_on', { ascending: false })
      .limit(200),
  ])

  const mappedPrayers: Prayer[] = (prayers ?? []).map((p) => ({
    id: p.id,
    childId: p.child_id,
    body: p.body,
    scriptureRef: p.scripture_ref,
    loggedOn: p.logged_on,
    nextReviewOn: p.next_review_on,
    status: p.status,
  }))

  const now = today()

  return {
    captures: (captures ?? []).map((c) => ({
      id: c.id,
      childId: c.child_id,
      body: c.body,
      occurredOn: c.occurred_on,
      sourceItemId: c.source_item_id,
    })),
    prayers: mappedPrayers,
    reviews: (reviews ?? []).map((r) => ({
      prayerId: r.prayer_id,
      reviewedOn: r.reviewed_on,
      outcome: r.outcome,
      note: r.note,
    })),
    due: mappedPrayers.filter((p) => p.status === 'waiting' && p.nextReviewOn <= now),
  }
}
