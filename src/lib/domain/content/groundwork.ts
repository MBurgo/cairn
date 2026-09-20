import type { GroundworkItem } from '../types'

/**
 * Four weeks before the arc begins. No item here involves his son.
 *
 * Weeks two and three produce writing that is kept: a father's statement of
 * intent, written before any of it happened, and an honest account of what his
 * own father did and didn't give him. Both end up in the book.
 */
export const GROUNDWORK: GroundworkItem[] = [
  {
    id: 'gw-1-rhythm',
    order: 1,
    title: 'Set the day you want to be asked',
    summary: 'One thing a week, for about ten years. Nothing this week involves your sons.',
    detail:
      'One thing a week. Not one a day, and never one per son — however many boys you have, Cairn asks you for one thing. Some weeks it takes an afternoon, most weeks it takes a conversation, and a few times over the next decade it takes a proper occasion with other men present. Nothing has to be long to count — some of the most important things you will ever say to him take ten minutes. And when a hard one comes up, Cairn takes you through it a step at a time, so you are never left working out how to begin.\n\nIt runs from eight to eighteen in four stages, and at the end there is a book for each of your sons containing what you did, what you said, and what you prayed. Nothing this week involves him. Just tell Cairn when to ask you.',
    input: 'reminder-day',
  },
  {
    id: 'gw-2-aiming',
    order: 2,
    title: "Write down what you're aiming at",
    summary: 'What kind of man, not a list of achievements. It goes into his book exactly as you write it.',
    detail:
      'You have seen how many birthdays are left. Sit with that for a minute before you write.\n\nNot a list of achievements — what kind of man. Be specific and be honest; nobody else reads this. It is the only fixed point the next ten years have, and everything Cairn asks of you is measured against it.\n\nThis is kept. It goes in his book exactly as you write it today, dated, written before any of it had happened.',
    input: 'writing',
    prompt: 'What do you want to be true about him at eighteen?',
    captureLabel: 'What I was aiming at',
  },
  {
    id: 'gw-3-your-father',
    order: 3,
    title: 'Write honestly about your own father',
    summary: 'What he gave you, and what he did not. The week most men skip.',
    detail:
      'This is the week most men would skip, and it is the one that decides whether the rest works.\n\nWhat did your father give you, and what did he not? Write it plainly, without settling scores and without being generous for the sake of it. If he was good, name what he did so you can do it deliberately. If he was absent or harsh, name that too — because what is not named tends to get handed on.\n\nAlmost no father was ever blessed by his own. That is not a disqualification. It is the reason you are doing this.',
    input: 'writing',
    prompt: "What did your father give you, and what didn't he?",
    captureLabel: 'What my father gave me',
    scripture: 'Malachi 4:6',
  },
  {
    id: 'gw-4-one-sentence',
    order: 4,
    title: 'Say one true sentence out loud to your son',
    summary: 'Not a conversation. One sentence, this week.',
    detail:
      'Now something involving your son, and deliberately the smallest thing Cairn will ever ask.\n\nNot a conversation. One sentence, said out loud, this week. Something true you have thought and never actually said — what you noticed him do, what you admire in him, that you are glad he is yours. It will feel disproportionately hard, which is the point: if a sentence is hard, an hour was never going to happen on its own.\n\nThen the arc starts, and it starts gently.',
    input: 'acknowledge',
  },
]

export function groundworkById(id: string): GroundworkItem | undefined {
  return GROUNDWORK.find((g) => g.id === id)
}
