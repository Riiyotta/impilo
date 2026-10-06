import { gsap, ScrollTrigger, ci } from './utils'
import { animatedPaths } from './paths'

/*
 * Preloader (original module 5281 + Preloader component, CLONE_SPEC 0.7).
 *
 * Progress is time-based: p = (now - S) / (2S + 1000) * 100, where S is performance.now() when
 * the bundle evaluated (config.getTimeNeeded = 2*e + 1000). Once p >= 99 and the page has loaded,
 * progress jumps to 100 (shown as "99"), and 250ms later the exit callbacks run:
 *   wrapper  yPercent 120, borderRadius "100px 100px 0 0", delay .25, 1s power3.inOut
 *   content  y ci(400), 1s power3.inOut; opacity 0, .5s power1.inOut
 *   wrapper  autoAlpha 0 at 1s
 * After max(duration)*1000 + 10ms ScrollTrigger.refresh() runs and scrolling is released
 * (the original keeps ScrollSmoother paused until then).
 */
const S = performance.now()
const E = 2 * S + 1000
let state = 'loading'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const pageLoaded = () =>
  Promise.all([
    document.readyState === 'complete' ? null : new Promise((r) => window.addEventListener('load', r, { once: true })),
    document.fonts ? document.fonts.ready : null,
  ])

const block = (e) => e.preventDefault()
const blockKeys = (e) => {
  if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar'].includes(e.key)) e.preventDefault()
}
function lockScroll(on) {
  const m = on ? 'addEventListener' : 'removeEventListener'
  window[m]('wheel', block, { passive: false })
  window[m]('touchmove', block, { passive: false })
  window[m]('keydown', blockKeys)
}

export function initPreloader() {
  const wrap = document.querySelector('[data-anim="preloader"]')
  if (!wrap) return () => {}
  const content = wrap.querySelector('[data-anim="preloader-content"]')
  const counter = wrap.querySelector('[data-anim="preloader-counter"]')
  const graphic = wrap.querySelector('[data-anim="preloader-graphic"]')

  if (state === 'complete') {
    gsap.set(wrap, { autoAlpha: 0 })
    return () => {}
  }

  let alive = true
  let raf = 0
  const ctx = gsap.context(() => {
    animatedPaths(graphic, { selector: '.animate', lineSpeed: [300, 300], lineLength: [30, 30] })
  })
  lockScroll(true)

  const show = (p) => {
    const txt = p.toFixed(0).padStart(2, '0')
    counter.textContent = txt === '100' ? '99' : txt
  }

  const finish = async () => {
    if (!alive || state !== 'loading') return
    state = 'canStillAnimate'
    show(100)
    await wait(250)
    if (!alive) return
    state = 'complete'
    const children = content ? [content] : Array.from(wrap.children)
    gsap.to(wrap, { ease: 'power3.inOut', yPercent: 120, borderRadius: '100px 100px 0 0', delay: 0.25, duration: 1 })
    gsap.to(children, { ease: 'power3.inOut', y: ci(400), duration: 1 })
    gsap.to(children, { ease: 'power1.inOut', duration: 0.5, opacity: 0 })
    gsap.set(wrap, { autoAlpha: 0, delay: 1 })
    await wait(1000 * 1 + 10)
    requestAnimationFrame(() => ScrollTrigger.refresh())
    lockScroll(false)
    window.dispatchEvent(new CustomEvent('impilo:initialEnd'))
  }

  const tick = () => {
    if (!alive || state !== 'loading') return
    const p = ((performance.now() - S) / E) * 100
    if (p >= 99) {
      pageLoaded().then(finish, finish)
      return
    }
    show(p)
    raf = requestAnimationFrame(tick)
  }
  tick()
  // Fallback: the original forces completion 5s after load.
  pageLoaded().then(() => wait(5000)).then(finish)

  return () => {
    alive = false
    cancelAnimationFrame(raf)
    lockScroll(false)
    if (state !== 'complete') {
      state = 'loading'
      ctx.revert()
    }
  }
}
