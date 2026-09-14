'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { groundworkById, itemById } from '@/lib/domain/content'
import { deferralDate } from '@/lib/domain/nudge'

export interface ActionResult {
  error?: string
}

function isoDateOrNull(value: unknown): string | null {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [y, m, d] = value.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  // Rejects 31 February and friends, which the regex happily allows.
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null
  if (date > new Date()) return null
  return value
}

async function currentFamilyId(): Promise<string | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('family_members').select('family_id').maybeSingle()
  return data?.family_id ?? null
}

/**
 * Writes one progress row, replacing whatever was there. The unique indexes on
 * arc_progress are partial, which makes upsert awkward, so this clears first —
 * and clearing is what we want anyway when an item moves from deferred to done.
 */
async function writeProgress(
  familyId: string,
  childId: string | null,
  itemId: string,
  status: 'done' | 'deferred',
  deferredUntil: string | null
): Promise<string | null> {
  const supabase = await createClient()
  let del = supabase
    .from('arc_progress')
    .delete()
    .eq('family_id', familyId)
    .eq('item_id', itemId)
  del = childId ? del.eq('child_id', childId) : del.is('child_id', null)
  const { error: delError } = await del
  if (delError) return delError.message

  const { error } = await supabase.from('arc_progress').insert({
    family_id: familyId,
    child_id: childId,
    item_id: itemId,
    status,
    deferred_until: deferredUntil,
  })
  return error?.message ?? null
}

function refresh() {
  revalidatePath('/')
  revalidatePath('/arc')
}

export async function createFamily(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const familyName = String(formData.get('familyName') ?? '').trim()
  const sonName = String(formData.get('sonName') ?? '').trim()
  const birthdate = isoDateOrNull(formData.get('birthdate'))

  if (!familyName) return { error: 'Give the family a name.' }
  if (!sonName) return { error: "Add your son's name." }
  if (!birthdate) return { error: 'Enter a real date of birth in the past.' }

  const supabase = await createClient()
  const { data: familyId, error: familyError } = await supabase.rpc('create_family', {
    p_name: familyName,
  })
  if (familyError) return { error: familyError.message }

  const { error: childError } = await supabase
    .from('children')
    .insert({ family_id: familyId, name: sonName, birthdate })
  if (childError) return { error: childError.message }

  redirect('/')
}

export async function addSon(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const name = String(formData.get('name') ?? '').trim()
  const birthdate = isoDateOrNull(formData.get('birthdate'))
  if (!name) return { error: "Add your son's name." }
  if (!birthdate) return { error: 'Enter a real date of birth in the past.' }

  const familyId = await currentFamilyId()
  if (!familyId) return { error: 'No family found.' }

  const supabase = await createClient()
  const { error } = await supabase.from('children').insert({ family_id: familyId, name, birthdate })
  if (error) return { error: error.message }

  refresh()
  return {}
}

export async function setItemDone(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const itemId = String(formData.get('itemId') ?? '')
  const childId = String(formData.get('childId') ?? '')
  const done = String(formData.get('done') ?? '') === 'true'

  const item = itemById(itemId)
  if (!item) return { error: 'Unknown item.' }

  const familyId = await currentFamilyId()
  if (!familyId) return { error: 'No family found.' }

  // A shared item is recorded once for the family; an individual one per boy.
  const scopedChildId = item.scope === 'shared' ? null : childId
  if (item.scope !== 'shared' && !scopedChildId) return { error: 'Which son?' }

  if (done) {
    const error = await writeProgress(familyId, scopedChildId, itemId, 'done', null)
    if (error) return { error }
  } else {
    const supabase = await createClient()
    let query = supabase
      .from('arc_progress')
      .delete()
      .eq('family_id', familyId)
      .eq('item_id', itemId)
    query = scopedChildId ? query.eq('child_id', scopedChildId) : query.is('child_id', null)
    const { error } = await query
    if (error) return { error: error.message }
  }

  refresh()
  return {}
}

/**
 * "Not yet." Pushes an item three months out instead of forcing a father to
 * either lie about it or ignore the app. A false completion would end up
 * printed in his son's book.
 */
export async function deferItem(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const itemId = String(formData.get('itemId') ?? '')
  const childId = String(formData.get('childId') ?? '')

  const arcItem = itemById(itemId)
  const groundwork = groundworkById(itemId)
  if (!arcItem && !groundwork) return { error: 'Unknown item.' }

  const familyId = await currentFamilyId()
  if (!familyId) return { error: 'No family found.' }

  const scopedChildId = !arcItem || arcItem.scope === 'shared' ? null : childId
  const error = await writeProgress(
    familyId,
    scopedChildId,
    itemId,
    'deferred',
    deferralDate(new Date())
  )
  if (error) return { error }

  refresh()
  return {}
}

/**
 * Completes one of the four father-only weeks. Writing items keep what he
 * wrote as a capture — it is the first thing that goes into his son's book,
 * dated and written before any of it had happened.
 */
export async function completeGroundwork(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const itemId = String(formData.get('itemId') ?? '')
  const item = groundworkById(itemId)
  if (!item) return { error: 'Unknown item.' }

  const familyId = await currentFamilyId()
  if (!familyId) return { error: 'No family found.' }

  const supabase = await createClient()

  if (item.input === 'writing') {
    const body = String(formData.get('body') ?? '').trim()
    if (body.length < 20) {
      return { error: 'Write a little more — a sentence or two at least. Nobody else reads this.' }
    }
    const { error } = await supabase.from('captures').insert({
      family_id: familyId,
      child_id: null,
      body,
      source_item_id: itemId,
    })
    if (error) return { error: error.message }
  }

  if (item.input === 'reminder-day') {
    const day = Number(formData.get('reminderDay'))
    if (!Number.isInteger(day) || day < 0 || day > 6) return { error: 'Pick a day.' }
    const { error } = await supabase
      .from('families')
      .update({ reminder_day: day })
      .eq('id', familyId)
    if (error) return { error: error.message }
  }

  const error = await writeProgress(familyId, null, itemId, 'done', null)
  if (error) return { error }

  refresh()
  return {}
}

/** For a father who has done this before and does not need the ramp. */
export async function skipGroundwork(): Promise<void> {
  const familyId = await currentFamilyId()
  if (familyId) {
    const supabase = await createClient()
    await supabase
      .from('families')
      .update({ groundwork_skipped_at: new Date().toISOString() })
      .eq('id', familyId)
  }
  refresh()
  redirect('/')
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
