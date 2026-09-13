import type { Stage, StageKey } from './types'

export const STAGES: Stage[] = [
  {
    key: 'wonder',
    number: 1,
    name: 'Wonder & Belonging',
    theme:
      'He learns that the world is good, that God made it, and that his father is both safe and fun. This stage buys the trust the next one spends.',
    ageFrom: 8,
    ageTo: 10,
    spineText: 'Genesis 1–2, Psalm 8, Psalm 139',
  },
  {
    key: 'body',
    number: 2,
    name: 'Body & Truth',
    theme:
      'The hinge. Puberty, a phone, pornography and the first real doubts all land inside thirty-six months.',
    ageFrom: 11,
    ageTo: 13,
    spineText: 'Proverbs 1–7, Luke 2:41–52',
  },
  {
    key: 'strength',
    number: 3,
    name: 'Strength & Responsibility',
    theme:
      'He is becoming physically powerful and does not yet know what power is for. This stage is about aiming it.',
    ageFrom: 14,
    ageTo: 16,
    spineText: 'Daniel 1–6, James 3',
  },
  {
    key: 'handover',
    number: 4,
    name: 'The Handover',
    theme:
      'The deliberate end of your authority and the start of a friendship between peers, done on purpose and out loud.',
    ageFrom: 17,
    ageTo: 18,
    spineText: '1 Kings 2:1–4, 1 Chronicles 28:9–10, 2 Timothy',
  },
]

export function stageForAge(age: number): Stage | null {
  return STAGES.find((s) => age >= s.ageFrom && age <= s.ageTo) ?? null
}

export function stageByKey(key: StageKey): Stage {
  const stage = STAGES.find((s) => s.key === key)
  if (!stage) throw new Error(`Unknown stage: ${key}`)
  return stage
}
