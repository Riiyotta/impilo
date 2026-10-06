import PrimaryButton from './shared/PrimaryButton'

/*
 * CLONE_SPEC 10. Section 8: CTA. Props default to the homepage copy; other pages reuse the
 * section with their own title/button.
 */
export default function Cta({
  title = 'Learn how Impilo empowers your virtual care program',
  buttonLabel = 'Request Demo',
  href = '/request-demo/',
}) {
  return (
    <section className="grid w-full place-items-center bg-silver05 u-rounded-b-[24]">
      <div className="flex w-full max-w-page flex-col items-center u-gap-[25] u-pb-[220] u-pt-[244] u-px-[137] tab:u-pb-[200] tab:u-pt-[250] tab:u-px-[50] mob:u-pb-[115] mob:u-pt-[150] mob:u-px-[15]">
        <h1 className="text-center type-h2 text-blue01 mob:type-h3" data-anim="text-lines">
          {title}
        </h1>
        <PrimaryButton href={href}>{buttonLabel}</PrimaryButton>
      </div>
    </section>
  )
}
