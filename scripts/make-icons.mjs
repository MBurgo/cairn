/**
 * Generates the app icon set from one SVG. Run with `npm run icons` after
 * changing the mark; the PNGs are committed so builds need no image tooling.
 *
 * The mark is a cairn: five hand-stacked stones, largest at the base, each
 * offset a little so it reads as built rather than drawn.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const GROUND = '#221F1A'
const STONE = '#E8E4DC'

/** @param {number} scale 1 = full bleed; smaller keeps clear of a maskable crop. */
function svg(scale) {
  const s = (n) => 256 + (n - 256) * scale
  const r = (n) => n * scale
  const stones = [
    { cx: 256, cy: 372, rx: 132, ry: 46, rot: -2 },
    { cx: 244, cy: 296, rx: 107, ry: 40, rot: 3 },
    { cx: 266, cy: 227, rx: 83, ry: 34, rot: -3 },
    { cx: 249, cy: 169, rx: 59, ry: 27, rot: 2 },
    { cx: 258, cy: 121, rx: 37, ry: 20, rot: -4 },
  ]
    .map(
      ({ cx, cy, rx, ry, rot }) =>
        `<ellipse cx="${s(cx)}" cy="${s(cy)}" rx="${r(rx)}" ry="${r(ry)}" fill="${STONE}" transform="rotate(${rot} ${s(cx)} ${s(cy)})"/>`
    )
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <rect width="512" height="512" fill="${GROUND}"/>
    ${stones}
  </svg>`
}

const full = Buffer.from(svg(1))
// Maskable icons get cropped to a circle; keep the mark inside the safe zone.
const safe = Buffer.from(svg(0.76))

await mkdir('public/icons', { recursive: true })
await writeFile('public/icons/icon.svg', full)

const outputs = [
  ['public/icons/icon-192.png', full, 192],
  ['public/icons/icon-512.png', full, 512],
  ['public/icons/icon-maskable-512.png', safe, 512],
  // iOS applies its own rounded mask and dislikes transparency.
  ['public/icons/apple-touch-icon.png', full, 180],
  ['src/app/icon.png', full, 64],
]

for (const [path, buf, size] of outputs) {
  await sharp(buf).resize(size, size).png().toFile(path)
  console.log('wrote', path)
}
