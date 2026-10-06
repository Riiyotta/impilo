import { gsap, ScrollTrigger, MQ } from '../utils'
import { initTextAnimations } from '../text'

/*
 * Shared lifecycle for route pages (About, Integrations, Request Demo, Legal, 404).
 *
 * - Everything is created inside one gsap.context scoped to the page root, so route changes
 *   revert pins, tweens and inline styles.
 * - Text reveals use page-local data-anim names ("page-text-lines" / "page-text-fade") and
 *   pills use "page-pill", so a document-wide init in the shared layout never doubles them up.
 * - Like the homepage's `recreateOnResize`, scroll-driven work is rebuilt when the viewport
 *   width changes or a breakpoint is crossed (ci(), pins and layouts all depend on width).
 *
 * build(root, state) may return a cleanup function. `state` persists across rebuilds
 * (e.g. so a one-shot entrance does not replay after a resize).
 */
export const PAGE_TEXT_ATTRS = { lines: 'page-text-lines', fade: 'page-text-fade' }

/*
 * "anyEnd" (spec 0.1): fires when the preloader or page transition finishes. The preloader
 * dispatches `impilo:initialEnd`; a router transition may dispatch `impilo:anyEnd`.
 * If no preloader is currently showing, the callback runs on the next frame.
 */
export function whenAnyEnd(cb) {
  const pre = document.querySelector('[data-anim="preloader"]')
  const showing =
    window.__impiloTransitioning ||
    (pre && getComputedStyle(pre).visibility !== 'hidden' && getComputedStyle(pre).opacity !== '0')
  if (!showing) {
    const raf = requestAnimationFrame(cb)
    return () => cancelAnimationFrame(raf)
  }
  let done = false
  const fire = () => {
    if (done) return
    done = true
    off()
    cb()
  }
  const off = () => {
    window.removeEventListener('impilo:initialEnd', fire)
    window.removeEventListener('impilo:anyEnd', fire)
  }
  window.addEventListener('impilo:initialEnd', fire)
  window.addEventListener('impilo:anyEnd', fire)
  return off
}

/* CLONE_SPEC 0.5 Pill loop, scoped to the page. */
function initPagePills(root) {
  root.querySelectorAll('[data-anim="page-pill"]').forEach((pill) => {
    const paths = pill.querySelectorAll('path')
    gsap
      .timeline({ repeat: -1 })
      .from(paths, { clipPath: 'inset(0% 100% 0% 0%)' })
      .to(paths, { clipPath: 'inset(0% 0% 0% 100%)', delay: 3 })
  })
}

export function runPage(root, build = () => {}) {
  if (!root) return () => {}
  const state = {}
  // Pills are not scroll-dependent: one context for the page lifetime.
  const pillCtx = gsap.context(() => initPagePills(root), root)

  let ctx = null
  let disposeText = null
  let disposeBuild = null
  let built = false
  // state.reason tells build() why it runs: 'init' | 'fonts' | 'resize' (the original only
  // recreates on resize, so one-shot entrances replay there but not on the clone-only font rebuild).
  const create = (reason = 'resize') => {
    state.reason = reason
    built = true
    ctx = gsap.context(() => {
      disposeBuild = build(root, state) || null
    }, root)
    disposeText = initTextAnimations(root, PAGE_TEXT_ATTRS)
    ScrollTrigger.refresh()
  }
  const destroy = () => {
    if (!built) return
    built = false
    disposeText && disposeText()
    disposeBuild && disposeBuild()
    ctx && ctx.revert()
    disposeText = disposeBuild = ctx = null
  }

  create('init')
  let alive = true
  document.fonts &&
    document.fonts.ready.then(() => {
      if (!alive) return
      destroy()
      create('fonts')
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
      create()
      window.scrollTo(0, y)
    }, 200)
  }
  window.addEventListener('resize', onResize)
  const mqls = Object.values(MQ).map((q) => window.matchMedia(q))
  const onBreakpoint = () => {
    destroy()
    onResize()
  }
  mqls.forEach((m) => m.addEventListener('change', onBreakpoint))

  return () => {
    alive = false
    clearTimeout(timer)
    window.removeEventListener('resize', onResize)
    mqls.forEach((m) => m.removeEventListener('change', onBreakpoint))
    destroy()
    pillCtx.revert()
    state.dispose && state.dispose()
  }
}
