import PrimaryButton from '../shared/PrimaryButton'

/*
 * Spec 2.1 CallToAction (solution pages): max-width 600, column, gap 32 (mobile 24),
 * padding 0 32 (mobile 0 24). Text blue01, or silver05 when `light` (support-crm dark section).
 * Optional paragraph fades in (TextAnimation).
 */
export default function CallToAction({ text, label, href, light = false }) {
  return (
    <div
      className={`mx-auto flex flex-col items-center u-gap-[32] u-max-w-[600] u-px-[32] mob:u-gap-[24] mob:u-px-[24] ${
        light ? 'text-silver05' : 'text-blue01'
      }`}
    >
      {text && (
        <p className="type-body-r" data-anim="text-fade">
          {text}
        </p>
      )}
      <PrimaryButton href={href}>{label}</PrimaryButton>
    </div>
  )
}
