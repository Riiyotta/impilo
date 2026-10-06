import { gsap, ScrollTrigger, MQ, canHover, ci } from '../utils'
import { animatedPaths } from '../paths'
import { initPageAnimations } from '../page'
import { whenAnyEnd } from './runner'

/*
 * /solutions/ motion (specs/SOLUTIONS_USECASES_SPEC.md section 1). Native scroll, pinType fixed.
 * Called from SolutionsOverview's useLayoutEffect; everything is scoped to `root` and reverted by
 * the returned cleanup (route change). Breakpoint-dependent pieces live in a gsap.matchMedia so
 * they rebuild when the viewport crosses 500 / 1024.
 */

/* 1.0 Stacked sections: pin at "bottom bottom" (no spacing) + content drifts up 40vh while covered. */
function stackedSection(section, targets) {
  ScrollTrigger.create({ trigger: section, pin: true, start: 'bottom bottom', end: 'bottom top', pinSpacing: false })
  gsap.to(targets, {
    y: () => -0.4 * window.innerHeight,
    ease: 'linear',
    scrollTrigger: { trigger: section, start: 'bottom bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
  })
}

/* 1.1 Hero intro timeline (played on preloader end) + idle bob. */
function heroIntro(root, ctx, cleanups) {
  const ills = Array.from(root.querySelectorAll('[data-sol="hero-ills"] .illustration'))
  const illWrap = root.querySelector('[data-sol="hero-ills"]')
  const widgets = Array.from(root.querySelectorAll('[data-sol="hero"] .widget')).filter((el) => el.getClientRects().length)
  const weight = root.querySelector('[data-sol="weight"]')
  const graphLine = root.querySelector('[data-sol="hero"] #graph-line')
  const q = (s) => weight.querySelectorAll(s)

  const startBob = () =>
    ctx.add(() => {
      const tweens = gsap.utils.shuffle([...ills]).map((el, i) =>
        gsap.to(el, {
          yPercent: el.classList.contains('hero-pill') ? -10 : -5,
          duration: 5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.5,
          paused: true,
        }),
      )
      ScrollTrigger.create({
        trigger: illWrap,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => tweens.forEach((t) => (self.isActive ? t.resume() : t.pause())),
        onRefresh: (self) => self.isActive && tweens.forEach((t) => t.resume()),
      })
    })

  const from = { opacity: 0, y: 100 }
  const to = { opacity: 1, y: 0, duration: 1.5 }
  const tl = gsap.timeline({ paused: true })
  tl.fromTo(ills, from, { ...to, ease: 'power2.out', stagger: { from: 'random', each: 0.025 }, onComplete: startBob }, 0)
  if (widgets.length) {
    tl.fromTo(widgets, from, { ...to, ease: 'power3.out', stagger: { from: 'start', each: 0.35 } }, 0.75)
    tl.fromTo(weight, from, { ...to, ease: 'power3.out', delay: 1.05 }, 0.75)
    // Position not given by the spec: drawn while the readings card (4th widget) rises in.
    if (graphLine) tl.from(graphLine, { drawSVG: 0, duration: 1.5 }, 0.75 + 3 * 0.35)
    tl.to(q('.hundreds'), { yPercent: -100, duration: 1.25, ease: 'power2.inOut' }, 2.3)
    tl.to(q('.tens'), { yPercent: -100, duration: 1.25, ease: 'power2.inOut' }, 2.3)
    tl.to(q('.tens'), { yPercent: -200, duration: 1.25, ease: 'power2.inOut' }, 3.5)
    tl.to(q('.ones'), { yPercent: -2200, duration: 5, ease: 'power2.inOut' }, 0.5)
    tl.to(q('.ones'), { x: ci(-10), duration: 1.5 }, 4.15)
    tl.to(q('.tens'), { x: ci(-5), duration: 1.5 }, 3)
  }

  // "anyEnd": after the preloader exit or the page-transition overlay leaves.
  cleanups.push(whenAnyEnd(() => tl.play()))
}

/* 1.2 Explore art: mouse parallax on .layer-2 (+-2px) / .layer-3 (+-6px); fake pointer on no-hover devices. */
function exploreParallax(root, cleanups) {
  const wrap = root.querySelector('[data-sol="explore-ills"]')
  const l2 = wrap.querySelectorAll('.layer-2')
  const l3 = wrap.querySelectorAll('.layer-3')
  const move = (cx, cy, duration = 1) => {
    const nx = cx / window.innerWidth - 0.5
    const ny = cy / window.innerHeight - 0.5
    gsap.to(l2, { x: nx * 4, y: ny * 4, ease: 'power3.out', duration, willChange: 'transform', overwrite: 'auto' })
    gsap.to(l3, { x: nx * 12, y: ny * 12, ease: 'power3.out', duration, willChange: 'transform', overwrite: 'auto' })
  }
  if (canHover()) {
    const onMove = (e) => move(e.clientX, e.clientY)
    window.addEventListener('mousemove', onMove)
    cleanups.push(() => window.removeEventListener('mousemove', onMove))
  } else {
    const pointer = { x: window.innerWidth / 2, y: -window.innerHeight }
    gsap.to(pointer, {
      y: 3 * window.innerHeight,
      duration: 8,
      ease: 'power3.inOut',
      yoyo: true,
      repeat: -1,
      onUpdate: () => move(pointer.x, pointer.y, 0),
    })
  }
}

/* 1.2 Cart hover bounce (box 4). Original binds mouseenter on the cart <svg> only; bounce = 20 design px. */
function cartBounce(root, cleanups) {
  const box = root.querySelector('[data-sol="cart-box"]')
  if (!box) return
  const art = box.querySelector('svg')
  const tl = gsap.timeline({ paused: true })
  tl.to(box.querySelector('.cart'), { y: () => -ci(20), duration: 0.2, ease: 'power1.out' }, 0)
    .to(box.querySelector('.cart'), { y: 0, duration: 0.2, ease: 'power1.in' }, 0.2)
    .to(box.querySelectorAll('.box'), { y: () => -ci(20), duration: 0.2, ease: 'power1.out' }, 0)
    .to(box.querySelector('.box-1'), { y: 0, ease: 'bounce.out', duration: 0.8 }, 0.2)
    .to(box.querySelector('.box-2'), { y: 0, ease: 'bounce.out', duration: 0.8 }, 0.25)
    .to(box.querySelector('.box-3'), { y: 0, ease: 'bounce.out', duration: 0.8 }, 0.3)
  if (canHover()) {
    const onEnter = () => {
      if (tl.progress() === 0) tl.play()
      if (tl.progress() === 1) tl.restart()
    }
    art.addEventListener('mouseenter', onEnter)
    cleanups.push(() => art.removeEventListener('mouseenter', onEnter))
  } else {
    ScrollTrigger.create({ trigger: box, start: 'center center', animation: tl, toggleActions: 'restart none none none' })
  }
}

/* 1.3 Support cards, desktop/tablet: pin at centre, earlier cards shrink + step up, stack drifts away. */
function supportPinnedCards(root) {
  const cards = Array.from(root.querySelectorAll('.sol-support__card'))
  const n = cards.length
  const last = cards[n - 1]
  cards.forEach((card, idx) => {
    const i = idx + 1
    ScrollTrigger.create({
      trigger: card,
      pin: true,
      start: 'center center',
      endTrigger: last,
      end: () => 'center center-=' + window.innerHeight,
      pinSpacing: false,
    })
    if (i < n)
      gsap.to(card, {
        scale: 1 - 0.1 * (n - i),
        yPercent: -11 * (n - i),
        ease: 'power1.inOut',
        scrollTrigger: { trigger: card, start: 'center center', endTrigger: last, end: 'center center', scrub: true },
      })
    gsap.to(card, {
      y: () => -0.4 * window.innerHeight,
      ease: 'linear',
      scrollTrigger: { trigger: last, start: 'center center', end: 'center -50%', scrub: true, invalidateOnRefresh: true },
    })
  })
}

/* 1.3 Support cards, touch mobile: horizontal scale/x scrub per card + nudge hint (re-runs 3s after each completion). */
function supportTouchCarousel(root, ctx, cleanups) {
  const scroller = root.querySelector('[data-sol="support-cards"]')
  const cards = Array.from(scroller.children)
  // Original creates the "in" (left right -> center center) then the "out" (center center -> right left)
  // fromTo with default immediateRender, inside a batch refresh: cards still off to the right end up at
  // scale 1 / x 0 (the "out" tween's immediate render) while the partly visible next card shows its scrubbed
  // "in" state (0.92). With per-trigger refreshes the same end state needs the "out" tween first and the
  // "in" tween with immediateRender:false (it then only renders when its trigger is active).
  cards.forEach((card) => {
    gsap.fromTo(
      card,
      { scale: 1, x: 0 },
      {
        scale: 0.9,
        x: () => ci(10),
        ease: 'power3.inOut',
        scrollTrigger: { trigger: card, scroller, horizontal: true, start: 'center center', end: 'right left', scrub: true },
      },
    )
    gsap.fromTo(
      card,
      { scale: 0.9, x: () => ci(-10) },
      {
        scale: 1,
        x: 0,
        ease: 'power3.inOut',
        immediateRender: false,
        scrollTrigger: { trigger: card, scroller, horizontal: true, start: 'left right', end: 'center center', scrub: true },
      },
    )
  })
  // Nudge hint (original): plays when the cards reach "top center"; each completion schedules a restart
  // 3s later (period 0.7s + 3s) until the user has scrolled the first card off the left edge (sticky flag).
  let userHasScrolled = false
  let call = null
  const nudge = gsap
    .timeline({
      paused: true,
      onComplete: () =>
        ctx.add(() => {
          if (!userHasScrolled) call = gsap.delayedCall(3, () => nudge.restart())
        }),
    })
    .to(scroller, { xPercent: -3, scale: 0.98, duration: 0.2, ease: 'power3.out' })
    .to(scroller, { xPercent: 0, scale: 1, duration: 0.5, ease: 'bounce.out' })
  ScrollTrigger.create({ trigger: scroller, start: 'top center', onEnter: () => nudge.play() })
  const onScroll = () => {
    if (!userHasScrolled && cards[0].getBoundingClientRect().left < 0) userHasScrolled = true
  }
  scroller.addEventListener('scroll', onScroll, { passive: true })
  cleanups.push(() => {
    scroller.removeEventListener('scroll', onScroll)
    call && call.kill()
  })
}

/*
 * 1.3 Thermo: ScrollSmoother data-speed 0.5 (measured on the original, 1440x900 and 768x1024):
 * y = 0.5 * (scroll - s0), s0 = scroll at which the thermo's natural top meets the viewport bottom,
 * clamped to +-A with A = (thermoHeight + vh) / 2 (1440: (817 + 900) / 2 = 858.5; 768: 818.4).
 * The linear phase therefore spans s0 - 2A .. s0 + 2A.
 */
function thermoParallax(root) {
  const section = root.querySelector('[data-sol="support"]')
  const thermo = root.querySelector('[data-sol="thermo"]')
  const amp = () => (thermo.offsetHeight + window.innerHeight) / 2
  const at = (d) => (d < 0 ? `top-=${-d} bottom` : `top+=${d} bottom`)
  gsap.fromTo(
    thermo,
    { y: () => -amp() },
    {
      y: () => amp(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        // section "top bottom" = s0 - offsetTop; linear phase = s0 +- 2A
        start: () => at(thermo.offsetTop - 2 * amp()),
        end: () => at(thermo.offsetTop + 2 * amp()),
        scrub: true,
        invalidateOnRefresh: true,
      },
    },
  )
}

export function initSolutions(root) {
  if (!root) return () => {}
  const cleanups = []
  const hero = root.querySelector('[data-sol="hero"]')
  const explore = root.querySelector('[data-sol="explore"]')
  const support = root.querySelector('[data-sol="support"]')

  const ctx = gsap.context((self) => {
    heroIntro(root, self, cleanups)
    exploreParallax(root, cleanups)
    cartBounce(root, cleanups)
  }, root)

  const mm = gsap.matchMedia(root)
  mm.add(
    { isDesktop: MQ.desktop, isTablet: MQ.tablet, isMobile: MQ.mobile, hover: '(hover: hover)' },
    (mctx) => {
      const { isDesktop, isTablet, isMobile, hover } = mctx.conditions
      const local = []
      // Document order: hero pin, explore pin, support, laptop.
      stackedSection(hero, root.querySelector('[data-sol="hero-inner"]'))
      animatedPaths(root.querySelector('[data-sol="wide-pulse"]'), {
        selector: '.animate',
        lineLength: [ci(150), ci(150)],
        lineSpeed: isDesktop ? [2000, 2000] : isTablet ? [1800, 1800] : [1500, 1500],
      })
      stackedSection(explore, Array.from(explore.children))
      if (isMobile) {
        stackedSection(support, Array.from(support.children))
        if (!hover) supportTouchCarousel(root, mctx, local)
      } else {
        supportPinnedCards(root)
        thermoParallax(root)
        gsap.from(root.querySelector('[data-sol="laptop-top"]'), {
          rotateX: -80,
          ease: 'linear',
          scrollTrigger: { trigger: root.querySelector('[data-sol="laptop"]'), start: 'top bottom', end: 'center center', scrub: 3 },
        })
      }
      return () => local.forEach((fn) => fn())
    },
  )

  // TextAnimation reveals + pills, after the pins (homepage order), with font/resize rebuilds.
  const disposePage = initPageAnimations(root)
  ScrollTrigger.refresh()

  return () => {
    disposePage()
    mm.revert()
    ctx.revert()
    cleanups.forEach((fn) => fn())
  }
}
