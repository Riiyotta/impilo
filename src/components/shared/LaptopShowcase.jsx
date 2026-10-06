import { useState } from 'react'
import AutoAnimate from './AutoAnimate'

/*
 * COMPANY_PAGES_SPEC I.4 Laptop showcase. Desktop/tablet: laptop lid + screen cross-fade,
 * panel (title/text cross-fades inside "WideAutoAnimate"), prev/next arrows cycling 3 slides.
 * Mobile: three stacked panels, no laptop/arrows. Lid-opening motion is scroll-driven
 * (data-anim="laptop-top", see animations/pages/integrations.js).
 */
const FADE = { inFrom: { opacity: 0 }, outTo: { opacity: 0 } }

export default function LaptopShowcase({ slides }) {
  const [index, setIndex] = useState(0)
  const n = slides.length
  const slide = slides[index]
  const go = (d) => setIndex((i) => (i + d + n) % n)

  return (
    <>
      {/* Desktop / tablet */}
      <div className="laptop flex flex-col items-center mob:hidden" data-anim="laptop">
        <div className="laptop__top grid" data-anim="laptop-top" style={{ placeItems: "start center" }}>
          <img src="/assets/svg/solutions-laptop-top.svg" alt="" aria-hidden="true" className="block h-auto max-w-none u-w-[875]" />
          <AutoAnimate activeKey={index} className="laptop__screen" {...FADE}>
            <img src={slide.screen} alt={`${slide.title} screen`} />
          </AutoAnimate>
        </div>
        <img
          src="/assets/svg/solutions-laptop-bottom.svg"
          alt=""
          aria-hidden="true"
          className="relative block h-auto max-w-none u-mt-[-2] u-w-[1110]"
        />
        <div className="relative z-[1] flex flex-col items-center justify-center rounded-[calc(var(--u)*11)] border border-solid border-blue03 bg-blue02 u-gap-[17] u-min-h-[320] u-mt-[-173] u-px-[22] u-w-[712]">
          <AutoAnimate activeKey={index} className="laptop__wide" animateWidth {...FADE}>
            <h3 className="whitespace-nowrap type-body-xl">{slide.title}</h3>
          </AutoAnimate>
          <AutoAnimate activeKey={index} className="laptop__wide" {...FADE}>
            <p className="type-body-m text-blue07 u-w-[398]">{slide.text}</p>
          </AutoAnimate>
        </div>
        <div className="flex u-gap-[18] u-mt-[18]">
          <button type="button" className="laptop__prev block cursor-pointer border-0 bg-transparent p-0" aria-label="Previous" onClick={() => go(-1)}>
            <img src="/assets/svg/solutions-laptop-arrow.svg" alt="" className="block u-h-[39] u-w-[39]" />
          </button>
          <button type="button" className="block cursor-pointer border-0 bg-transparent p-0" aria-label="Next" onClick={() => go(1)}>
            <img src="/assets/svg/solutions-laptop-arrow.svg" alt="" className="block u-h-[39] u-w-[39]" />
          </button>
        </div>
      </div>

      {/* Mobile: stacked panels */}
      <div className="hidden flex-col items-center mob:flex">
        {slides.map((s, i) => (
          <div
            key={s.title}
            className={`relative z-[1] flex flex-col items-center justify-center bg-blue02 u-gap-[17] u-px-[22] u-rounded-[11] ${i < slides.length - 1 ? 'u-mb-[90]' : ''}`}
          >
            {/* Inline image in a line box, like the original PanelImage > svg (adds the descender gap). */}
            <div className="type-body-r">
              <img
                src={s.screen}
                alt={`${s.title} screen`}
                className="inline align-baseline u-h-[202] u-rounded-[10] u-w-[345]"
              />
            </div>
            <h3 className="type-h4 u-mb-[17] u-mt-[6] u-w-[345]">{s.title}</h3>
            <p className="type-body-m text-blue07 u-w-[340]">{s.text}</p>
          </div>
        ))}
      </div>
    </>
  )
}
