/**
 * Inline scripture, and links out for everything else.
 *
 * Translation is the World English Bible, British Edition — public domain, so
 * it ships with no permission and no licence fee, reads in British English,
 * and renders the divine name as "the LORD" rather than "Yahweh".
 *
 * ESV is the preferred long-term text. Crossway's Standard Use Guidelines
 * allow up to 500 verses without written permission, BUT carve out
 * "commentary or other Bible reference work produced for commercial sale",
 * which a paid devotional app arguably is — and their free API is explicitly
 * non-commercial. So: written permission first, then swap the text below.
 * Nothing else has to change; the references are already the source of truth.
 *
 * Only short passages are carried inline. The stage spine texts (Proverbs 1–7,
 * Daniel 1–6) stay as references on purpose: a father and son should have a
 * real Bible open between them, not a phone.
 */

export interface Passage {
  reference: string
  text: string
  translation: string
}

const WEBBE = 'WEB, British Edition'

const PASSAGES: Record<string, Passage> = {
  'Malachi 4:6': {
    reference: 'Malachi 4:6',
    translation: WEBBE,
    text: 'He will turn the hearts of the fathers to the children and the hearts of the children to their fathers, lest I come and strike the earth with a curse.',
  },
  'Psalm 56:3': {
    reference: 'Psalm 56:3',
    translation: WEBBE,
    text: 'When I am afraid, I will put my trust in you.',
  },
  'Psalm 139:13–14': {
    reference: 'Psalm 139:13–14',
    translation: WEBBE,
    text: 'For you formed my inmost being. You knit me together in my mother’s womb. I will give thanks to you, for I am fearfully and wonderfully made. Your works are wonderful. My soul knows that very well.',
  },
  'Joshua 4:6–7': {
    reference: 'Joshua 4:6–7',
    translation: WEBBE,
    text: 'that this may be a sign amongst you, that when your children ask in the future, saying, “What do you mean by these stones?” then you shall tell them, “Because the waters of the Jordan were cut off before the ark of the LORD’s covenant.” These stones shall be for a memorial to the children of Israel forever.',
  },
  'Numbers 6:24–26': {
    reference: 'Numbers 6:24–26',
    translation: WEBBE,
    text: 'The LORD bless you, and keep you. The LORD make his face to shine on you, and be gracious to you. The LORD lift up his face towards you, and give you peace.',
  },
  'Micah 6:8': {
    reference: 'Micah 6:8',
    translation: WEBBE,
    text: 'He has shown you, O man, what is good. What does the LORD require of you, but to act justly, to love mercy, and to walk humbly with your God?',
  },
  'Psalm 8:3–4': {
    reference: 'Psalm 8:3–4',
    translation: WEBBE,
    text: 'When I consider your heavens, the work of your fingers, the moon and the stars, which you have ordained, what is man, that you think of him? What is the son of man, that you care for him?',
  },
  '1 Timothy 4:12': {
    reference: '1 Timothy 4:12',
    translation: WEBBE,
    text: 'Let no man despise your youth; but be an example to those who believe, in word, in your way of life, in love, in spirit, in faith, and in purity.',
  },
  'Psalm 23': {
    reference: 'Psalm 23',
    translation: WEBBE,
    text:
      'The LORD is my shepherd; I shall lack nothing. He makes me lie down in green pastures. ' +
      'He leads me beside still waters. He restores my soul. He guides me in the paths of ' +
      'righteousness for his name’s sake. Even though I walk through the valley of the shadow ' +
      'of death, I will fear no evil, for you are with me. Your rod and your staff, they comfort ' +
      'me. You prepare a table before me in the presence of my enemies. You anoint my head with ' +
      'oil. My cup runs over. Surely goodness and loving kindness shall follow me all the days of ' +
      'my life, and I will dwell in the LORD’s house forever.',
  },
  'Hebrews 10:24–25': {
    reference: 'Hebrews 10:24–25',
    translation: WEBBE,
    text:
      'Let’s consider how to provoke one another to love and good works, not forsaking our own ' +
      'assembling together, as the custom of some is, but exhorting one another, and so much the ' +
      'more as you see the Day approaching.',
  },
  'Deuteronomy 6:6–7': {
    reference: 'Deuteronomy 6:6–7',
    translation: WEBBE,
    text: 'These words, which I command you today, shall be on your heart; and you shall teach them diligently to your children, and shall talk of them when you sit in your house, and when you walk by the way, and when you lie down, and when you rise up.',
  },
}

/** Inline text where we carry it; undefined means reference-and-link only. */
export function passageFor(reference: string): Passage | undefined {
  return PASSAGES[reference]
}

/**
 * Where to read the whole thing. A link costs nothing legally and works for
 * any translation, which matters when a father's church reads something else.
 */
export function readOnlineUrl(reference: string, version = 'ESV'): string {
  const search = encodeURIComponent(reference.replace(/[–—]/g, '-'))
  return `https://www.biblegateway.com/passage/?search=${search}&version=${version}`
}
