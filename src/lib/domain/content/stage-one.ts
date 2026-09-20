import type { ArcItem } from '../types'

/**
 * Ages 8–10. Nothing heavy. The job of this stage is trust and wonder —
 * it is the deposit that stage two spends.
 *
 * Grouped below by kind for readability, but the order a father is ASKED is
 * the `order` field, which ramps deliberately: things you do together first,
 * conversations only once a few months of goodwill are banked, and the rite
 * last.
 *
 * Titles are instructions, in the imperative, with `{name}` standing in for
 * his son. They are not headlines: a father reading one on a Tuesday needs to
 * know what to do, not to be impressed.
 */
export const STAGE_ONE: ArcItem[] = [
  // ---- Conversations ----
  //
  // Every conversation in this stage carries a session: four steps run with
  // his son in the room rather than four paragraphs read beforehand. Knowing
  // he should have the conversation was never the problem; starting it is.
  //
  // A session reads `scripture`, `fatherFirst` and `opener` off the item, so
  // all three are required here — the tests enforce it.
  {
    id: 'w-conv-babies',
    order: 17,
    weight: 'weighty',
    stage: 'wonder',
    kind: 'conversation',
    scope: 'individual',
    title: 'Tell {name} where babies come from',
    summary: 'Plain, accurate, and years before he needs it.',
    detail:
      'The goal is not to explain everything; it is to establish that you are the person who answers this kind of question without going strange. Do it on a drive or a walk, where neither of you has to make eye contact.',
    fatherFirst:
      'Say first that nobody explained this properly to you, or that whoever did made it awkward. Naming your own discomfort out loud is what stops you handing it on.',
    opener:
      '"Do you know how babies actually get made? Ask me anything you like about it — I won\'t be weird about it."',
    scripture: 'Psalm 139:13–14',
    session: {
      read: 'He heard these words months ago, in the conversation about being made on purpose. That is deliberate: the psalm has already told him why he exists, so this conversation only has to tell him how.',
      ask: [
        'What have you already heard about it, and who from?',
        'Anything you want to ask me? Anything at all.',
      ],
      do: 'Then go and do something completely ordinary together. Get a drink, kick a ball, drive home with the radio on. The ordinariness afterwards is what tells him it was not a big deal.',
      prayAlone: true,
      pray: 'God, I have just told him. Keep {name} clean-minded and unashamed. Keep the door open between us, so he comes to me and not to a screen. Amen.',
    },
  },
  {
    id: 'w-conv-death',
    order: 16,
    weight: 'weighty',
    stage: 'wonder',
    kind: 'conversation',
    scope: 'individual',
    title: 'Talk to {name} about death, when it comes up',
    summary: "Let him be sad first. Don't rush to the comfort.",
    detail:
      'Usually triggered by a pet, a grandparent, or a question out of nowhere at bedtime. A boy who learns his father can sit in a sad thing without fixing it will bring him the hard things later.',
    fatherFirst:
      'Tell him about the first death you remember and how old you were. Say that you found it frightening, if you did. Then let him be sad before you say anything you believe.',
    opener: '"Do you want to talk about it, or just sit here for a bit?"',
    scripture: 'Psalm 23',
    session: {
      cue: 'When it comes up — a pet, a grandparent, a question out of nowhere at bedtime.',
      // The only item that reorders the steps. You do not open a psalm at a boy
      // standing over a dead bird: he is sad first, and the words come after.
      order: ['talk', 'do', 'read', 'pray'],
      ask: ['What are you thinking about it?'],
      do: 'Ask whether he would like to do something to remember: a stone in the garden, a drawing, the name written down somewhere. If he says yes, do it this week.',
      read: 'Now rather than earlier. Read the whole thing slowly, and do not explain it afterwards.',
      pray: 'God, we are sad. {name} is sad. You know what this is like from the inside. Be near him tonight. Amen.',
    },
  },
  {
    id: 'w-conv-why-church',
    order: 11,
    weight: 'moderate',
    stage: 'wonder',
    kind: 'conversation',
    scope: 'shared',
    title: 'Tell them why you actually go to church',
    summary: 'In your own words, in about two sentences.',
    detail:
      'At this age he assumes it is simply what your family does, like the football team you support. Give him the real reason. If the honest answer includes something you find difficult about it, say that too — it costs you nothing now and buys a great deal at fifteen.',
    fatherFirst:
      'Say the hard part first: the Sunday you did not want to go, the bit you find boring, the person there you struggle with. Then say why you go anyway. A boy who has heard his father admit church can be dull is far less likely to decide at fifteen that everyone was pretending.',
    opener:
      '"Do you know why we actually go on Sundays? It isn\'t just what our family does."',
    scripture: 'Hebrews 10:24–25',
    session: {
      read: 'Read it out, then ask what "provoke one another to love and good works" would look like at our church, specifically.',
      ask: [
        "What do you think we'd lose if we stopped going?",
        'What would you change about it if you could?',
      ],
      do: 'Take one of their answers seriously before the month is out: sit somewhere different, talk to the person they named, skip the thing they hate. Then tell them you did it because they said so.',
      pray: 'God, thank you for our church and the people in it. Where it is hard, help us stay. Where it is good, help us notice. Amen.',
    },
  },
  {
    id: 'w-conv-fear',
    order: 13,
    weight: 'moderate',
    stage: 'wonder',
    kind: 'conversation',
    scope: 'individual',
    title: "Give {name} something to do when he's frightened",
    summary: 'A sentence to pray, a place to come, a light he can turn on.',
    detail:
      'Something concrete to do, rather than a reassurance that it will be fine. Tell him what frightens you, briefly and truthfully. Being told that his father is also sometimes afraid is one of the most stabilising things a boy can hear.',
    fatherFirst:
      'Name something that frightens you now, not when you were his age. Being told that his father is currently afraid of something and still functioning is one of the most stabilising things a boy can hear.',
    opener: '"Can I tell you something that still scares me?"',
    scripture: 'Psalm 56:3',
    session: {
      read: 'Eight words. Read them, then have him read them back. He should be able to say it without the phone by the end.',
      ask: ["What's the one that gets you at night?", 'What do you do at the moment, when it happens?'],
      do: 'Agree all three before you leave the room: the sentence he prays, the place he can come, the light he can turn on. Write them on a card and put it where he sleeps.',
      pray: 'God, {name} gets frightened sometimes. So do I. When he is afraid, remind him you are here, and that I am just down the hall. Amen.',
    },
  },
  {
    id: 'w-conv-made-on-purpose',
    order: 12,
    weight: 'moderate',
    stage: 'wonder',
    kind: 'conversation',
    scope: 'individual',
    title: 'Tell {name} he was made on purpose',
    summary: 'Name a trait that is genuinely his, and say it was given to him.',
    detail:
      'Not a single talk — a thing you say more than once, in specifics. This is the seed of the blessing you will speak over him at thirteen, and it should not be the first time he hears the idea.',
    fatherFirst:
      'Start with something you have noticed about him for years and never said out loud, and tell him how long you have been watching it. The length of time is what makes it land: it proves you were not just being kind.',
    opener:
      '"There\'s something about you I\'ve noticed since you were about four, and I don\'t think I\'ve ever told you."',
    scripture: 'Psalm 139:13–14',
    session: {
      read: 'Read it aloud, then read verse 14 again with his name in place of "I".',
      ask: [
        "What do you think you're actually good at?",
        'Do you reckon that was given to you, or did you just end up that way?',
      ],
      do: 'Write the trait down tonight, where you will find it again in three years. It is the first line of what you will say over him at his blessing.',
      pray: 'God, thank you for making {name} exactly as he is. Thank you for the thing I have just named in him. Do not let him waste it, and do not let me be the one who talks him out of it. Amen.',
    },
  },

  // ---- Competencies ----
  {
    id: 'w-comp-swim',
    order: 7,
    weight: 'gentle',
    stage: 'wonder',
    kind: 'competency',
    scope: 'individual',
    title: 'Make sure {name} can properly swim',
    summary: 'Not survive in water — swim.',
    detail:
      'In Australia this is a safety issue before it is a competency, and it opens the door to half the experiences in the next three stages.',
  },
  {
    id: 'w-comp-ride',
    order: 5,
    weight: 'gentle',
    stage: 'wonder',
    kind: 'competency',
    scope: 'individual',
    title: 'Get {name} riding confidently — and let him fall off',
    summary: 'Both halves matter.',
    detail:
      'A boy who has come off and got back on has learned something about himself that no amount of encouragement transmits.',
  },
  {
    id: 'w-comp-tool',
    order: 8,
    weight: 'moderate',
    stage: 'wonder',
    kind: 'competency',
    scope: 'individual',
    title: 'Let {name} use a real tool',
    summary: 'A proper hammer, a handsaw, a sharp knife. Supervised.',
    detail:
      'Real tools, real risk. The message underneath is the one that matters: you are trusted with something that could hurt you.',
  },
  {
    id: 'w-comp-cook',
    order: 6,
    weight: 'gentle',
    stage: 'wonder',
    kind: 'competency',
    scope: 'individual',
    title: 'Teach {name} to cook one meal start to finish',
    summary: 'One dish he owns completely and can make for the family.',
    detail: 'Let it be bad the first few times and eat it anyway.',
  },
  {
    id: 'w-comp-adults',
    order: 3,
    weight: 'gentle',
    stage: 'wonder',
    kind: 'competency',
    scope: 'individual',
    title: 'Teach {name} to look an adult in the eye and answer',
    summary: 'Let him order his own food and thank the host by name.',
    detail:
      'Practise it deliberately, and often. Small, repeated, and it compounds into something people will describe as confidence for the rest of his life.',
  },
  {
    id: 'w-comp-money',
    order: 9,
    weight: 'moderate',
    stage: 'wonder',
    kind: 'competency',
    scope: 'individual',
    title: 'Give {name} his own money — including the freedom to waste it',
    summary: 'The disappointment is the lesson, and it is cheap at ten.',
    detail:
      'A small amount that is genuinely his, including the freedom to spend it on something that turns out to be rubbish. Much cheaper now than at nineteen.',
  },

  // ---- Experiences ----
  {
    id: 'w-exp-tent',
    order: 4,
    weight: 'gentle',
    stage: 'wonder',
    kind: 'experience',
    scope: 'shared',
    title: 'Sleep a night in a tent',
    summary: 'Somewhere dark enough that he sees the sky properly once.',
    detail:
      'This is the natural home of the Psalm 8 conversation — you will not have to engineer it, just be awake for it.',
    scripture: 'Psalm 8:3–4',
  },
  {
    id: 'w-exp-build',
    order: 2,
    weight: 'gentle',
    stage: 'wonder',
    kind: 'experience',
    scope: 'shared',
    title: 'Build something together that will still be here in ten years',
    summary: 'A box, a shelf, a go-kart, a garden bed.',
    detail:
      'Let his part be visibly his, mistakes included — do not tidy up his work after he goes to bed. The point is that he can point at it later.',
  },
  {
    id: 'w-exp-alone-day',
    order: 1,
    weight: 'gentle',
    stage: 'wonder',
    kind: 'experience',
    scope: 'individual',
    title: 'Spend a whole day with {name}, just the two of you',
    summary: 'No brothers, no phone, no errand attached to it.',
    detail:
      'With more than one son this needs to be deliberately scheduled or it never happens. For a boy with brothers, undivided attention for a whole day is the rarest thing you own.',
  },
  {
    id: 'w-exp-serve',
    order: 10,
    weight: 'moderate',
    stage: 'wonder',
    kind: 'experience',
    scope: 'shared',
    title: "Do something together for someone who can't repay it",
    summary: 'A meal delivered, a garden cleared, a visit made.',
    detail:
      'Alongside you, not instead of you. At this age he learns generosity by watching his father do it and being handed a job.',
  },

  // ---- The men around him ----
  {
    id: 'w-men-name-them',
    order: 14,
    weight: 'moderate',
    stage: 'wonder',
    kind: 'experience',
    scope: 'shared',
    title: "Write down the men you'd want standing beside your sons",
    summary: 'Four to eight names. Uncles, mates, men from church.',
    detail:
      'The single thing that most predicts whether a boy keeps his faith into adulthood is not a better-prepared father — it is several other adults genuinely invested in him. You cannot manufacture that at eighteen. Write the names now and you find out who is actually around your sons, or that nobody is, with years to do something about it.\n\nThese men never need the app. This list is for you.',
  },
  {
    id: 'w-men-first-ask',
    order: 15,
    weight: 'moderate',
    stage: 'wonder',
    kind: 'experience',
    scope: 'individual',
    involves: 'mentor',
    title: 'Ask {mentor} to spend an afternoon with {name}',
    summary: 'Just him and your son. You do not come.',
    detail:
      'Fishing, the workshop, the footy, a job that needs two people. The point is that your son spends real time with a man who is not his father and who chose to be there.\n\nAsk him in person or on the phone, not by text. Tell him plainly why you are asking, because that is the part that lands: you want other men in your son\'s life before he is old enough to go looking for them himself.',
  },

  // ---- The rite ----
  {
    id: 'w-rite-first-trip',
    order: 18,
    weight: 'weighty',
    stage: 'wonder',
    kind: 'rite',
    scope: 'individual',
    title: 'Take {name} away for two nights, and give him one named privilege',
    summary: 'A pocketknife, a later bedtime, his own Bible with his name in it.',
    detail:
      'Just the two of you. Name the privilege out loud as a marker rather than a present — "you are ten now, so you get this" — and mark a stone with the date.',
    scripture: 'Joshua 4:6–7',
  },
]
