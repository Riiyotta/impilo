import PagePill from '../shared/PagePill'
import LineFillText from '../shared/LineFillText'

/* COMPANY_PAGES_SPEC A.3 Anywhere: white pill, title, line-fill paragraph, floating stethoscope. */
export default function Anywhere() {
  return (
    <section className="relative mx-auto grid place-items-center bg-blue05 text-center u-pb-[400] u-pt-[200] u-w-[1076] tab:u-w-[925] mob:u-pb-[227] mob:u-pt-[77] mob:u-w-[345]">
      <div
        className="absolute u-right-[405] u-top-[859] u-w-[853] tab:u-right-[171] mob:u-right-[16] mob:u-top-[543] mob:u-w-[333]"
        data-anim="about-stethoscope"
      >
        <img src="/assets/svg/about-stethoscope.svg" alt="" aria-hidden="true" className="inline h-auto w-full align-baseline" />
      </div>
      <PagePill white />
      <h1 className="type-h2 text-silver05 u-mt-[24] mob:type-h3" data-anim="page-text-lines">
        Delivering quality care anywhere
      </h1>
      <div data-anim="page-text-fade">
        <LineFillText className="about-anywhere__text type-body-xl text-lavender04 u-mt-[83] mob:type-h4 mob:u-mt-[43]">
          Our ready-to-use kits combine remote monitoring devices, medical supplies and connected sensors with
          fulfillment, tech-enabled support services and integration APIs that connect every reading to your clinical
          team. Everything operates within the workflows and software you already use, so programs run smoothly
          without the burden of managing hardware.
        </LineFillText>
      </div>
    </section>
  )
}
