import InlineSvg from '../shared/InlineSvg'
import PrimaryAction from '../shared/PrimaryAction'
import LaptopShowcase from '../shared/LaptopShowcase'
import logoHeader from '../../assets/svg/logo-header.svg?raw'

// Placeholder brand names (spec: 31 Bluetooth, 9 LTE).
const BLUETOOTH = Array.from({ length: 31 }, (_, i) => `Device Brand ${String(i + 1).padStart(2, '0')}`)
const LTE = Array.from({ length: 9 }, (_, i) => `LTE Brand ${String(i + 1).padStart(2, '0')}`)

const SLIDES = [
  {
    screen: '/assets/svg/solutions-laptop-screen-readings.svg',
    title: 'Healthcare Providers',
    text: 'Run remote monitoring right inside your existing EHR, with device data flowing straight into the charts your clinicians already use daily.',
  },
  {
    screen: '/assets/svg/solutions-laptop-screen-details.svg',
    title: 'Medical Device Manufactures',
    text: 'You focus on building great devices while we take care of the patient app.',
  },
  {
    screen: '/assets/svg/solutions-laptop-screen-dashboard.svg',
    title: 'Health Tech Startups',
    text: 'Grow faster by building on our SDK instead of starting from scratch. Add connected devices to your own product in weeks, keep full control of the experience, and lean on our provider portal when you do not yet have an EHR. Scale as programs expand.',
  },
]

function Snippet({ title, items }) {
  return (
    <div className="u-w-[290] mob:u-w-[289]">
      <h3 className="type-body-r text-brightTurquoise u-pb-[20]">{title}</h3>
      <ul className="snippet-list type-body-r text-silver05">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  )
}

/* COMPANY_PAGES_SPEC I.3 Devices: blue02 panel overlapping the SDK panel's last 100lvh. */
export default function Devices() {
  return (
    <section className="relative z-[1] grid min-h-[100lvh] place-items-center bg-blue02 text-center text-silver05 u-pb-[200] u-pt-[232] u-rounded-[24] tab:flex tab:flex-col tab:items-center tab:u-pb-[148] mob:flex mob:flex-col mob:items-center mob:u-py-[100]">
      <InlineSvg svg={logoHeader} className="block h-auto u-w-[70]" aria-hidden="true" />
      <h1 className="type-h2 u-mt-[16] mob:type-h3">Which Devices Can You Connect Today?</h1>
      <p className="type-body-r u-mb-[50] u-mt-[32] u-w-[436] mob:u-w-[329]">
        Our API and mobile SDK let you work with a broad mix of medical devices and sensors. The lists below show a
        sample of the most popular options, and many more are available. Ask us for the full catalog anytime.
      </p>
      <div className="grid grid-cols-2 u-gap-x-[140] u-gap-y-[60] u-mt-[115] mob:flex mob:flex-col mob:u-gap-[28] mob:u-mt-[60]">
        <Snippet title="Bluetooth Devices" items={BLUETOOTH} />
        <Snippet title="LTE Devices" items={LTE} />
      </div>
      <LaptopShowcase slides={SLIDES} />
      <h2 className="type-h3 u-mt-[16] u-pt-[16] mob:type-h4">How to Use Our Mobile SDK?</h2>
      <ul className="snippet-list type-body-r u-mb-[50] u-mt-[32] u-w-[436] mob:u-w-[329]">
        <li>Embed it within your own app</li>
        <li>Or use our ready integration hub</li>
      </ul>
      <h2 className="type-h2 u-max-w-[1165] u-mb-[26] u-mt-[250] tab:u-mb-[58] tab:u-mt-[187] mob:type-h3 mob:u-mt-[94] mob:u-w-[345]">
        Ready to get going?
      </h2>
      <PrimaryAction to="/request-demo/">Request Demo</PrimaryAction>
      <p className="type-body-r u-mb-[50] u-mt-[32] u-w-[436] mob:u-w-[329]">
        Dig into our developer-friendly SDK documentation today. Whether you are starting fresh or extending existing
        device integrations, everything you need is ready and waiting.
      </p>
      <PrimaryAction to="/developers/">SDK &amp; API Documentation</PrimaryAction>
    </section>
  )
}
