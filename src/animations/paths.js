import { gsap, ScrollTrigger } from './utils'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'

/* Original AnimatedPaths (module 6859): integer random in [a, b]. */
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a

/*
 * Line "travellers" along `.animate` paths (CLONE_SPEC 2.4 / 0.7).
 * Each path gets a DrawSVG dash of random length (lineLength px, capped at half the range) that grows,
 * travels and shrinks linearly across [lineRange] of the path at random lineSpeed px/s, then waits 1s.
 * All path timelines live in one master timeline (offset random 0.2-0.6s) gated by
 * ScrollTrigger "top 90%" -> "bottom top", toggleActions "play pause resume pause".
 */
export function animatedPaths(
  wrapper,
  { selector = 'path', lineLength = [50, 150], lineSpeed = [150, 250], lineRange = [0, 1], continuous = false } = {},
) {
  const [S, E] = lineRange
  const pathTimeline = (el) => {
    const total = DrawSVGPlugin.getLength(el)
    const t4 = total * (E - S)
    const n4 = total * S
    const o3 = Math.min(t4 / 2, rand(lineLength[0], lineLength[1]))
    const s4 = t4 / rand(lineSpeed[0], lineSpeed[1])
    const a3 = o3 / t4
    const tl = gsap.timeline({ repeat: -1 })
    tl.fromTo(el, { drawSVG: `${n4} ${n4}` }, { drawSVG: `${n4} ${n4 + o3}`, ease: 'linear', duration: s4 * a3 }, 0)
      .to(el, { duration: s4 * (1 - a3), drawSVG: `${n4 + t4 - o3} ${n4 + t4}`, ease: 'linear' })
      .to(el, { duration: s4 * a3, drawSVG: `${n4 + t4} ${n4 + t4}`, ease: 'linear' })
    tl.to({}, { duration: 1 }) // original: to(null, {duration: 1}) -- a 1s gap
    return tl
  }

  const paths = Array.from(wrapper.querySelectorAll(selector))
  const master = gsap.timeline({
    repeat: -1,
    repeatRefresh: true,
    scrollTrigger: {
      trigger: wrapper,
      start: 'top 90%',
      end: 'bottom top',
      toggleActions: continuous ? 'play play play play' : 'play pause resume pause',
    },
  })
  paths.forEach((el) => {
    gsap.set(el, { visibility: 'visible' })
    master.add(pathTimeline(el), rand(2, 6) / 10)
  })
  return master
}

export { ScrollTrigger }
