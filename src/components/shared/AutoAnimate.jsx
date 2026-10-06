import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'

// End values for the incoming layer: the neutral value of every property its `inFrom` animates.
const NEUTRAL = { opacity: 1, autoAlpha: 1, x: 0, y: 0, xPercent: 0, yPercent: 0, scale: 1, scaleX: 1, scaleY: 1, rotation: 0 }
const neutralOf = (from) => Object.fromEntries(Object.keys(from || {}).filter((k) => k in NEUTRAL).map((k) => [k, NEUTRAL[k]]))

/*
 * AutoAnimate (CLONE_SPEC 2 "Rotating word" / 8 "Quotes motion").
 * Children for `activeKey` are rendered in a single grid cell. When the key changes,
 * the outgoing layer tweens to `outTo`, the incoming layer tweens from `inFrom`,
 * and the container tweens its width/height to the new layer's size.
 */
export default function AutoAnimate({
  activeKey,
  children,
  className = '',
  layerClassName = '',
  inFrom,
  outTo,
  animateWidth = false,
  animateHeight = true,
  duration = 1,
  ease = 'power3.inOut',
  ...rest
}) {
  const wrapRef = useRef(null)
  const snapshots = useRef(new Map())
  const prevSize = useRef({ width: 0, height: 0 })
  const tlRef = useRef(null)
  const vars = useRef({ inFrom, outTo })
  vars.current = { inFrom, outTo }
  snapshots.current.set(activeKey, children)

  const [keys, setKeys] = useState([activeKey])

  // Key changed: settle any running transition, record the current size, add the new layer.
  useLayoutEffect(() => {
    if (tlRef.current) {
      tlRef.current.progress(1).kill()
      tlRef.current = null
    }
    const wrap = wrapRef.current
    prevSize.current = { width: wrap.offsetWidth, height: wrap.offsetHeight }
    setKeys((prev) => (prev[prev.length - 1] === activeKey ? prev : [...prev.filter((k) => k !== activeKey), activeKey]))
  }, [activeKey])

  // New layer mounted: run the swap.
  useLayoutEffect(() => {
    if (keys.length < 2) return
    // Re-run of the same swap (StrictMode / repeated renders): drop the half-built timeline first,
    // otherwise its from-state is captured as the new end-state and the incoming layer stays hidden.
    if (tlRef.current) {
      tlRef.current.kill()
      tlRef.current = null
    }
    const wrap = wrapRef.current
    const layers = Array.from(wrap.children)
    const incoming = layers[layers.length - 1]
    const outgoing = layers.slice(0, -1)

    // Measure the incoming layer's natural size with outgoing layers out of flow.
    outgoing.forEach((el) => (el.style.position = 'absolute'))
    const next = { width: wrap.offsetWidth, height: wrap.offsetHeight }
    outgoing.forEach((el) => (el.style.position = ''))

    const prev = prevSize.current
    const tl = gsap.timeline({
      defaults: { duration, ease },
      onComplete: () => {
        gsap.set(wrap, { clearProps: 'width,height' })
        gsap.set(incoming, { clearProps: 'transform,opacity' })
        setKeys((k) => k.slice(-1))
        for (const key of snapshots.current.keys()) if (key !== activeKey) snapshots.current.delete(key)
      },
    })
    tl.to(outgoing, { ...vars.current.outTo }, 0)
    tl.fromTo(incoming, { ...vars.current.inFrom }, neutralOf(vars.current.inFrom), 0)
    if (animateWidth) tl.fromTo(wrap, { width: prev.width }, { width: next.width }, 0)
    if (animateHeight) tl.fromTo(wrap, { height: prev.height }, { height: next.height }, 0)
    tlRef.current = tl
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys])

  return (
    <div ref={wrapRef} className={`auto-animate relative ${className}`} {...rest}>
      {keys.map((key) => (
        <div key={key} className={layerClassName}>
          {snapshots.current.get(key)}
        </div>
      ))}
    </div>
  )
}
