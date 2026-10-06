import { gsap, ScrollTrigger } from './utils'

/*
 * TextAnimation (original module 9056, CLONE_SPEC 0.5).
 *  - multiLine headings ([data-anim="text-lines"]): SplitText(type "lines", linesClass "line-inner"),
 *    then split again into "line-wrapper", giving .line-wrapper > .line-inner per line, each
 *    `display:block; text-align:<computed>; position:relative`. Timeline (paused):
 *      set(wrapper, {opacity: 1}) -> to(lines, {y: 0, stagger: .25})   (default .5s power1.out)
 *  - paragraphs ([data-anim="text-fade"]): to(wrapper, {opacity: 1})   (default .5s power1.out)
 *  - ScrollTrigger { trigger: wrapper, start: "top 75%", onEnter: play }  (plays once)
 * Base state: wrapper opacity 0 (the original's TextAnimation__Wrapper CSS).
 *
 * The clone reproduces the 3.12.5 SplitText line DOM exactly with a small splitter, because
 * SplitText 3.13+ emits a different structure. Played state survives rebuilds/resizes.
 */
const played = new WeakSet()
const originals = new WeakMap()

function splitLines(el) {
  if (!originals.has(el)) originals.set(el, el.innerHTML)
  el.innerHTML = originals.get(el)
  const align = getComputedStyle(el).textAlign
  // Tokenise into words + forced breaks.
  const tokens = []
  const walk = (node) => {
    node.childNodes.forEach((n) => {
      if (n.nodeType === 3) {
        n.nodeValue
          .replace(/\s+/g, ' ')
          .split(' ')
          .filter(Boolean)
          .forEach((w) => tokens.push({ word: w }))
      } else if (n.nodeName === 'BR') tokens.push({ br: true })
      else walk(n)
    })
  }
  walk(el)
  // Measure: render each word in an inline span to read its line (offsetTop).
  el.innerHTML = ''
  const spans = []
  tokens.forEach((t) => {
    if (t.br) {
      el.appendChild(document.createElement('br'))
      spans.push(null)
      return
    }
    const s = document.createElement('span')
    s.textContent = t.word
    // A word must measure as one unit: hyphenated words ("Fast-Growing") may not break inside it.
    s.style.whiteSpace = 'nowrap'
    el.appendChild(s)
    el.appendChild(document.createTextNode(' '))
    spans.push(s)
  })
  const fontSize = parseFloat(getComputedStyle(el).fontSize)
  const threshold = fontSize * 0.2
  const lines = []
  let current = null
  let lastTop = -9999
  tokens.forEach((t, i) => {
    if (t.br) {
      current = null
      lastTop = -9999
      return
    }
    const top = spans[i].offsetTop
    if (!current || Math.abs(top - lastTop) > threshold) {
      current = []
      lines.push(current)
      lastTop = top
    }
    current.push(t.word)
  })
  el.innerHTML = ''
  const style = `display: block; text-align: ${align}; position: relative;`
  const inners = lines.map((words) => {
    const wrapper = document.createElement('div')
    wrapper.className = 'line-wrapper'
    wrapper.style.cssText = style
    const inner = document.createElement('div')
    inner.className = 'line-inner'
    inner.style.cssText = style
    inner.textContent = words.join(' ') + ' '
    wrapper.appendChild(inner)
    el.appendChild(wrapper)
    return inner
  })
  return inners
}

// `attrs` lets route pages use their own data-anim names so a document-wide init never double-splits them.
export function initTextAnimations(root = document, attrs = { lines: 'text-lines', fade: 'text-fade' }) {
  const triggers = []
  const tweens = []
  const multi = Array.from(root.querySelectorAll(`[data-anim="${attrs.lines}"]`))
  const single = Array.from(root.querySelectorAll(`[data-anim="${attrs.fade}"]`))

  const all = [...multi, ...single].sort((a, b) =>
    a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  )
  all.forEach((el) => {
    const isMulti = el.dataset.anim === attrs.lines
    gsap.set(el, { overflow: 'clip' })
    if (isMulti) {
      const lines = splitLines(el)
      if (played.has(el)) {
        gsap.set(el, { opacity: 1 })
        gsap.set(lines, { y: 0 })
        return
      }
      gsap.set(el, { opacity: 0 })
      const tl = gsap.timeline({ paused: true })
      tl.set(el, { opacity: 1 }).to(lines, { y: 0, stagger: 0.25 })
      tweens.push(tl)
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top 75%',
          refreshPriority: -1,
          onEnter: () => {
            played.add(el)
            tl.play()
          },
        }),
      )
    } else {
      if (played.has(el)) {
        gsap.set(el, { opacity: 1 })
        return
      }
      gsap.set(el, { opacity: 0 })
      const tl = gsap.timeline({ paused: true }).to(el, { opacity: 1 })
      tweens.push(tl)
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top 75%',
          refreshPriority: -1,
          onEnter: () => {
            played.add(el)
            tl.play()
          },
        }),
      )
    }
  })

  return () => {
    triggers.forEach((t) => t.kill())
    tweens.forEach((t) => t.kill())
    all.forEach((el) => {
      if (originals.has(el)) el.innerHTML = originals.get(el)
      gsap.set(el, { clearProps: 'opacity,overflow' })
    })
  }
}
