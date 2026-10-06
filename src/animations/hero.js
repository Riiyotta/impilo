import { gsap, Flip, ci, breakpoint, canHover, softPin } from './utils'
import { animatedPaths } from './paths'

/*
 * Interface counter + chart lines (original `kc`, CLONE_SPEC 2.3). Scoped to the interface wrapper.
 * Two timelines, each { trigger: interface, start "center center", end "center top",
 * toggleActions "play none none reverse" }.
 */
function interfaceTimelines(iface) {
  const q = gsap.utils.selector(iface)
  const st = () => ({ trigger: iface, start: 'center center', end: 'center top', toggleActions: 'play none none reverse' })
  const lines = gsap.timeline({ scrollTrigger: st() })
  lines
    .from(q('.top-animated-line'), { clipPath: 'inset(0 100% 0 0)', duration: 2, ease: 'power2.inOut' })
    .from(q('.bottom-animated-line'), { clipPath: 'inset(0 100% 0 0)', duration: 2, ease: 'power2.inOut' }, 0.3)

  const wc = 0.5
  const c = gsap.timeline({ scrollTrigger: st() })
  c.timeScale(0.75)
  c.to(q('.tens.left'), { yPercent: -100, duration: 0.4, ease: 'power2.inOut' }, 0.5)
    .to(q('.tens.left'), { yPercent: -200, duration: 0.4, ease: 'power2.inOut' }, 1)
    .to(q('.ones.left'), { x: ci(8.5) }, 0.5)
    .to(q('.slash'), { x: ci(2) }, 0.5)
    .to(q('.ones.left'), { yPercent: -1400, duration: 1.4, ease: 'power2.inOut' }, 0.2)
    .to(q('.tens.right'), { yPercent: -100, duration: 0.5, ease: 'power2.inOut' }, 0.65 + wc)
    .to(q('.ones.right'), { yPercent: -1100, duration: 1.5, ease: 'power2.inOut' }, 0 + wc)
    .to(q('.tens.right'), { x: ci(2) }, 0.5 + wc)
    .to(q('.ones.right'), { x: ci(5.5) }, 0.5 + wc)
}

/*
 * Zoom-pin (original ZoomPinProvider `vc`, CLONE_SPEC 2.2):
 *  - ZoomTo's inner element is offset so its centre sits on ZoomFrom's centre, Flip-fitted onto
 *    ZoomFrom, then Flip.fit back to its natural state with
 *    { scale: true, duration: 1, ease: "power2.inOut",
 *      scrollTrigger: { trigger: ZoomFrom, start: "center-=ci(400) center",
 *                       endTrigger: ZoomTo, end: "center+=ci(200) center", scrub: 1 } }
 *  - ZoomTo is soft-pinned { trigger: ZoomFrom, start: "center center", endTrigger: ZoomTo,
 *    end: "center center", pinSpacing: false, smoothLevel: min(200, |dh|/4) }.
 */
function zoomPin(fromEl, pin, driftEl, toEl) {
  gsap.set([fromEl, toEl], { clearProps: 'transform', willChange: 'transform' })
  const dy = fromEl.getBoundingClientRect().top - toEl.getBoundingClientRect().top
  const dh = fromEl.clientHeight - toEl.clientHeight
  gsap.set(toEl, { y: dy + dh / 2 })
  const state = Flip.getState(toEl)
  Flip.fit(toEl, fromEl, { scale: true })
  Flip.fit(toEl, state, {
    scale: true,
    duration: 1,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: fromEl,
      start: `center-=${ci(400)} center`,
      endTrigger: pin,
      end: `center+=${ci(200)} center`,
      scrub: 1,
    },
  })
  softPin({
    trigger: fromEl,
    start: 'center center',
    endTrigger: pin,
    end: 'center center',
    pin,
    pinSpacing: false,
    smoothLevel: Math.min(200, Math.abs(dh) / 4),
    driftTarget: driftEl,
  })
}

/*
 * Hero (original `Cc`). Runs inside the caller's gsap.context.
 */
export function initHero(cleanups) {
  const root = document.querySelector('[data-anim="hero-zoom-parent"]')
  if (!root) return
  const hero = root.querySelector('[data-anim="hero"]')
  const illustration = root.querySelector('[data-anim="hero-illustration"]')
  const bp = breakpoint()
  const zoomEnabled = bp !== 'mobile'

  // 1. Interface counter + lines (child component: created first in the original).
  root.querySelectorAll('[data-anim="hero-interface"]').forEach(interfaceTimelines)

  // 2. Illustration travellers: AnimatedPaths wraps the Hero__Wrapper.
  animatedPaths(hero, {
    selector: '.animate',
    lineLength: [50, 150],
    lineRange: bp === 'mobile' ? [0.16, 0.66] : bp === 'tablet' ? [0.2, 0.8] : [0.2, 0.7],
  })

  // 3. Zoom-pin (ZoomTo only exists >= 501px).
  const fromEl = root.querySelector('[data-anim="hero-zoom-from"]')
  const pin = root.querySelector('[data-anim="hero-zoom-to"]')
  if (zoomEnabled && fromEl && pin) {
    const driftEl = pin.querySelector('[data-anim="hero-zoom-drift"]')
    const toEl = pin.querySelector('[data-anim="hero-zoom-el"]')
    zoomPin(fromEl, pin, driftEl, toEl)
  }

  // 4. Fade: to([Illustration, Hero__Wrapper], {opacity: 0}) triggered by the interface svg.
  if (zoomEnabled && pin) {
    const svg = pin.querySelector('.interface__svg')
    gsap.to([illustration, hero], {
      opacity: 0,
      scrollTrigger: { trigger: svg, start: 'clamp(center center+=400px)', end: 'center center', scrub: 0.5 },
    })
  }

  // 5. Mouse parallax: .stetho +-2, .thermo +-4, .watch +-6, .pills +-8 px; 1s power3.out.
  const q = gsap.utils.selector(root)
  const hover = canHover()
  const vars = { ease: 'power3.out', duration: hover ? 1 : 0, willChange: 'transform' }
  const onMove = ({ clientX, clientY }) => {
    const r = clientX / window.innerWidth
    const l = clientY / window.innerHeight
    gsap.to(q('.stetho'), { x: 2 * (r - 0.5) * 2, y: 2 * (l - 0.5) * 2, ...vars })
    gsap.to(q('.thermo'), { x: 4 * (r - 0.5) * 2, y: 4 * (l - 0.5) * 2, ...vars })
    gsap.to(q('.watch'), { x: 6 * (r - 0.5) * 2, y: 6 * (l - 0.5) * 2, ...vars })
    gsap.to(q('.pills'), { x: 8 * (r - 0.5) * 2, y: 8 * (l - 0.5) * 2, ...vars })
  }
  if (hover) {
    window.addEventListener('mousemove', onMove)
    cleanups.push(() => window.removeEventListener('mousemove', onMove))
  } else {
    const p = { x: window.innerWidth / 2, y: -window.innerHeight }
    gsap.to(p, {
      duration: 8,
      y: 3 * window.innerHeight,
      yoyo: true,
      ease: 'power3.inOut',
      repeat: -1,
      onUpdate: () => onMove({ clientX: p.x, clientY: p.y }),
    })
  }
}
