import { gsap, ScrollTrigger, MQ } from './utils'
import { initPreloader } from './preloader'
import { initTextAnimations } from './text'
import { initHero } from './hero'
import { initFocus } from './focus'
import { initHowItWorks } from './howItWorks'
import { initPills, initIntegrations } from './loops'
import { initFooterLines } from './footer'

export { initPageAnimations } from './page'
export { playTransitionIn, playTransitionOut } from './transition'

/*
 * Animation layer entry points.
 *
 *  - initGlobalAnimations(): things that live with the Layout and survive route changes
 *    (preloader, the footer's white-pill pulse, footer PIXI lines). Called once from Layout.
 *  - initHomeAnimations(): homepage-only timelines. Called from pages/Home on mount; its cleanup
 *    reverts every pin/tween so navigating away and back rebuilds the homepage from scratch.
 *  - initPageAnimations(root) (./page.js): generic per-page reveals (pills + TextAnimation) for
 *    other pages.
 *
 * Effect order matters on first load: Layout renders its global-animation hook in a component
 * placed before the page outlet, so the preloader is created before the page's triggers,
 * matching the original single-entry order (preloader -> pills -> sections -> footer).
 */
export function initGlobalAnimations() {
  ScrollTrigger.config({ ignoreMobileResize: true })
  const disposePreloader = initPreloader()
  const footer = document.querySelector('[data-anim="footer"]')
  const disposeFooterPill = footer ? initPills(footer) : () => {}
  const disposeFooter = initFooterLines()
  return () => {
    disposeFooter()
    disposeFooterPill()
    disposePreloader()
  }
}

/*
 * Homepage (called from pages/Home useLayoutEffect; returns a full cleanup).
 *
 * Scroll-driven sections are built inside one gsap.context in document order (hero -> focus ->
 * how it works -> text reveals), mirroring the original's effect order so pin spacing resolves the
 * same way. Like the original's `recreateOnResize`, that context is reverted and rebuilt when the
 * viewport width changes (breakpoints, ci() and Flip measurements all depend on it).
 * Native scroll is used; the original's ScrollSmoother runs at smooth 0.01 (effectively native).
 */
export function initHomeAnimations() {
  // The original's trigger list is ordered by start after refresh, so when several scrubbed tweens
  // touch the same property (image-part fade in/out, soft-pin drifts) the later range renders last.
  // (3.12.5 sorted by refreshPriority then start; 3.13+ sorts by trigger element position by default.)
  const prio = (t) => (t.vars.refreshPriority || 0) * -1e6
  const sortTriggers = () => ScrollTrigger.sort((a, b) => prio(a) + a.start - (b.start + prio(b)))
  ScrollTrigger.addEventListener('refresh', sortTriggers)
  const main = document.querySelector('main') || document
  const disposePills = initPills(main)
  const disposeIntegrations = initIntegrations()

  let ctx = null
  let disposeText = null
  let listeners = []
  let built = false
  const build = () => {
    built = true
    listeners = []
    ctx = gsap.context(() => {
      initHero(listeners)
      initFocus()
      initHowItWorks()
    })
    disposeText = initTextAnimations(main)
    ScrollTrigger.refresh()
  }
  const destroy = () => {
    if (!built) return
    built = false
    disposeText && disposeText()
    listeners.forEach((fn) => fn())
    ctx && ctx.revert()
  }

  build()
  // Fonts change line breaks and heights: rebuild once they are ready (still under the preloader).
  let fontsDone = false
  document.fonts &&
    document.fonts.ready.then(() => {
      if (fontsDone) return
      fontsDone = true
      destroy()
      build()
    })

  let lastW = window.innerWidth
  let timer = 0
  const onResize = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (built && window.innerWidth === lastW) return
      lastW = window.innerWidth
      const y = window.scrollY
      destroy()
      build()
      window.scrollTo(0, y)
    }, 200)
  }
  window.addEventListener('resize', onResize)
  // Crossing a breakpoint makes React swap markup (e.g. Hero drops ZoomTo on mobile). Pins wrap
  // elements in pin-spacers, so revert synchronously in the media-query change event -- before
  // React's batched re-render -- and rebuild after it (debounced resize above).
  const mqls = Object.values(MQ).map((q) => window.matchMedia(q))
  const onBreakpoint = () => {
    destroy()
    onResize()
  }
  mqls.forEach((m) => m.addEventListener('change', onBreakpoint))

  return () => {
    fontsDone = true
    clearTimeout(timer)
    window.removeEventListener('resize', onResize)
    mqls.forEach((m) => m.removeEventListener('change', onBreakpoint))
    ScrollTrigger.removeEventListener('refresh', sortTriggers)
    destroy()
    disposeIntegrations()
    disposePills()
  }
}
