import PrimaryButton from '../shared/PrimaryButton'

/*
 * Spec 2.1 CTAWrapper: grid centered, margin-top 64 (mobile 40). In use-case CTA-only sections the
 * margin collapses with the title's 64/40 margin-bottom. `flush` = no margin (impilo-platform's last
 * section: measured title mb 24/16 and the button directly below it).
 */
export default function CtaRow({ label, href, flush = false }) {
  return (
    <div className={`grid place-items-center ${flush ? '' : 'u-mt-[64] mob:u-mt-[40]'}`}>
      <PrimaryButton href={href}>{label}</PrimaryButton>
    </div>
  )
}
