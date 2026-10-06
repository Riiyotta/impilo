import InlineSvg from '../shared/InlineSvg'
import Pill from '../shared/Pill'
import PrimaryButton from '../shared/PrimaryButton'
import WidePulse from './WidePulse'
import whiteLabel from '../../../public/assets/svg/solutions-explore-white-label.svg?raw'
import ordering from '../../../public/assets/svg/solutions-explore-ordering.svg?raw'
import box from '../../../public/assets/svg/solutions-explore-box.svg?raw'
import cart from '../../../public/assets/svg/solutions-explore-cart.svg?raw'

/* Spec 1.2 Illustrations: art heights/margins per box (desktop + mobile classes kept static for Tailwind). */
const BOXES = [
  {
    svg: whiteLabel,
    art: 'u-h-[234] u-mt-[68] u-mb-[53] mob:u-mt-[45] mob:u-mb-[41]',
    title: ['Digital Health', 'Logistics'],
    desc: 'Medical-grade storage, kitting, and shipping built for connected devices, with serialized tracking, temperature awareness, and returns handling that keeps every patient shipment accountable from dock to doorstep.',
  },
  {
    svg: ordering,
    art: 'u-h-[163] u-mt-[106] u-mb-[86] mob:u-mt-[78] mob:u-mb-[79]',
    title: ['Digital Health', 'Concierge'],
    descWidth: 'u-w-[340]', // ShortDescription: 340 at every breakpoint (overrides the 339 mobile width)
    desc: 'A dedicated support team helps patients unbox, pair, and use their devices by phone, chat, or text, keeping engagement high after delivery.',
  },
  {
    svg: box,
    art: 'u-h-[223] u-mt-[87] u-mb-[45] mob:u-mt-[38] mob:u-mb-[39]',
    title: ['Medical Supply', 'Procurement'],
    desc: (
      <>
        We source, quality-check, and deliver everything distributed programs depend on—connected devices, laboratory
        kits, RPM hardware, and non-digital
        {/* mobile-only break: keeps the original's 5-line mobile wrap (desktop/tablet stay 3/2 lines) */}
        <br className="hidden mob:inline" /> supplies.
      </>
    ),
  },
  {
    svg: cart,
    art: 'u-h-[232] u-mt-[73] u-mb-[50] mob:u-mt-[44] mob:u-mb-[44]',
    title: ['Regulatory-Grade', 'Fulfillment & Compliance'],
    desc: 'Every order moves through documented, audited workflows with lot tracking, recall readiness, and secure data handling, giving your compliance team full confidence.',
    cart: true,
  },
]

const LOGOS = ['iso', 'hipaa', 'hqaa', 'soc', 'fda']

/* Spec 1.2 Explore (blue01, rounded top, pinned + slide-up). */
export default function Explore() {
  return (
    <section
      className="sol-explore relative grid min-h-screen place-items-center bg-blue01 text-center text-silver05 u-mb-[-24] u-pb-[204] u-pt-[180] u-rounded-t-[24] mob:u-pt-[100]"
      data-sol="explore"
    >
      <Pill className="pill--white" />
      <div className="type-h2 u-mt-[16] mob:type-h3" data-anim="text-lines">
        Explore our solutions
      </div>
      <p className="type-body-r u-mt-[32] u-w-[424] mob:u-w-[329]" data-anim="text-fade">
        Three connected layers work as one: a monitoring platform, hands-on operational services, and patient-ready
        products delivered directly to every home, so distributed programs scale reliably.
      </p>
      <WidePulse />
      <h3
        className="type-h3 u-mt-[105] u-w-[520] tab:u-mt-[215] mob:u-mt-[120] mob:u-w-[344]"
        data-anim="text-lines"
      >
        Tech-Enabled Services
      </h3>
      <p className="type-body-r u-mt-[32] u-w-[520] mob:u-w-[345]" data-anim="text-fade">
        Our operations specialists and healthcare-grade 3PL network take care of warehousing, kitting, shipping, and
        returns, so your programs can launch faster.
      </p>

      <div
        className="sol-explore__ills grid grid-cols-2 u-gap-x-[100] u-gap-y-[80] u-mt-[65] tabdown:grid-cols-1 tab:u-gap-[60] mob:u-gap-[20] mob:u-mt-[58]"
        data-sol="explore-ills"
      >
        {BOXES.map((b, i) => (
          <div key={i} className="sol-explore__box" data-sol={b.cart ? 'cart-box' : undefined}>
            <InlineSvg svg={b.svg} idPrefix={`explore-${i}`} className={`sol-explore__art ${b.art}`} aria-hidden="true" />
            <h4 className="sol-explore__box-title type-body-xl text-silver05">
              {b.title[0]}
              <br /> {b.title[1]}
            </h4>
            <p
              className={`sol-explore__box-desc type-body-m text-blue07 u-mt-[24] mob:u-px-[27] ${
                b.descWidth || 'u-w-[360] mob:u-w-[339]'
              }`}
            >
              {b.desc}
            </p>
          </div>
        ))}
      </div>

      <PrimaryButton href="/solutions/tech-enabled-services/" className="u-mt-[50] mob:u-mt-[40]">
        Discover Our Full Services Layer
      </PrimaryButton>

      <div className="flex u-gap-[86] u-mt-[150] tab:u-mt-[50] mob:flex-wrap mob:justify-center mob:u-gap-[16] mob:u-mt-[44]">
        {LOGOS.map((l) => (
          <img
            key={l}
            src={`/assets/svg/solutions-explore-logo-${l}.svg`}
            alt={l.toUpperCase()}
            className="u-h-[100] u-w-[100]"
          />
        ))}
      </div>
      <p className="type-body-m text-blue07 u-mt-[24] u-w-[385] mob:u-mt-[18] mob:u-w-[264]">
        We hold ourselves to strict compliance and service standards.
        <br />
        Registered, accredited, and audited for healthcare work.
      </p>
    </section>
  )
}
