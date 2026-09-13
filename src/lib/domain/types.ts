export type StageKey = 'wonder' | 'body' | 'strength' | 'handover'

export type ItemKind = 'conversation' | 'competency' | 'experience' | 'rite'

/**
 * Whether an item belongs to one boy or can be ticked off for the whole family.
 * A camping trip covers every son at once; the puberty conversation never does.
 */
export type Scope = 'individual' | 'shared'

export interface Stage {
  key: StageKey
  number: 1 | 2 | 3 | 4
  name: string
  /** One line on what this stage is forming. */
  theme: string
  ageFrom: number
  ageTo: number
  /** Read across the whole stage, a chapter at a time — not quoted at him. */
  spineText: string
}

export interface ArcItem {
  /** Stable across content edits — progress rows reference it. */
  id: string
  stage: StageKey
  kind: ItemKind
  scope: Scope
  title: string
  /** Why it matters and how to actually do it. */
  detail: string
  /** Something a father can say out loud, where a script helps. */
  opener?: string
  scripture?: string
}

export interface Child {
  id: string
  name: string
  /** ISO date, YYYY-MM-DD. */
  birthdate: string
}

export interface Clock {
  age: number
  /** Whole years until his eighteenth. */
  summersLeft: number
  saturdaysLeft: number
  nextBirthday: Date
  daysToNextBirthday: number
  stage: Stage | null
}
