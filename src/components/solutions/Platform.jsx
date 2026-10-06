import { useCallback, useRef, useState } from 'react'
import UniversalLink from '../shared/UniversalLink'
import PrimaryButton from '../shared/PrimaryButton'
import SolutionsLaptop from './SolutionsLaptop'

const SLIDES = [
  {
    screen: '/assets/svg/solutions-laptop-screen-readings.svg',
    title: 'Patient Monitoring Operations Platform',
    text: 'Readings from every connected device arrive in one consistent format, so clinicians review blood pressure, glucose, weight, and oxygen data side by side in their app, EHR, or elsewhere.',
  },
  {
    screen: '/assets/svg/solutions-laptop-screen-details.svg',
    title: 'Manage Every Device From One Place',
    text: 'Track shipments, activations, battery levels, and connectivity for every device in your fleet, then trigger replacements, support, or updates through our API or web app before a missed reading becomes a gap in care.',
  },
  {
    screen: '/assets/svg/solutions-laptop-screen-dashboard.svg',
    title: 'Review Data, Manage Every Patient',
    text: 'Dashboards surface trends, alerts, and time logs for each patient, so care teams can prioritize outreach and document interactions inside the systems they already use, with lifecycle reports in one place.',
  },
]

const SNIPPETS = [
  {
    title: 'Biometric and Engagement Alerting',
    text: 'Set custom thresholds for out-of-range readings and missed measurements, alerting the right team member.',
  },
  {
    title: 'EHR integration',
    text: 'Sync readings, notes, and time logs into your existing record system to keep charts complete.',
    small: true,
  },
  {
    title: 'Unified Device Data',
    text: 'Hundreds of supported devices report into a single standardized data model, ready for review, analysis, and export.',
  },
  {
    title: 'API + SDK Integration',
    text: (
      <>
        Connect our platform to your existing tools and workflows using{' '}
        <UniversalLink href="/developers/" className="sol-platform__snippet-link">
          our API &amp; SDK
        </UniversalLink>
        , with <br />
        sandbox access and full docs included.
      </>
    ),
  },
]

/* Spec 1.4 Platform (blue02 panel, laptop carousel, snippets, closing call). */
export default function Platform() {
  const [active, setActive] = useState(0)
  // AutoAnimate throttle: duration*1000 + 100 ms (spec 1.5)
  const lock = useRef(0)
  const step = useCallback((d) => {
    const now = Date.now()
    if (now < lock.current) return
    lock.current = now + 1100
    setActive((a) => (a + d + SLIDES.length) % SLIDES.length)
  }, [])

  return (
    <section
      className="relative z-[1] grid min-h-[100lvh] place-items-center bg-blue02 text-center text-silver05 u-pb-[200] u-pt-[232] u-rounded-[24] tabdown:flex tabdown:flex-col tabdown:items-center tabdown:justify-center tab:u-pb-[148] mob:u-py-[100]"
      data-sol="platform"
    >
      <img src="/assets/svg/logo-header.svg" alt="Impilo" className="h-auto u-w-[70]" />
      <h2 className="type-h2 u-mt-[16] mob:type-h3">Meet the Platform</h2>
      <p className="type-body-r u-mb-[50] u-mt-[32] u-w-[436] mob:u-w-[329]">
        One platform unites device data, patient records, care workflows, and billing reports, giving every team
        member a single place to work.
      </p>

      <div className="mob:hidden">
        <SolutionsLaptop slides={SLIDES} active={active} onPrev={() => step(-1)} onNext={() => step(1)} />
      </div>

      <div className="hidden w-full flex-col items-center mob:flex">
        {SLIDES.map((s, i) => (
          <div key={i} className="flex w-full flex-col items-center u-gap-[17] u-mb-[90] last:mb-0">
            <div>
              <img
                src={s.screen}
                alt=""
                className="inline max-w-none align-baseline u-h-[202] u-rounded-[10] u-w-[345]"
              />
            </div>
            <h4 className="type-h4 u-mb-[17] u-mt-[6] u-w-[345]">{s.title}</h4>
            <p className="type-body-m text-blue07 u-w-[340]">{s.text}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 u-gap-x-[140] u-gap-y-[60] u-mt-[115] mob:flex mob:flex-col mob:u-gap-[28] mob:u-mt-[60]">
        {SNIPPETS.map((s) => (
          <div key={s.title} className="grid place-items-center u-gap-[12] u-w-[290] mob:u-w-[289]">
            <div className="type-body-r text-brightTurquoise">{s.title}</div>
            <p className="type-body-m text-silver05">
              {s.small ? <span className="block u-w-[250]">{s.text}</span> : s.text}
            </p>
          </div>
        ))}
      </div>

      <h2 className="type-h2 u-max-w-[1165] u-mb-[26] u-mt-[250] tab:u-max-w-[1024] tab:u-mb-[58] tab:u-mt-[187] mob:type-h3 mob:u-mb-[26] mob:u-mt-[94] mob:u-w-[345]">
        Find out how we empower your virtual care program
      </h2>
      <div className="flex items-center u-gap-[24] mob:flex-col mob:u-gap-[16]">
        <PrimaryButton href="/solutions/clinic-rpm/">Explore DIY RPM Solutions</PrimaryButton>
        <PrimaryButton href="/request-demo/">Request Demo</PrimaryButton>
      </div>
    </section>
  )
}
