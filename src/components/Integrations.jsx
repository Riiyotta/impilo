import InlineSvg from './shared/InlineSvg'
import Pill from './shared/Pill'
import PrimaryButton from './shared/PrimaryButton'
import integration1 from '../assets/svg/integration-1.svg?raw'
import integration2 from '../assets/svg/integration-2.svg?raw'
import integration3 from '../assets/svg/integration-3.svg?raw'

const CARDS = [
  { svg: integration1, label: 'Comprehensive Integration' },
  { svg: integration2, label: 'Data Synchronization' },
  {
    svg: integration3,
    label: (
      <>
        Data Visualizations
        <br />
        and Reporting
      </>
    ),
  },
]

/* CLONE_SPEC 9. Section 7: Integrations */
export default function Integrations() {
  return (
    <section className="grid w-full place-items-center bg-silver05">
      <div className="flex w-full max-w-page flex-col items-center u-pt-[220] u-px-[95] tab:u-px-[50] mob:u-px-[15]">
        <Pill />
        <h1
          className="text-center type-h2 text-blue01 u-mt-[16] u-w-[1111] tabdown:w-full mob:type-h3"
          data-anim="text-lines"
        >
          Patient care,
          <br />
          our integrations.
          <br />
          It&apos;s a perfect match.
        </h1>
        <div className="flex items-center u-gap-[40] u-my-[55] tab:flex-wrap tab:justify-center mob:flex-col">
          {CARDS.map((card, i) => (
            <div
              key={i}
              className="relative flex flex-col items-center justify-end border border-blue04 u-h-[280] u-py-[40] u-rounded-[24] u-w-[390] mob:u-w-[345]"
            >
              <InlineSvg
                svg={card.svg}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible u-h-[240] u-w-[248]"
                data-anim="integration-illustration"
                data-index={i}
                aria-hidden="true"
              />
              <span className="relative z-[2] text-center type-h4 text-blue01">{card.label}</span>
            </div>
          ))}
        </div>
        <p className="text-center type-body-r text-blue01 u-mb-[24] u-w-[425] mob:w-full" data-anim="text-fade">
          Connect popular health devices, apps, existing EHR and workflows via our API &amp; SDK for a unified, up to date
          view of your patient wellness journey. Custom integrations available upon request.
        </p>
        <PrimaryButton href="/integrations/">Explore Our Integrations</PrimaryButton>
      </div>
    </section>
  )
}
