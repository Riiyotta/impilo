import SmallCard from './SmallCard'

/*
 * Card grid (BLOG_SPEC B1.2 VirtualCardList). The original virtualizes rows of N cards
 * (3 desktop / 2 tablet / 1 mobile) with 44px between rows (28 mobile) and 25px column gap;
 * with a handful of posts every card is simply rendered in one grid with the same gaps.
 */
export default function CardGrid({ posts }) {
  return (
    <div className="grid grid-cols-3 u-gap-x-[25] u-gap-y-[28] tab:grid-cols-2 mob:grid-cols-1">
      {posts.map((post) => (
        <SmallCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
