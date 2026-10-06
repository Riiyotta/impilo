import { useEffect, useState } from 'react'
import FadeImage from './FadeImage'
import { ci } from '../../animations/utils'

const TILE_W = 548
const PHOTOS = [
  { src: '/assets/images/about/founded-1.webp', alt: '1. Impilo team in an office, among various desks and computers' },
  { src: '/assets/images/about/founded-2.webp', alt: '2. two people pose with their faces in a photo board' },
  { src: '/assets/images/about/founded-3.webp', alt: '3. three team members pose for a photo in an office' },
]
const GAP = 16

/* Marquee copies: ceil(innerWidth / ((ci(548) + ci(16)) * 3)) + 1 (spec A.2; fluid px like the original). */
const copyCount = () =>
  typeof window === 'undefined' ? 2 : Math.ceil(window.innerWidth / ((ci(TILE_W) + ci(GAP)) * 3)) + 1

/* COMPANY_PAGES_SPEC A.2 Founded: white panel, glucose meter, copy, accelerating photo marquee. */
export default function Founded() {
  const [copies, setCopies] = useState(copyCount)
  useEffect(() => {
    const onResize = () => setCopies(copyCount())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <section className="relative z-[2] bg-silver05 u-rounded-[24] u-pb-[147] mob:rounded-none mob:u-pb-[95]">
      <div className="relative mx-auto grid u-w-[1440] mob:u-w-[345]">
        <img
          src="/assets/svg/about-glucose-meter.svg"
          alt=""
          aria-hidden="true"
          className="absolute h-auto u-left-[-80] u-top-[155] u-w-[320] mob:hidden"
          style={{ transform: 'rotate(14.221deg)' }}
        />
        <div className="relative mr-auto u-mb-[90] u-ml-[345] u-mt-[278] u-w-[540] mob:ml-0 mob:u-mb-[52] mob:u-mt-[60] mob:u-w-[345]">
          <h1 className="type-h3 text-blue01 mob:type-h4">Founded in 2020</h1>
          <div className="flex items-center type-h4 text-blue05 u-gap-[10] u-mb-[25] u-mt-[18] mob:type-body-m">
            <img
              src="/assets/svg/about-location-pin.svg"
              alt=""
              aria-hidden="true"
              className="block u-h-[22] u-w-[18] mob:u-h-[20] mob:u-w-[16]"
            />
            <span>Philadelphia, PA</span>
          </div>
          <p className="type-body-r text-blue01">
            We started with a straightforward conviction: quality care should reach individuals wherever they happen to
            live. Our platform removes the complexity from remote programs by handling devices, onboarding and support, so care teams can stay focused
            on outcomes. We want every program to feel easy to launch, easy to run and easy to grow, because when the
            logistics disappear, patients get more of what matters most.
          </p>
        </div>
        <div className="flex" data-anim="about-marquee">
          {Array.from({ length: copies }, (_, c) => (
            <div key={c} className="flex shrink-0" data-anim="about-marquee-group" aria-hidden={c > 0 || undefined}>
              {PHOTOS.map((ph) => (
                <FadeImage
                  key={ph.src}
                  src={ph.src}
                  alt={ph.alt}
                  className="shrink-0 u-h-[370] u-mr-[16] u-rounded-[24] u-w-[548] mob:u-h-[233] mob:u-w-[345]"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
