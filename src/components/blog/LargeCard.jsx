import BlogImage from './BlogImage'
import PostMeta from './PostMeta'
import TextArrowButton from './TextArrowButton'
import { useTransitionNavigate } from '../PageTransition'

/*
 * LargeCard (BLOG_SPEC B1.2): featured (newest) post. The whole card is clickable and navigates
 * with the slide transition. Image box: 3/2 desktop (natural 3:2 wins over 920/440), 520/440
 * tablet, 313/210 mobile.
 */
export default function LargeCard({ post }) {
  const go = useTransitionNavigate()
  const href = `/blog/${post.slug}/`
  return (
    <div
      className="border-b border-lavender05 u-mb-[40] u-pb-[28] mob:border-b-0 mob:u-mb-[44] mob:pb-0"
      onClick={() => go && go(href)}
    >
      <BlogImage
        src={post.mainImage.src}
        width={post.mainImage.width}
        height={post.mainImage.height}
        className="aspect-[3/2] u-rounded-[16] tab:aspect-[520/440] mob:aspect-[313/210]"
      />
      <PostMeta post={post} className="u-mt-[24] mob:u-mt-[12]" />
      <h1 className="type-h3 text-blue02 u-mb-[24] u-mt-[8] mob:type-h4 mob:u-mb-[12] mob:u-mt-[10]">{post.title}</h1>
      <TextArrowButton href={href} onClick={(e) => e.stopPropagation()}>
        Read Article
      </TextArrowButton>
    </div>
  )
}
