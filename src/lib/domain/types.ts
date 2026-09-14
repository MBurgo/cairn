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

/**
 * How much a father has to bring to it. Used to order the ramp, and to warn
 * him before something heavy rather than springing it on a Tuesday.
 */
export type Weight = 'gentle' | 'moderate' | 'weighty'

export interface ArcItem {
  /** Stable across content edits — progress rows reference it. */
  id: string
  stage: StageKey
  kind: ItemKind
  scope: Scope
  /**
   * Position within the stage. This is the curriculum: it ramps from things
   * you do together toward the conversations that need trust already banked.
   * Never reorder casually — it decides what a father is asked first.
   */
  order: number
  weight: Weight
  title: string
  /** Why it matters and how to actually do it. */
  detail: string
  /** Something a father can say out loud, where a script helps. */
  opener?: string
  scripture?: string
}

/** What a groundwork week asks the father to actually do. */
export type GroundworkInput = 'reminder-day' | 'writing' | 'acknowledge'

/**
 * The first four weeks, which belong to the father alone.
 *
 * Nobody arrives ready to talk to their son about anything. These weeks teach
 * the rhythm, make him name what he is aiming at, and have him reckon with his
 * own father — before a single item involves his boy.
 */
export interface GroundworkItem {
  id: string
  order: number
  title: string
  detail: string
  input: GroundworkInput
  /** Shown above the writing box. */
  prompt?: string
  /** Writing is kept as a capture, and becomes part of the book. */
  captureLabel?: string
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
