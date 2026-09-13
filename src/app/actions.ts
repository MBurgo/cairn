'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { itemById } from '@/lib/domain/content'

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

  const supabase = await createClient()
  const { data: membership } = await supabase
    .from('family_members')
    .select('family_id')
    .maybeSingle()
  if (!membership) return { error: 'No family found.' }

  const { error } = await supabase
    .from('children')
    .insert({ family_id: membership.family_id, name, birthdate })
  if (error) return { error: error.message }

  revalidatePath('/')
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

  const supabase = await createClient()
  const { data: membership } = await supabase
    .from('family_members')
    .select('family_id')
    .maybeSingle()
  if (!membership) return { error: 'No family found.' }

  // A shared item is recorded once for the family; an individual one per boy.
  const scopedChildId = item.scope === 'shared' ? null : childId
  if (item.scope !== 'shared' && !scopedChildId) return { error: 'Which son?' }

  if (done) {
    const { error } = await supabase.from('arc_progress').insert({
      family_id: membership.family_id,
      child_id: scopedChildId,
      item_id: itemId,
    })
    // 23505 is a duplicate — already done, which is not a failure worth showing.
    if (error && error.code !== '23505') return { error: error.message }
  } else {
    let query = supabase
      .from('arc_progress')
      .delete()
      .eq('family_id', membership.family_id)
      .eq('item_id', itemId)
    query = scopedChildId ? query.eq('child_id', scopedChildId) : query.is('child_id', null)
    const { error } = await query
    if (error) return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/arc')
  return {}
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
