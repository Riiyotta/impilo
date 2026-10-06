import PrimaryAction from '../shared/PrimaryAction'

/* COMPANY_PAGES_SPEC I.1 Hero: pinned at its bottom, inner parallaxes out (-40vh). */
export default function IntegrationsHero() {
  return (
    <section
      className="grid min-h-[100vh] w-full place-items-center u-pb-[200] mob:u-pb-[100]"
      data-anim="int-hero"
    >
      <div className="flex w-full flex-col items-center text-center u-max-w-[1440] u-pt-[50] u-px-[50] tab:u-max-w-[1024] mob:pt-0 mob:u-max-w-[500] mob:u-px-[23]">
        <h1 className="type-h1 text-silver05 u-mb-[42] u-p-[8] u-w-[1094] tab:type-h2 tab:u-w-[924] mob:type-h3 mob:u-mb-[35] mob:u-w-[329]">
          Upgrade Your RPM Program with the Impilo SDK/API
        </h1>
        <div className="flex flex-col items-center u-gap-[20] u-mt-[53] tab:u-mt-[62] mob:u-gap-[28] mob:u-mt-[-15]">
          <p
            className="type-body-r text-silver05 u-p-[8] u-w-[710] mob:p-0 mob:u-w-[329]"
            data-anim="page-text-fade"
          >
            Delivering care to patients comes first for your team. We built our SDK and API to take the heavy lifting
            out of remote patient monitoring logistics, so providers can spend less time on operations and more time
            with patients.
          </p>
          <PrimaryAction to="/developers/">API Documentation</PrimaryAction>
          <PrimaryAction to="/request-demo/">Request Demo</PrimaryAction>
        </div>
      </div>
    </section>
  )
}
