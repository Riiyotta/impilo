import InlineSvg from './shared/InlineSvg'
import PrimaryButton from './shared/PrimaryButton'
import marqueeLogo from '../assets/svg/marquee-logo.svg?raw'

const MARQUEE_COPIES = 8

/* CLONE_SPEC 3. Section 2: Focus */
export default function Focus() {
  return (
    <section
      className="relative z-[2] flex flex-col items-center u-h-[1394] tab:u-h-[1657] mob:u-h-[622]"
      data-anim="focus"
    >
      <div className="w-full max-w-page">
        <div className="flex flex-col items-center u-h-[594] u-gap-[34] u-px-[116] u-py-[130] tab:u-h-[858] tab:px-0 tab:u-pb-[439] tab:u-pt-[142] mob:u-h-[221] mob:u-pb-[58] mob:u-pt-[38] mob:u-px-[15]">
          <h2
            className="text-center type-h1 text-silver05 tab:type-h2 mob:type-h3"
            data-anim="text-lines"
          >
            Allowing you to focus on patient health care
          </h2>
          <div
            className="grid place-items-center overflow-clip rounded-[99vw] bg-silver05 u-h-[72] u-w-[296] mob:hidden"
            aria-hidden="true"
          >
            <div className="marquee" data-anim="focus-marquee">
              {Array.from({ length: MARQUEE_COPIES }, (_, i) => (
                <div key={i}>
                  <span className="type-kicker-s text-blue04 u-mr-[10]">Keep Scrolling</span>
                  <InlineSvg svg={marqueeLogo} className="h-auto u-mr-[10] u-w-[106]" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 h-[calc(100%_-_var(--u)_*_594)] w-full bg-silver05 u-rounded-t-[24] tab:h-[calc(100%_-_var(--u)_*_858)] mob:h-[calc(100%_-_var(--u)_*_221)]"
          data-anim="focus-panel"
        >
          <div className="grid h-full place-items-center">
            <div className="relative flex items-center type-h2 text-blue02 u-gap-[24] tabdown:flex-col mob:type-h3">
              <span>Let&apos;s show you</span>
              <div className="relative z-[3] flex scale-100" data-anim="focus-demo-pin">
                <PrimaryButton href="/request-demo/" className="u-top-[-30] left-0 tab:u-w-[185]" data-anim="focus-demo-button">
                  Request Demo
                </PrimaryButton>
              </div>
              <span>how we do it</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
