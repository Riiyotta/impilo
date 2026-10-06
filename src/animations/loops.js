import { gsap } from './utils'

/*
 * Pill pulse (original module Pill, CLONE_SPEC 0.5):
 *   timeline({repeat: -1})
 *     .from("path", {clipPath: "inset(0% 100% 0% 0%)"})            // .5s power1.out
 *     .to("path", {clipPath: "inset(0% 0% 0% 100%)", delay: 3})     // .5s power1.out after a 3s hold
 * Runs on every Pill inside `root`, including the footer's white pill. The Layout scopes it to the
 * footer; each page scopes it to its own content so pills are rebuilt on route mount.
 */
export function initPills(root = document) {
  const ctx = gsap.context(() => {
    root.querySelectorAll('[data-anim="pill"], [data-anim="footer-white-pill"]').forEach((pill) => {
      const paths = pill.querySelectorAll('path')
      gsap
        .timeline({ repeat: -1 })
        .from(paths, { clipPath: 'inset(0% 100% 0% 0%)' })
        .to(paths, { clipPath: 'inset(0% 0% 0% 100%)', delay: 3 })
    })
  })
  return () => ctx.revert()
}

/*
 * Integrations illustrations (original `qi`, CLONE_SPEC 9). Always running, not scroll-gated.
 * For the i-th .layer-1 / .layer-2 across the cards:
 *   fromTo({yPercent: -4}, {yPercent: 4, yoyo, repeat -1, power2.inOut, duration 5,
 *          delay: layer-1 i*5*.3 (= 1.5i), layer-2 .4*5 + i*5*.3 (= 2 + 1.5i)})
 */
export function initIntegrations() {
  const ctx = gsap.context(() => {
    const svgs = Array.from(document.querySelectorAll('[data-anim="integration-illustration"]'))
    if (!svgs.length) return
    const scope = svgs[0].parentElement.parentElement
    const l1 = Array.from(scope.querySelectorAll('.layer-1'))
    const l2 = Array.from(scope.querySelectorAll('.layer-2'))
    const A = 4
    const D = 5
    l1.forEach((el, i) => {
      gsap.fromTo(el, { yPercent: -A }, { yPercent: A, yoyo: true, ease: 'power2.inOut', repeat: -1, duration: D, delay: i * D * 0.3 })
      if (l2[i])
        gsap.fromTo(l2[i], { yPercent: -A }, { yPercent: A, yoyo: true, ease: 'power2.inOut', repeat: -1, duration: D, delay: 0.4 * D + i * D * 0.3 })
    })
  })
  return () => ctx.revert()
}
