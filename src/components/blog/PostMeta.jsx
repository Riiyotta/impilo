import { formatDate } from '../../data/posts'

/* Date | By author row (BLOG_SPEC B1.2 details row / B2.3 PublishDate): three flex items. */
export default function PostMeta({ post, className = '' }) {
  return (
    <div className={`flex type-body-xs text-silver01 u-gap-[8] ${className}`}>
      <div>{formatDate(post)}</div>|<div>By {post.blogAuthorName}</div>
    </div>
  )
}
