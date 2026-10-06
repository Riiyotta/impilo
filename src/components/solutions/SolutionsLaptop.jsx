import AutoAnimate from '../shared/AutoAnimate'

/*
 * Spec 1.4 Laptop (desktop/tablet): 3D lid (rotateX scrubbed in animations/pages/solutions.js) +
 * AutoAnimate screen + overlapping text panel with prev/next arrows.
 * Slide swap = crossfade with size morph (AutoAnimate `parameters: {yPercent: undefined, opacity: 0}`).
 * NOTE: duplicate-candidate of shared/LaptopShowcase.jsx (built by another agent); consolidate later.
 */
const FADE = { opacity: 0 }

export default function SolutionsLaptop({ slides, active, onPrev, onNext }) {
  const slide = slides[active]
  return (
    <div className="sol-laptop" data-sol="laptop">
      <div className="sol-laptop__top" data-sol="laptop-top">
        <img src="/assets/svg/solutions-laptop-top.svg" alt="" className="h-auto max-w-none u-w-[875]" />
        <AutoAnimate
          activeKey={active}
          className="sol-laptop__screen"
          inFrom={FADE}
          outTo={FADE}
          animateWidth
          animateHeight
        >
          <img src={slide.screen} alt="" />
        </AutoAnimate>
      </div>
      <img src="/assets/svg/solutions-laptop-bottom.svg" alt="" className="h-auto max-w-none u-mt-[-2] u-w-[1110]" />

      <div className="relative z-[1] flex flex-col items-center justify-center border-solid border-blue03 bg-blue02 u-gap-[17] u-min-h-[320] u-mt-[-173] u-px-[22] u-rounded-[11] u-w-[712] [border-width:calc(var(--u)*1)]">
        <AutoAnimate
          activeKey={active}
          className="sol-wide-animate"
          inFrom={FADE}
          outTo={FADE}
          animateWidth
          animateHeight
        >
          <h4 className="type-body-xl text-silver05">{slide.title}</h4>
        </AutoAnimate>
        <AutoAnimate
          activeKey={active}
          className="sol-wide-animate"
          inFrom={FADE}
          outTo={FADE}
          animateWidth
          animateHeight
        >
          <p className="type-body-m text-blue07 u-w-[398]">{slide.text}</p>
        </AutoAnimate>
      </div>

      <div className="flex u-gap-[18] u-mt-[18]">
        <button type="button" className="sol-laptop__arrow-prev" onClick={onPrev} aria-label="Previous slide">
          <img src="/assets/svg/solutions-laptop-arrow.svg" alt="" className="u-h-[39] u-w-[39]" />
        </button>
        <button type="button" onClick={onNext} aria-label="Next slide">
          <img src="/assets/svg/solutions-laptop-arrow.svg" alt="" className="u-h-[39] u-w-[39]" />
        </button>
      </div>
    </div>
  )
}
