import type { ArcItem, StageKey } from '../types'
import { STAGE_ONE } from './stage-one'

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
