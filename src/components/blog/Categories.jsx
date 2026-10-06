import InlineSvg from '../shared/InlineSvg'
import UniversalLink from '../shared/UniversalLink'
import categoriesSvg from '../../assets/svg/blog/categories.svg?raw'
import categoryArrow from '../../assets/svg/blog/category-arrow.svg?raw'
import { CATEGORIES } from '../../data/posts'

/*
 * Category pill (BLOG_SPEC B1.3): <button> on the index (sets ?category= without navigating),
 * <a href="/blog?category=..."> on posts. No hover state.
 */
export function CategoryPill({ name, onSelect }) {
  const content = (
    <>
      {name}
      <InlineSvg svg={categoryArrow} aria-hidden="true" />
    </>
  )
  if (onSelect) {
    return (
      <button type="button" className="category-pill type-body-xs" onClick={() => onSelect(name)}>
        {content}
      </button>
    )
  }
  return (
    <UniversalLink href={`/blog?category=${encodeURIComponent(name)}`} className="category-pill type-body-xs">
      {content}
    </UniversalLink>
  )
}

/*
 * Categories block (BLOG_SPEC B1.3): kicker header + wrapping pill list.
 * mobile: true -> default-state mobile instance (list gets the bottom divider);
 * mobile: 'filtered' -> filtered-state mobile instance (measured: no divider, margin-bottom 10).
 */
export default function Categories({ onSelect, mobile = false }) {
  return (
    <div>
      <div
        className={`flex items-center border-b border-lavender05 type-kicker-r text-blue03 u-gap-[10] u-my-[24] u-pb-[18] ${mobile ? 'mob:u-mt-[52]' : ''}`}
      >
        <InlineSvg svg={categoriesSvg} className="u-h-[14] u-w-[18]" aria-hidden="true" />
        Categories
      </div>
      <div
        className={`flex flex-wrap u-gap-[10] ${
          mobile === 'filtered'
            ? 'u-mb-[10]'
            : mobile
              ? 'mob:border-b mob:border-lavender05 mob:u-mb-[24] mob:u-pb-[22]'
              : ''
        }`}
      >
        {CATEGORIES.map((name) => (
          <CategoryPill key={name} name={name} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}
