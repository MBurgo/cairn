import { itemsForStage } from './content'
import { clockFor } from './clock'
import type { ArcItem, Child } from './types'

export interface Nudge {
  child: Child
  item: ArcItem
  /** Shared items tick off for every son at once. */
  completionKey: string
}

/**
 * Completion keys. A shared item is done once for the whole family; an
 * individual one is done per boy.
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

/**
 * One nudge per week for the whole family, rotating between sons.
 *
 * Deliberately NOT one per child: three boys must not mean three
 * notifications, or the father mutes them inside a fortnight.
 */
export function weeklyNudge(
  children: Child[],
  completed: Set<string>,
  on: Date = new Date()
): Nudge | null {
  const eligible = children
    .map((child) => ({ child, clock: clockFor(child, on) }))
    .filter((c) => c.clock.stage !== null)

  if (eligible.length === 0) return null

  const week = isoWeek(on)
  // Rotate the starting boy each week, then fall through to the others so a
  // son with nothing outstanding never costs the family its weekly nudge.
  for (let offset = 0; offset < eligible.length; offset++) {
    const { child, clock } = eligible[(week + offset) % eligible.length]
    const outstanding = itemsForStage(clock.stage!.key).filter(
      (item) => !completed.has(completionKey(item, child.id))
    )
    // The rite closes the stage, so keep it last.
    const next =
      outstanding.find((i) => i.kind !== 'rite') ?? outstanding.find((i) => i.kind === 'rite')
    if (next) {
      return { child, item: next, completionKey: completionKey(next, child.id) }
    }
  }
  return null
}
