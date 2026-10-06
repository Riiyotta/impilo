import { gsap, ScrollTrigger, ci, KP, breakpoint } from '../utils'
import { runPage } from './runner'

/* ParallaxOut (spec 0.2): children drift to -40vh while the element's bottom crosses the viewport. */
function parallaxOut(el) {
  gsap.to(el.children, {
    y: () => -KP(40),
    ease: 'linear',
    scrollTrigger: { trigger: el, start: 'bottom bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
  })
}

/* Pin helper (spec 0.2): plain ScrollTrigger pin (native scroll, pinType fixed). */
function pinSection(el, vars) {
  return ScrollTrigger.create({ trigger: el, pin: true, ...vars })
}

/* COMPANY_PAGES_SPEC I motion. */
export function initIntegrationsPage(root) {
  return runPage(root, (root) => {
    const q = (s) => root.querySelector(`[data-anim="${s}"]`)
    const mobile = breakpoint() === 'mobile'
    const touch = window.matchMedia('(hover: none)').matches
    const cleanups = []

    /* I.1 Hero: pinned at its bottom + ParallaxOut */
    const hero = q('int-hero')
    pinSection(hero, { start: 'bottom bottom', end: 'bottom top', pinSpacing: false })
    parallaxOut(hero)

    /* I.2 SDK */
    const sdk = q('int-sdk')
    const cardsWrap = q('int-cards')
    const cards = gsap.utils.toArray(root.querySelectorAll('[data-anim="int-card"]'))
    const n = cards.length
    const last = cards[n - 1]

    // Thermometer: ScrollSmoother data-speed .5 equivalent. Offset = .5 * (scroll - neutral),
    // neutral when its top meets the viewport bottom, clamped at +-(height + vh)/2.
    const thermo = q('int-thermo')
    if (!mobile && thermo) {
      const span = () => thermo.offsetHeight + window.innerHeight
      gsap.fromTo(
        thermo,
        { y: () => -span() / 2 },
        {
          y: () => span() / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: thermo.parentElement,
            start: () => `top bottom+=${span()}`,
            end: () => `top bottom-=${span()}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )
    }

    if (!mobile) {
      // "pin" mode: every card pins at center until the last card is 100vh past center.
      cards.forEach((card, i) => {
        const m = i + 1
        pinSection(card, {
          start: 'center center',
          endTrigger: last,
          end: () => `center center-=${KP(100)}`,
          pinSpacing: false,
        })
        if (card !== last) {
          gsap.to(card, {
            scale: 1 - 0.1 * (n - m),
            yPercent: -11 * (n - m),
            ease: 'power1.inOut',
            scrollTrigger: { trigger: card, start: 'center center', endTrigger: last, end: 'center center', scrub: true },
          })
        }
      })
      gsap.to(cards, {
        y: () => -KP(40),
        ease: 'linear',
        scrollTrigger: { trigger: last, start: 'center center', end: 'center -50%', scrub: true, invalidateOnRefresh: true },
      })
    } else {
      // Mobile (both modes): SDK wrapper pinned at its bottom with ParallaxOut on its children.
      pinSection(sdk, { start: 'bottom bottom', end: 'bottom top', pinSpacing: false })
      parallaxOut(sdk)

      if (touch) {
        // "scroll" mode: horizontal snap carousel. Like the original, the initial position comes from
        // scroll-snap (first card centred), which fires a scroll after the tweens exist.
        const first = cards[0]
        const enters = []
        cards.forEach((card) => {
          const st = { trigger: card, scroller: cardsWrap, horizontal: true, scrub: true }
          const enter = gsap.fromTo(
            card,
            { scale: 0.9, x: -ci(10) },
            { scale: 1, x: 0, ease: 'power3.inOut', scrollTrigger: { ...st, start: 'left right', end: 'center center' } },
          )
          enters.push(enter)
          gsap.fromTo(
            card,
            { scale: 1, x: 0 },
            {
              scale: 0.9,
              x: ci(10),
              ease: 'power3.inOut', // default immediateRender like the original: unreached cards sit at scale 1
              scrollTrigger: { ...st, start: 'center center', end: 'right left' },
            },
          )
        })
        // The exit tweens' immediate render (scale 1) overwrites cards whose enter tween is already
        // part-way at the snapped start position; the original ends up showing the second card at
        // scale ~.92 / x -8, so re-render entered cards at their trigger progress.
        const syncEntered = () =>
          enters.forEach((t) => {
            const p = t.scrollTrigger && t.scrollTrigger.progress
            if (p > 0 && p < 1) t.progress(0, true).progress(p, true) // force a re-render at p
          })
        ScrollTrigger.addEventListener('refresh', syncEntered)
        cleanups.push(() => ScrollTrigger.removeEventListener('refresh', syncEntered))

        // Nudge hint (original): plays when the cards reach the viewport centre, then restarts 3s after
        // each completion until the first card's left edge has gone past the viewport's left (sticky flag).
        let seen = false
        let again = null
        const nudge = gsap
          .timeline({
            scrollTrigger: { trigger: cardsWrap, start: 'top center' },
            onComplete: () => {
              if (!seen) again = gsap.delayedCall(3, () => nudge.restart())
            },
          })
          .to(cardsWrap, { xPercent: -3, scale: 0.98, ease: 'power3.out', duration: 0.2 })
          .to(cardsWrap, { xPercent: 0, scale: 1, ease: 'bounce.out', duration: 0.5 })
        const onScroll = () => {
          if (!seen && first.getBoundingClientRect().left < 0) seen = true
        }
        cardsWrap.addEventListener('scroll', onScroll)
        cleanups.push(() => {
          cardsWrap.removeEventListener('scroll', onScroll)
          again && again.kill()
        })
      }
    }

    /* I.4 Laptop lid opens on scroll (desktop/tablet only) */
    const laptop = q('laptop')
    const top = q('laptop-top')
    if (!mobile && laptop && top) {
      gsap.from(top, {
        rotateX: -80,
        ease: 'linear',
        scrollTrigger: { trigger: laptop, start: 'top bottom', end: 'center center', scrub: 3 },
      })
    }

    return () => cleanups.forEach((fn) => fn())
  })
}
