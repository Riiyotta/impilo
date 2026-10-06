import InlineSvg from '../shared/InlineSvg'
import PrimaryAction from '../shared/PrimaryAction'
import pulseSvg from '../../assets/svg/about-large-pulse.svg?raw'

/* COMPANY_PAGES_SPEC A.5 Careers: white card, looping pulse line, CTA. */
export default function Careers() {
  return (
    <section className="mx-auto u-mb-[14] u-mt-[140] u-w-[1340] tab:mb-0 tab:u-mt-[205] tab:u-w-[924] mob:mb-0 mob:u-mt-[65] mob:u-w-[344]">
      <div className="grid place-items-center bg-silver05 u-py-[100] u-rounded-[24] mob:u-py-[60]">
        <InlineSvg svg={pulseSvg} className="block h-auto u-w-[330] mob:u-w-[260]" aria-hidden="true" data-anim="about-pulse" />
        <h1 className="text-center type-h2 text-blue01 u-mt-[40] mob:type-h4" data-anim="page-text-lines">
          Build with us
        </h1>
        <p
          className="text-center type-body-r text-blue01 u-mb-[46] u-mt-[27] u-w-[674] mob:type-body-m mob:u-w-[270]"
          data-anim="page-text-fade"
        >
          We are a diverse group united by one goal: making at-home care simpler for every patient and family.
        </p>
        <PrimaryAction to="/careers/">See Open Positions</PrimaryAction>
      </div>
    </section>
  )
}
