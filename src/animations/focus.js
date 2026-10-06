import { gsap, ScrollTrigger, ci, breakpoint } from './utils'

/*
 * ConstantMarquee (original `Kc`, timing 10, not reversed; CLONE_SPEC 3).
 * Copies are laid side by side (x = i * itemWidth), then all move x "-=itemWidth" over 10s linear,
 * wrapped by a modifier (x < -itemWidth -> x + itemWidth * copies) and restarted on complete.
 * Plays only in view: { start "top bottom", end "bottom top", toggleActions "play pause resume pause" }.
 */
function marquee(el, timing = 10) {
  const children = Array.from(el.children)
  const w = children[0] ? children[0].clientWidth : 0
  if (!w) return
  const n = children.length
  gsap.set(children, { x: (i) => i * w })
  const tween = gsap.to(children, {
    duration: timing,
    ease: 'none',
    x: `-=${w}`,
    scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', toggleActions: 'play pause resume pause' },
    modifiers: { x: gsap.utils.unitize((x) => (x < -w ? x + w * n : x)) },
    onComplete: () => {
      tween.invalidate()
      tween.restart()
    },
  })
}

/*
 * Focus (original `Jc`), >= 501px only:
 *  - Request Demo ButtonWrapper pinned { trigger: section, start: "center top+=ci(76)",
 *    end: "bottom+=" + 8*innerHeight, scrub: true, pinSpacing: false, anticipatePin: 1 }:
 *      to(wrapper, { x: body.clientWidth - rect.x - rect.width - ci(44), y: 0, duration 1, power1.inOut }, 0)
 *      to(wrapper, { duration: 9, y: 0 }, 1)   // hold
 *  - White panel: fromTo(BottomInner, {height: "45%"}, {height: "100%", ease: "power1.out"}) on
 *    { trigger: BottomInner, start: "clamp(top bottom)", endTrigger: section, end: "bottom bottom",
 *      scrub: true, onLeave: refresh the button trigger }.
 */
export function initFocus() {
  const section = document.querySelector('[data-anim="focus"]')
  if (!section) return
  const m = section.querySelector('[data-anim="focus-marquee"]')
  if (m && m.offsetParent !== null) marquee(m, 10)

  if (breakpoint() === 'mobile') return
  const panel = section.querySelector('[data-anim="focus-panel"]')
  const btn = section.querySelector('[data-anim="focus-demo-pin"]')

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: () => `center top+=${ci(76)}`,
      scrub: true,
      pin: btn,
      pinSpacing: false,
      end: `bottom+=${8 * window.innerHeight}`,
      anticipatePin: 1,
    },
  })
  tl.to(
    btn,
    {
      x: () => {
        const r = btn.getBoundingClientRect()
        return document.body.clientWidth - r.x - r.width - ci(44)
      },
      y: 0,
      duration: 1,
      ease: 'power1.inOut',
    },
    0,
  ).to(btn, { duration: 9, y: 0 }, 1)

  gsap
    .timeline({
      scrollTrigger: {
        trigger: panel,
        start: 'clamp(top bottom)',
        endTrigger: section,
        end: 'bottom bottom',
        scrub: true,
        onLeave: () => tl.scrollTrigger && tl.scrollTrigger.refresh(),
      },
    })
    .fromTo(panel, { height: '45%' }, { height: '100%', ease: 'power1.out' })
}

export { ScrollTrigger }
