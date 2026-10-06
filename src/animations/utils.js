import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { Flip } from 'gsap/Flip'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Flip, DrawSVGPlugin)

export { gsap, ScrollTrigger, Flip }

/* Breakpoints (original breakpoints.ts): mobile <=500, tablet <=1024, desktop <=1440, fullWidth above. */
export const MQ = {
  mobile: '(max-width: 500px)',
  tablet: '(min-width: 501px) and (max-width: 1024px)',
  desktop: '(min-width: 1025px)',
}

export function breakpoint() {
  const w = window.innerWidth
  if (w <= 500) return 'mobile'
  if (w <= 1024) return 'tablet'
  if (w <= 1440) return 'desktop'
  return 'fullWidth'
}

/*
 * ci(px): the original's design-px -> rendered-px helper (module 483 `ci`).
 * fullWidth: px; otherwise px * innerWidth / designWidth (1440 / 1024 / 375).
 */
export function ci(px) {
  const bp = breakpoint()
  if (bp === 'fullWidth') return px
  const base = bp === 'mobile' ? 375 : bp === 'tablet' ? 1024 : 1440
  return (px * window.innerWidth) / base
}

/* KP(n): n% of a 100vh box (the original measures a hidden 100vh div). */
let vhProbe = null
export function KP(n) {
  if (!vhProbe) {
    vhProbe = document.createElement('div')
    vhProbe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100vh;visibility:hidden;pointer-events:none'
    document.body.append(vhProbe)
  }
  return (vhProbe.clientHeight / 100) * n
}

export const canHover = () => window.matchMedia('(hover: hover)').matches

export const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

/*
 * Soft pin (original module 200). Creates a pinning ScrollTrigger and, around its start/end,
 * scrubbed y-drift tweens of +-smoothLevel/4 (power1.in into the edge, power1.out out of it).
 *
 * The original applies the drift to the pin-spacer because it pins with pinType "transform"
 * under ScrollSmoother. The clone uses native scroll + fixed pins, where a transformed ancestor
 * would break position:fixed, so the drift goes on `driftTarget` (an element inside the pin,
 * or the pin itself via the CSS `translate` property). The original skips the drift when the
 * pin type is "fixed" (touch devices); the clone mirrors that with the (hover: hover) check.
 */
export function softPin({ smoothType = 'both', smoothLevel = 200, driftTarget, driftProp = 'y', ...vars }) {
  const drifts = []
  const st = ScrollTrigger.create({
    pin: true,
    ...vars,
    onRefresh(self) {
      drifts.forEach((t) => t.scrollTrigger && t.scrollTrigger.refresh())
      vars.onRefresh && vars.onRefresh(self)
    },
  })
  const p = smoothLevel
  if (!driftTarget || p === 0 || !canHover()) return st

  const val = (v) => (driftProp === 'translate' ? `0px ${v}px` : v)
  const drift = (from, to, ease, start, end) =>
    drifts.push(
      gsap.fromTo(
        driftTarget,
        { [driftProp]: val(from) },
        { immediateRender: false, [driftProp]: val(to), ease, scrollTrigger: { start, end, scrub: true } },
      ),
    )
  if (smoothType === 'in' || smoothType === 'both') {
    drift(0, p / 4, 'power1.in', () => st.start - p, () => st.start)
    drift(p / 4, 0, 'power1.out', () => st.start, () => st.start + p)
  }
  if (smoothType === 'out' || smoothType === 'both') {
    drift(0, -p / 4, 'power1.in', () => st.end - p, () => st.end)
    drift(-p / 4, 0, 'power1.out', () => st.end, () => st.end + p)
  }
  st.drifts = drifts
  return st
}
