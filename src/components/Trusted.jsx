import InlineSvg from './shared/InlineSvg'
import brook from '../assets/svg/trusted-brook.svg?raw'
import firefly from '../assets/svg/trusted-firefly.svg?raw'
import penn from '../assets/svg/trusted-pennmedicine.svg?raw'
import dreem from '../assets/svg/trusted-dreem.svg?raw'

const LOGOS = [
  { id: 'brook', svg: brook, name: 'brook' },
  { id: 'firefly', svg: firefly, name: 'firefly health' },
  { id: 'penn', svg: penn, name: 'Penn Medicine' },
  { id: 'dreem', svg: dreem, name: 'dreem health' },
]

/* CLONE_SPEC 7. Section 5: Trusted */
export default function Trusted() {
  return (
    <section className="grid w-full place-items-center bg-silver05">
      <div className="w-full max-w-page u-pb-[78] u-px-[50] tabdown:pb-0 mob:u-px-[15]">
        <div className="flex w-full flex-col items-center bg-blue02 u-pb-[43] u-pt-[100] u-px-[43] u-rounded-[24] tab:u-pb-[78] tab:u-px-[116] mob:u-pb-[46] mob:u-px-[26]">
          <h3
            className="text-center type-h2 text-silver05 u-mb-[34] u-w-[747] tabdown:w-full mob:type-h3"
            data-anim="text-lines"
          >
            Trusted by digital health leaders
          </h3>
          <p
            className="text-center type-body-r text-silver05 u-mb-[139] u-w-[708] tabdown:w-full tab:u-mb-[24] mob:u-mb-[46]"
            data-anim="text-fade"
          >
            Impilo is trusted by medical professionals nationwide for logistics, device &amp; patient support, and unified
            RPM/device data API for virtual &amp; hybrid care providers, health systems, and digital health companies.
          </p>
          <div className="grid w-max grid-cols-4 border border-lavender01 tab:u-w-[630] tab:grid-cols-2 mob:grid-cols-1">
            {LOGOS.map((logo) => (
              // Partner links (external) removed by request: non-link cell, same LogoHover hover effect.
              <div key={logo.id} role="img" aria-label={logo.name} className="logo-hover">
                <InlineSvg svg={logo.svg} idPrefix={`trusted-${logo.id}`} aria-hidden="true" />
                <div className="logo-hover__ovals" aria-hidden="true">
                  <div className="logo-hover__oval logo-hover__oval--1" />
                  <div className="logo-hover__oval logo-hover__oval--2" />
                  <div className="logo-hover__oval logo-hover__oval--3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
