import PagePill from '../shared/PagePill'

const CARDS = [
  {
    icon: '/assets/svg/solutions-support-heart.svg',
    title: 'Quick & Easy Integration',
    text: 'Our SDK removes much of the complexity of bringing remote monitoring into your product. Spend less effort on low-level details and more energy delivering real value to customers.',
  },
  {
    icon: '/assets/svg/solutions-support-lightbulb.svg',
    title: 'Real-Time Monitoring & Alerts',
    text: "Follow your patients' health data as it arrives and get notified the moment something needs attention, thanks to flexible, built-in alerting tools.",
  },
  {
    icon: '/assets/svg/solutions-support-chat.svg',
    title: 'Comprehensive Data Handling',
    text: 'Encrypted, compliant data transfer keeps every collected reading protected, organized and ready for clinical review whenever your care team needs it.',
  },
  {
    icon: '/assets/svg/solutions-support-document.svg',
    title: 'Customizable to Your Workflow',
    text: 'Shape our APIs around the systems and processes you already rely on. From syncing results from home testing kits to coordinating branded device shipments, the platform bends to fit your needs.',
  },
]

/* COMPANY_PAGES_SPEC I.2 SDK: white panel, stacking/shrinking cards, half-speed thermometer. */
export default function Sdk() {
  return (
    <section
      className="sdk relative z-[1] grid place-items-center bg-silver05 text-center u-pt-[232] u-rounded-[24] tab:u-pt-[151] mob:u-pt-[100] mob:u-rounded-b-[0]"
      data-anim="int-sdk"
    >
      <div className="absolute z-[-1] u-top-[1745] u-w-[388] mob:hidden" style={{ right: 'calc(50vw + var(--u) * 245)' }}>
        <img
          src="/assets/svg/solutions-support-thermo.svg"
          alt=""
          aria-hidden="true"
          className="block h-auto w-full"
          data-anim="int-thermo"
        />
      </div>
      <PagePill />
      <h1 className="type-h2 text-blue01 u-max-w-[1111] u-mt-[16] tab:u-max-w-[924] mob:type-h3 mob:u-max-w-[345]">Why Choose Our Platform?</h1>
      <p className="type-body-r text-blue01 u-max-w-[576] u-mt-[32] mob:u-max-w-[345]">
        Our API and mobile SDK give developers a direct path to connecting medical devices with their own software
        platforms. Integrate readings quickly, smooth out the patient experience and stay aligned with current
        healthcare security standards from day one.
      </p>
      <div className="sdk-cards flex flex-col items-center" data-anim="int-cards">
        {CARDS.map((c) => (
          <article
            key={c.title}
            className="sdk-card relative z-[1] flex flex-col items-center justify-center border border-solid border-lavender04 bg-silver04 u-min-h-[548] u-mt-[150] u-pb-[100] u-pt-[66] u-rounded-[24] u-w-[860] mob:u-mt-[42] mob:u-pb-[66] mob:u-pt-[42] mob:u-px-[22.5] mob:u-w-[310]"
            style={{ scrollSnapStop: 'always' }}
            data-anim="int-card"
          >
            <img src={c.icon} alt="" aria-hidden="true" className="block u-h-[80] u-w-[80]" />
            <h2 className="type-h3 text-blue01 u-max-w-[400] u-mt-[35] mob:u-mt-[26]">{c.title}</h2>
            <p className="type-body-r text-blue01 u-max-w-[461] u-mt-[52]">{c.text}</p>
          </article>
        ))}
      </div>
      <p className="type-body-r text-blue01 u-max-w-[576] u-mt-[32] mob:u-max-w-[345]">A broad catalog of hundreds of supported devices, ready today.</p>
    </section>
  )
}
