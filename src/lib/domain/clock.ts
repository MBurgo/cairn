import { stageForAge } from './stages'
import type { Child, Clock } from './types'

const LEAVING_AGE = 18

/** Midnight-anchored so the same day always gives the same answer. */
function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function parseBirthdate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) throw new Error(`Invalid birthdate: ${iso}`)
  return new Date(y, m - 1, d)
}

export function ageOn(birthdate: string, on: Date = new Date()): number {
  const b = parseBirthdate(birthdate)
  const today = startOfDay(on)
  let age = today.getFullYear() - b.getFullYear()
  const hadBirthday =
    today.getMonth() > b.getMonth() ||
    (today.getMonth() === b.getMonth() && today.getDate() >= b.getDate())
  if (!hadBirthday) age -= 1
  return age
}

export function nextBirthday(birthdate: string, on: Date = new Date()): Date {
  const b = parseBirthdate(birthdate)
  const today = startOfDay(on)
  let next = new Date(today.getFullYear(), b.getMonth(), b.getDate())
  if (next < today) next = new Date(today.getFullYear() + 1, b.getMonth(), b.getDate())
  return next
}

export function clockFor(child: Child, on: Date = new Date()): Clock {
  const age = ageOn(child.birthdate, on)
  const summersLeft = Math.max(0, LEAVING_AGE - age)
  const next = nextBirthday(child.birthdate, on)
  const msPerDay = 24 * 60 * 60 * 1000
  return {
    age,
    summersLeft,
    // Whole weeks remaining, which is near enough one Saturday each.
    saturdaysLeft: summersLeft * 52,
    nextBirthday: next,
    daysToNextBirthday: Math.round((next.getTime() - startOfDay(on).getTime()) / msPerDay),
    stage: stageForAge(age),
  }
}
