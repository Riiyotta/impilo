/*
 * Spec 2.1 Section / SectionTitle / SectionSubtitle (template B).
 * Section: padding 120 0 (mobile 80 0), centered text, silver05 or (dark) blue01.
 * SectionTitle: h2 (mobile h3), blue01 or white on dark, mb 64 (mobile 40), padding 0 32 (mobile 0 24)
 * unless `noPad` (DHL, clinic-rpm, support-crm). `tight` = mb 24 (mobile 16) when a subtitle follows.
 */
export function ContentSection({ dark = false, children }) {
  return (
    <section className={`text-center u-py-[120] mob:u-py-[80] ${dark ? 'bg-blue01' : 'bg-silver05'}`}>{children}</section>
  )
}

export function SectionTitle({ dark = false, noPad = false, tight = false, children }) {
  return (
    <h2
      className={`type-h2 mob:type-h3 ${dark ? 'text-silver05' : 'text-blue01'} ${
        tight ? 'u-mb-[24] mob:u-mb-[16]' : 'u-mb-[64] mob:u-mb-[40]'
      } ${noPad ? '' : 'u-px-[32] mob:u-px-[24]'}`}
      data-anim="text-lines"
    >
      {children}
    </h2>
  )
}

export function SectionSubtitle({ children }) {
  return (
    <p className="type-h4 text-silver05 opacity-80 u-mb-[64] u-px-[32] mob:type-body-m mob:u-mb-[40] mob:u-px-[24]">{children}</p>
  )
}
