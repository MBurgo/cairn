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
  /**
   * An instruction, not a headline. Written in the imperative so a father
   * reads it and knows what to do. `{name}` is replaced with his son's name —
   * only on individual items; shared ones cover every boy at once.
   */
  title: string
  /** One line. Enough to decide from without opening anything. */
  summary: string
  /** Why it matters and how to actually do it. Shown on request. */
  detail: string
  /** Something a father can say out loud, where a script helps. */
  opener?: string
  scripture?: string
  /**
   * Hard conversations run by an ordinary father fail when they become
   * interrogations. Telling his own failure or fear first is what turns one
   * into a conversation. Shown as the first thing under "how".
   */
  fatherFirst?: string
  /**
   * A third party is part of it. Mentor items are experiences with another
   * man, and are never served until the father has named at least one.
   */
  involves?: 'mentor'
}

/** Which part of his son's book a piece of writing belongs to. */
export type Chapter =
  | 'house_sentence'
  | 'groundwork'
  | 'the_years'
  | 'birthdays'
  | 'prayers'
  | 'mentor_letter'
  | 'handover'
  | 'sons_letter'

export interface Mentor {
  id: string
  name: string
  relationship: string | null
  notes: string | null
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
  /** Imperative, like arc titles. No name — groundwork is about the father. */
  title: string
  /** One line. Enough to decide from without opening anything. */
  summary: string
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
