import { GROUNDWORK, itemsForStage } from './content'
import { clockFor } from './clock'
import type { ArcItem, Child, GroundworkItem } from './types'

export type Nudge =
  | { type: 'groundwork'; item: GroundworkItem; key: string }
  | { type: 'arc'; child: Child; item: ArcItem; key: string }

export interface NudgeState {
  children: Child[]
  /** Completion keys already done. */
  completed: Set<string>
  /** Completion key → ISO date it becomes available again. */
  deferred: Map<string, string>
  /** A father who says he already knows how this works. */
  groundworkSkipped: boolean
}

/**
 * Completion keys. A shared item is done once for the whole family; an
 * individual one is done per boy. Groundwork belongs to the father, so it is
 * keyed by item alone.
 */
export function completionKey(item: ArcItem, childId: string): string {
  return item.scope === 'shared' ? item.id : `${childId}:${item.id}`
}

/** ISO-8601 week number. Two sons get alternate weeks, not two notifications. */
export function isoWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function available(key: string, state: NudgeState, on: Date): boolean {
  if (state.completed.has(key)) return false
  const until = state.deferred.get(key)
  return !until || until <= isoDate(on)
}

/** Groundwork is sequential — it is a ramp, so it is not shuffled. */
function nextGroundwork(state: NudgeState, on: Date): Nudge | null {
  if (state.groundworkSkipped) return null
  const item = [...GROUNDWORK]
    .sort((a, b) => a.order - b.order)
    .find((g) => available(g.id, state, on))
  return item ? { type: 'groundwork', item, key: item.id } : null
}

/**
 * Every outstanding arc item, in the order a father should be offered them:
 * this week's son first, his brothers after, each in curriculum order with
 * the rite held back until the rest of his stage is done.
 */
function arcCandidates(state: NudgeState, on: Date): Nudge[] {
  const eligible = state.children
    .map((child) => ({ child, clock: clockFor(child, on) }))
    .filter((c) => c.clock.stage !== null)
  if (eligible.length === 0) return []

  const week = isoWeek(on)
  const out: Nudge[] = []

  for (let offset = 0; offset < eligible.length; offset++) {
    const { child, clock } = eligible[(week + offset) % eligible.length]
    const outstanding = itemsForStage(clock.stage!.key).filter((item) =>
      available(completionKey(item, child.id), state, on)
    )
    const ordered = [
      ...outstanding.filter((i) => i.kind !== 'rite'),
      ...outstanding.filter((i) => i.kind === 'rite'),
    ]
    for (const item of ordered) {
      out.push({ type: 'arc', child, item, key: completionKey(item, child.id) })
    }
  }
  return out
}

/**
 * The one thing a father is asked this week.
 *
 * Groundwork comes first and ignores his sons entirely — four weeks that
 * belong to him. Only then does the arc begin, and it begins gently: the
 * curriculum order puts things you do together well before the conversations
 * that need trust already banked.
 *
 * `skip` advances to the next candidate for "show me something else". It wraps,
 * so a father can cycle rather than hit a dead end.
 */
export function weeklyNudge(state: NudgeState, on: Date = new Date(), skip = 0): Nudge | null {
  const groundwork = nextGroundwork(state, on)
  if (groundwork) return groundwork

  const candidates = arcCandidates(state, on)
  if (candidates.length === 0) return null
  const index = ((skip % candidates.length) + candidates.length) % candidates.length
  return candidates[index]
}

/** How many alternatives exist, so the UI knows whether to offer a swap. */
export function alternativeCount(state: NudgeState, on: Date = new Date()): number {
  if (nextGroundwork(state, on)) return 0
  return Math.max(0, arcCandidates(state, on).length - 1)
}

/** Progress through the four father-only weeks. Not date-dependent. */
export function groundworkProgress(state: NudgeState) {
  const done = GROUNDWORK.filter((g) => state.completed.has(g.id)).length
  return { done, total: GROUNDWORK.length, complete: done === GROUNDWORK.length || state.groundworkSkipped }
}

/** "Not yet" pushes an item out by three months. */
export function deferralDate(on: Date = new Date()): string {
  const d = new Date(on.getFullYear(), on.getMonth() + 3, on.getDate())
  return isoDate(d)
}
