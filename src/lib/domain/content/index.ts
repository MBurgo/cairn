import type { ArcItem, StageKey } from '../types'
import { STAGE_ONE } from './stage-one'

/**
 * Titles are written as instructions with `{name}` where his son's name goes.
 * Shared items cover every boy at once, so they carry no placeholder — a
 * content invariant the tests enforce rather than trusting.
 */
export function titleFor(item: ArcItem, childName: string): string {
  return item.title.replace(/\{name\}/g, childName)
}

export { GROUNDWORK, groundworkById } from './groundwork'

/**
 * Stages two to four are written a year ahead of the eldest son reaching them.
 * Until then the app shows stage one and the stage summary only.
 */
const ALL_ITEMS: ArcItem[] = [...STAGE_ONE]

/** Always returned in curriculum order, never authoring order. */
export function itemsForStage(stage: StageKey): ArcItem[] {
  return ALL_ITEMS.filter((i) => i.stage === stage).sort((a, b) => a.order - b.order)
}

export function itemById(id: string): ArcItem | undefined {
  return ALL_ITEMS.find((i) => i.id === id)
}

export function allItems(): ArcItem[] {
  return [...ALL_ITEMS].sort((a, b) => a.order - b.order)
}
