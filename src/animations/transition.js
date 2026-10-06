import { gsap } from './utils'

/*
 * Page transition "slide" (BLOG_SPEC B3.1, refines CLONE_SPEC 12). Overlay = Transition__Wrapper:
 * fixed full-screen, blue02, z 100, centered pulse svg (168 wide), duration constant 0.5s.
 *
 *  In (covers the old page):
 *    set autoAlpha 1
 *    wrapper fromTo {y: 100lvh, borderRadius "200px 200px 0 0"} -> {y: 0lvh, borderRadius "0px 0px 0 0"}, .5 power3.out
 *    svg     fromTo {y: -100lvh} -> {y: 0lvh}, .5 power3.out
 *    .animate drawSVG "0% 0%" -> "0% 100%", delay .25, duration .45, power3.inOut
 *  Out (after the new page mounts):
 *    wrapper to {y: 100lvh, borderRadius "200px 200px 0 0"}, .5 power3.in
 *    svg     to {y: -100lvh}, .5 power3.in
 *    set autoAlpha 0 at .5
 *
 * GSAP does not parse the `lvh` unit for transforms, so 100lvh is measured from a probe element
 * and passed in px.
 */
export const TRANSITION_DURATION = 0.5

let probe = null
function lvh() {
  if (!probe) {
    probe = document.createElement('div')
    probe.style.cssText =
      'position:fixed;top:0;left:0;width:0;height:100lvh;visibility:hidden;pointer-events:none'
    document.body.append(probe)
  }
  return probe.offsetHeight || window.innerHeight
}

let current = null

export function playTransitionIn(wrap, onCovered) {
  if (!wrap) {
    onCovered && onCovered()
    return
  }
  const svg = wrap.querySelector('svg')
  const path = wrap.querySelector('.animate')
  const h = lvh()
  current && current.kill()
  // Flag read by page intros (whenAnyEnd) so they wait for the overlay to leave.
  window.__impiloTransitioning = true
  const tl = gsap.timeline()
  tl.set(wrap, { autoAlpha: 1 })
    .fromTo(
      wrap,
      { y: h, borderRadius: '200px 200px 0 0' },
      { y: 0, borderRadius: '0px 0px 0 0', duration: TRANSITION_DURATION, ease: 'power3.out' },
      0,
    )
    .fromTo(svg, { y: -h }, { y: 0, duration: TRANSITION_DURATION, ease: 'power3.out' }, 0)
  if (path) tl.fromTo(path, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', delay: 0.25, duration: 0.45, ease: 'power3.inOut' }, 0)
  // Navigation happens at the duration constant (0.5s), while the pulse line is still drawing.
  tl.call(() => onCovered && onCovered(), null, TRANSITION_DURATION)
  current = tl
  return tl
}

export function playTransitionOut(wrap, onDone) {
  if (!wrap) {
    window.__impiloTransitioning = false
    window.dispatchEvent(new CustomEvent('impilo:anyEnd'))
    onDone && onDone()
    return
  }
  const svg = wrap.querySelector('svg')
  const h = lvh()
  const tl = gsap.timeline({
    onComplete: () => {
      window.__impiloTransitioning = false
      window.dispatchEvent(new CustomEvent('impilo:anyEnd'))
      onDone && onDone()
    },
  })
  tl.to(wrap, { y: h, borderRadius: '200px 200px 0 0', duration: TRANSITION_DURATION, ease: 'power3.in' }, 0)
    .to(svg, { y: -h, duration: TRANSITION_DURATION, ease: 'power3.in' }, 0)
    .set(wrap, { autoAlpha: 0 }, TRANSITION_DURATION)
  return tl
}
