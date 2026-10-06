import LineFillText from '../shared/LineFillText'

const CERTS = [
  { src: '/assets/svg/about-cert-iso.svg', alt: 'ISO' },
  { src: '/assets/svg/about-cert-hipaa.svg', alt: 'HIPAA' },
  { src: '/assets/svg/about-cert-hqaa.svg', alt: 'HQAA' },
  { src: '/assets/svg/about-cert-soc2.svg', alt: 'SOC2' },
  { src: '/assets/svg/about-cert-fda.svg', alt: 'FDA' },
]

/* COMPANY_PAGES_SPEC A.1 Hero: pinned (desktop/tablet), entrance after anyEnd, scrubbed line fill. */
export default function AboutHero() {
  return (
    <div
      className="about-hero flex flex-col bg-blue05 will-change-transform u-pt-[44]"
      data-anim="about-hero"
    >
      <LineFillText
        as="h1"
        className="about-hero__box mx-auto flex flex-col justify-center bg-blue02 text-center type-h2 text-blue04 u-h-[640] u-w-[1341] u-rounded-[24] u-p-[56] tab:u-h-[895] tab:u-w-[925] mob:u-h-[486] mob:u-w-[345] mob:u-p-[21] mob:type-h3"
        data-anim="about-hero-box"
      >
        Our team helps care organizations extend support into the home through simple connected medical devices.
      </LineFillText>
      <div
        className="flex shrink-0 items-center justify-center u-gap-[86] mob:flex-wrap mob:u-gap-[22]"
        data-anim="about-hero-logos"
      >
        {CERTS.map((c) => (
          <img key={c.alt} src={c.src} alt={c.alt} className="block u-h-[100] u-w-[100]" />
        ))}
      </div>
    </div>
  )
}
