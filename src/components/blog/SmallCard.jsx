import BlogImage from './BlogImage'
import UniversalLink from '../shared/UniversalLink'

/*
 * SmallCard (BLOG_SPEC B1.2): link to the post; image + clamped title. No hover state at all.
 * Image aspect 290/210 (tablet 246/196 on the index grid only; the post's related cards keep
 * 290/210 at tablet, measured 240x173.3 at 768), mobile 313/210.
 */
export default function SmallCard({ post, related = false }) {
  return (
    <UniversalLink
      href={`/blog/${post.slug}/`}
      className="flex flex-col u-gap-[12] u-max-h-[300] tab:u-max-h-[290]"
    >
      <BlogImage
        src={post.mainImage.src}
        width={post.mainImage.width}
        height={post.mainImage.height}
        className={`aspect-[290/210] shrink-0 u-rounded-[16] mob:aspect-[313/210] ${related ? '' : 'tab:aspect-[246/196]'}`}
      />
      <span className="small-card__title type-body-r text-blue02 u-my-[-4] u-py-[4]">{post.title}</span>
    </UniversalLink>
  )
}
