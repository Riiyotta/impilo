import { gsap } from '../utils'

/*
 * LineFillText (COMPANY_PAGES_SPEC 0.2): split an element into lines
 * (div.give-me-clipping-please), each with text clipped to its background. The background is
 *   linear-gradient(to right, FILL 0%, FILL p, BASE p, BASE 100%)
 * and p tweens 0% -> 100% per line (stagger .8/N, duration .8/N, linear) on a scrubbed timeline.
 * p is driven through the `--lf-p` custom property so FILL / BASE can stay as color tokens
 * (set via `--lf-fill` / `--lf-base` on the element, see pages.css).
 */
const originals = new WeakMap()

export function splitFillLines(el) {
  if (!originals.has(el)) originals.set(el, el.innerHTML)
  el.innerHTML = originals.get(el)
  const words = el.textContent.replace(/\s+/g, ' ').trim().split(' ')
  // Measure inside a block wrapper: the element itself may be a flex container (about hero box).
  el.innerHTML = ''
  const measure = document.createElement('div')
  el.appendChild(measure)
  const spans = words.map((w) => {
    const s = document.createElement('span')
    s.textContent = w
    s.style.whiteSpace = 'nowrap' // hyphenated words must not break inside the measuring span
    measure.appendChild(s)
    measure.appendChild(document.createTextNode(' '))
    return s
  })
  const threshold = parseFloat(getComputedStyle(el).fontSize) * 0.2
  const lines = []
  let lastTop = -1e9
  spans.forEach((s, i) => {
    const top = s.offsetTop
    if (Math.abs(top - lastTop) > threshold) {
      lines.push([])
      lastTop = top
    }
    lines[lines.length - 1].push(words[i])
  })
  el.innerHTML = ''
  return lines.map((ws) => {
    const div = document.createElement('div')
    div.className = 'give-me-clipping-please'
    div.textContent = ws.join(' ')
    el.appendChild(div)
    return div
  })
}

export function restoreFillLines(el) {
  if (originals.has(el)) el.innerHTML = originals.get(el)
}

export function lineFillTimeline(lines, scrollTrigger) {
  const n = lines.length
  gsap.set(lines, { '--lf-p': '0%' })
  return gsap
    .timeline({ scrollTrigger })
    .to(lines, { '--lf-p': '100%', ease: 'linear', duration: 0.8 / n, stagger: 0.8 / n })
}
