import { useRef, useState } from 'react'
import AutoAnimate from '../shared/AutoAnimate'

/* Spec 2.2 ArrowButton: 35x35 round white button, blue01 chevron (left one rotated 180deg). No hover style. */
export function ArrowButton({ direction, onClick, label }) {
  return (
    <button type="button" className={`cp-arrow cp-arrow--${direction}`} onClick={onClick} aria-label={label}>
      <img src="/assets/svg/usecases-carousel-chevron.svg" alt="" />
    </button>
  )
}

/*
 * Spec 2.2 CapabilitiesCarousel (use-case pages, dark only).
 * AutoAnimate 1s power3.inOut: old card slides out sideways (xPercent -/+110) while fading, new card
 * slides in from the opposite side, height morphs. No autoplay, no swipe.
 */
export default function CapabilitiesCarousel({ cards }) {
  const [{ index, dir }, setState] = useState({ index: 0, dir: 'right' })
  const lock = useRef(0)
  const go = (next, d) => {
    if (next === index) return
    const now = Date.now()
    if (now < lock.current) return // AutoAnimate throttle: duration*1000 + 100
    lock.current = now + 1100
    setState({ index: next, dir: d })
  }
  const n = cards.length
  const card = cards[index]
  const right = dir === 'right'

  return (
    <div className="grid w-full place-items-center">
      {/* Inner holds card, arrows and dots (as in the original), so the arrows' top:50% is the centre of card+dots. */}
      <div className="relative grid w-full max-w-[1200px] place-items-center u-px-[100] tab:u-px-[80] mob:u-px-[50]">
        <AutoAnimate
          activeKey={index}
          className="cp-carousel__animate"
          inFrom={{ opacity: 0, xPercent: right ? 110 : -110 }}
          outTo={{ opacity: 0, xPercent: right ? -110 : 110 }}
        >
          <div className="flex w-full flex-col justify-center border-solid border-lavender04 bg-blue02 text-center u-max-w-[800] u-min-h-[280] u-p-[48] u-rounded-[24] [border-width:calc(var(--u)*1)] mob:u-min-h-[240] mob:u-px-[24] mob:u-py-[32]">
            {card.subtitle && (
              <div className="type-body-m text-brightTurquoise u-mb-[12] tab:mb-[12px] mob:u-mb-[8]">{card.subtitle}</div>
            )}
            <h3 className="type-h3 text-silver05 u-mb-[24] tab:mb-[24px] mob:type-h4 mob:u-mb-[16]">{card.title}</h3>
            {card.text && <p className="type-body-r text-silver05 opacity-90 mob:type-body-m">{card.text}</p>}
          </div>
        </AutoAnimate>
        <ArrowButton direction="prev" label="Previous Capability" onClick={() => go((index - 1 + n) % n, 'left')} />
        <ArrowButton direction="next" label="Next Capability" onClick={() => go((index + 1) % n, 'right')} />
        <div className="flex u-gap-[12] u-mt-[32] mob:u-gap-[8] mob:u-mt-[24]">
          {cards.map((c, i) => (
            <button
              key={i}
              type="button"
              className="cp-dot"
              aria-label={`Go to capability ${i + 1}`}
              aria-current={i === index}
              onClick={() => go(i, i > index ? 'right' : 'left')}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
