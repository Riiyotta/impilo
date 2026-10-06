import '../../styles/blog.css'
import { useParams } from 'react-router-dom'
import InlineSvg from '../../components/shared/InlineSvg'
import UniversalLink from '../../components/shared/UniversalLink'
import BlogImage from '../../components/blog/BlogImage'
import PostMeta from '../../components/blog/PostMeta'
import RichText from '../../components/blog/RichText'
import Share from '../../components/blog/Share'
import SmallCard from '../../components/blog/SmallCard'
import { CategoryPill } from '../../components/blog/Categories'
import breadcrumbArrow from '../../assets/svg/blog/breadcrumb-arrow.svg?raw'
import { getPost, getRelated } from '../../data/posts'
import { useDocumentMeta } from '../../lib/meta'
import NotFound from '../NotFound'

/*
 * Blog post /blog/:slug/ (BLOG_SPEC B2). One template for every post.
 * Share column pin: CSS sticky top 120 (the spec's accepted equivalent of the ScrollTrigger pin).
 */
export default function BlogPost() {
  const { slug } = useParams()
  const post = getPost(slug)
  if (!post) return <NotFound />
  return <PostView post={post} />
}

function PostView({ post }) {
  useDocumentMeta({ title: post.title, description: post.articleTextPreview })
  const related = getRelated(post)
  return (
    <>
      <div className="u-h-[30]" />
      <div className="bg-silver05 u-mx-[10] u-pb-[100] u-pt-[40] u-rounded-[16] mob:u-mx-[15] mob:u-pb-[85] mob:u-pt-[20] mob:u-px-[16]">
        <div className="mx-auto flex items-center type-body-m u-gap-[6] u-pb-[16] u-w-[680] mob:hidden">
          <UniversalLink href="/blog/" className="text-blue06">
            Blog
          </UniversalLink>
          <InlineSvg svg={breadcrumbArrow} className="h-auto u-w-[13]" aria-hidden="true" />
          <div className="mr-auto text-blue01">Article</div>
        </div>

        <div className="grid grid-cols-[1fr_calc(var(--u)*680)_1fr] u-gap-[36] u-mb-[44] mob:grid-cols-1 mob:gap-0 mob:u-mb-[24]">
          <div />
          <article className="min-w-0 border-b border-lavender05 u-pb-[24] mob:border-b-0 mob:u-pb-[20]">
            <BlogImage
              src={post.mainImage.src}
              width={post.mainImage.width}
              height={post.mainImage.height}
              className="aspect-[3/2] u-rounded-[16]"
            />
            <PostMeta post={post} className="u-mt-[28] mob:u-mt-[12]" />
            <h1 className="type-h3 text-blue01 u-mt-[8] mob:type-h4">{post.title}</h1>
            {post.categories.length > 0 && (
              <div className="flex flex-wrap u-gap-[12] u-mb-[36] u-mt-[28] mob:u-mb-[20] mob:u-mt-[12]">
                {post.categories.map((name) => (
                  <CategoryPill key={name} name={name} />
                ))}
              </div>
            )}
            <RichText blocks={post.articleText} />
          </article>
          <div>
            <div className="sticky u-top-[120] mob:static">
              <Share />
            </div>
          </div>
        </div>

        <div className="mx-auto grid grid-cols-2 u-gap-x-[40] u-gap-y-[26] u-w-[680] mob:w-full mob:grid-cols-1 mob:u-gap-[44]">
          <h4 className="col-span-2 type-h4 text-blue01 mob:col-span-1">{related.title}</h4>
          {related.posts.map((p) => (
            <SmallCard key={p.slug} post={p} related />
          ))}
        </div>
      </div>
    </>
  )
}
