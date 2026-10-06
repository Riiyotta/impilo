import PrimaryButton from '../shared/PrimaryButton'
import StatsRow from './StatsRow'

/*
 * Spec 2.1 Hero (template B). contentWidth 1000 | 800. subtitleVariant:
 *  a = h5/bodyM white .9 (mobile bodyR); b = h4 white .9 (mobile h5).
 * Fade-animated text is wrapped so TextAnimation's opacity tween doesn't clobber the .9/.8 opacity.
 */
export default function ContentHero({
  title,
  subtitle,
  subtitleVariant = 'a',
  description,
  cta,
  stats,
  contentWidth = 1000,
  mobileTitle = 'h3',
}) {
  const subtitleClass = subtitleVariant === 'b' ? 'type-h4 mob:type-body-m' : 'type-body-m mob:type-body-r'
  return (
    <section className="grid min-h-[80vh] place-items-center bg-blue01 u-py-[120] mob:u-py-[80]">
      <div
        className={`flex flex-col items-center text-center u-gap-[32] u-px-[32] mob:u-gap-[24] mob:u-px-[24] ${
          contentWidth === 800 ? 'u-max-w-[800]' : 'u-max-w-[1000]'
        }`}
      >
        <h1 className={`type-h1 text-silver05 ${mobileTitle === 'h2' ? 'mob:type-h2' : 'mob:type-h3'}`} data-anim="text-lines">
          {title}
        </h1>
        <div data-anim="text-fade">
          <p className={`${subtitleClass} text-silver05 opacity-90`}>{subtitle}</p>
        </div>
        {description && (
          <div data-anim="text-fade">
            <p className="type-body-m text-silver05 opacity-80 mob:type-body-r">{description}</p>
          </div>
        )}
        <PrimaryButton href={cta.href}>{cta.label}</PrimaryButton>
        {stats && <StatsRow stats={stats} />}
      </div>
    </section>
  )
}
