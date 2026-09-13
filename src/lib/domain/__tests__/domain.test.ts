import { test } from 'vitest'
import assert from 'node:assert/strict'
import { ageOn, clockFor, nextBirthday } from '../clock'
import { stageForAge } from '../stages'
import { completionKey, isoWeek, weeklyNudge } from '../nudge'
import { itemsForStage } from '../content'
import type { Child } from '../types'

const on = new Date(2026, 8, 13) // 13 Sep 2026

test('age is not incremented until the birthday has passed', () => {
  assert.equal(ageOn('2016-09-12', on), 10, 'day after birthday')
  assert.equal(ageOn('2016-09-13', on), 10, 'on the birthday itself')
  assert.equal(ageOn('2016-09-14', on), 9, 'day before birthday')
})

test('leap-day birthdays do not throw or drift', () => {
  assert.equal(ageOn('2016-02-29', on), 10)
})

test('next birthday rolls into next year once this year has passed', () => {
  assert.deepEqual(nextBirthday('2016-09-12', on), new Date(2027, 8, 12))
  assert.deepEqual(nextBirthday('2016-12-25', on), new Date(2026, 11, 25))
})

test('next birthday is today when today is the birthday', () => {
  assert.equal(clockFor({ id: 'a', name: 'A', birthdate: '2016-09-13' }, on).daysToNextBirthday, 0)
})

test('the clock counts down to eighteen', () => {
  const c = clockFor({ id: 'a', name: 'Elder', birthdate: '2016-03-01' }, on)
  assert.equal(c.age, 10)
  assert.equal(c.summersLeft, 8)
  assert.equal(c.saturdaysLeft, 416)
  assert.equal(c.stage?.key, 'wonder')
})

test('an eighteen-year-old has no summers left and no stage beyond handover', () => {
  const c = clockFor({ id: 'a', name: 'A', birthdate: '2008-01-01' }, on)
  assert.equal(c.age, 18)
  assert.equal(c.summersLeft, 0)
  assert.equal(c.stage?.key, 'handover')
})

test('stage boundaries land where the spec says', () => {
  assert.equal(stageForAge(7), null)
  assert.equal(stageForAge(8)?.key, 'wonder')
  assert.equal(stageForAge(10)?.key, 'wonder')
  assert.equal(stageForAge(11)?.key, 'body')
  assert.equal(stageForAge(14)?.key, 'strength')
  assert.equal(stageForAge(17)?.key, 'handover')
  assert.equal(stageForAge(19), null)
})

test('shared items complete once for the family, individual ones per boy', () => {
  const shared = itemsForStage('wonder').find((i) => i.scope === 'shared')!
  const individual = itemsForStage('wonder').find((i) => i.scope === 'individual')!
  assert.equal(completionKey(shared, 'child-1'), shared.id)
  assert.equal(completionKey(shared, 'child-2'), shared.id)
  assert.equal(completionKey(individual, 'child-1'), `child-1:${individual.id}`)
  assert.notEqual(completionKey(individual, 'child-1'), completionKey(individual, 'child-2'))
})

test('only one nudge is produced per week, however many sons there are', () => {
  const sons: Child[] = [
    { id: 'a', name: 'Elder', birthdate: '2016-03-01' },
    { id: 'b', name: 'Younger', birthdate: '2019-06-01' },
  ]
  const nudge = weeklyNudge(sons, new Set(), on)
  assert.ok(nudge)
  assert.ok(sons.some((s) => s.id === nudge.child.id))
})

test('the rotation alternates sons across consecutive weeks', () => {
  const sons: Child[] = [
    { id: 'a', name: 'Elder', birthdate: '2016-03-01' },
    { id: 'b', name: 'Younger', birthdate: '2017-06-01' },
  ]
  const thisWeek = weeklyNudge(sons, new Set(), new Date(2026, 8, 13))
  const nextWeek = weeklyNudge(sons, new Set(), new Date(2026, 8, 20))
  assert.notEqual(thisWeek!.child.id, nextWeek!.child.id)
})

test('a son with nothing outstanding does not cost the family its nudge', () => {
  const sons: Child[] = [
    { id: 'a', name: 'Elder', birthdate: '2016-03-01' },
    { id: 'b', name: 'Younger', birthdate: '2017-06-01' },
  ]
  // Everything done for whichever son this week would have picked.
  const picked = weeklyNudge(sons, new Set(), on)!
  const done = new Set(
    itemsForStage('wonder').map((i) => completionKey(i, picked.child.id))
  )
  const fallback = weeklyNudge(sons, done, on)
  assert.ok(fallback, 'should fall through to the brother')
  assert.notEqual(fallback.child.id, picked.child.id)
})

test('a son too young for the arc produces no nudge', () => {
  const nudge = weeklyNudge([{ id: 'c', name: 'Tiny', birthdate: '2023-01-01' }], new Set(), on)
  assert.equal(nudge, null)
})

test('the rite is held back until the rest of the stage is done', () => {
  const sons: Child[] = [{ id: 'a', name: 'Elder', birthdate: '2016-03-01' }]
  const nonRite = itemsForStage('wonder').filter((i) => i.kind !== 'rite')
  const done = new Set(nonRite.map((i) => completionKey(i, 'a')))
  assert.notEqual(weeklyNudge(sons, new Set(), on)!.item.kind, 'rite')
  assert.equal(weeklyNudge(sons, done, on)!.item.kind, 'rite')
})

test('isoWeek is stable within a week and moves between them', () => {
  assert.equal(isoWeek(new Date(2026, 8, 14)), isoWeek(new Date(2026, 8, 18)))
  assert.notEqual(isoWeek(new Date(2026, 8, 14)), isoWeek(new Date(2026, 8, 21)))
})

test('every content item has a unique id', () => {
  const ids = itemsForStage('wonder').map((i) => i.id)
  assert.equal(new Set(ids).size, ids.length)
})
