import '../../styles/blog.css'
import { useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import InlineSvg from '../../components/shared/InlineSvg'
import LargeCard from '../../components/blog/LargeCard'
import CardGrid from '../../components/blog/CardGrid'
import SearchBar from '../../components/blog/SearchBar'
import EmailInput from '../../components/blog/EmailInput'
import Categories from '../../components/blog/Categories'
import clearSvg from '../../assets/svg/blog/clear-filter.svg?raw'
import { SORTED_POSTS } from '../../data/posts'
import { createSearch } from '../../lib/search'
import { useDocumentMeta } from '../../lib/meta'
import { ScrollTrigger } from '../../animations/utils'

const search = createSearch(SORTED_POSTS)

const MobileOnly = ({ children }) => <div className="hidden mob:block">{children}</div>

const headerClass =
  'flex items-center justify-between type-h4 text-blue01 u-gap-[14] u-mb-[22] tab:u-mb-[28] mob:grid mob:u-gap-[16] mob:u-mb-[44]'

/*
 * Blog index /blog/ (BLOG_SPEC B1). Filtering and search are query params (?category=, ?query=)
 * shared by both search inputs and all category buttons through the URL (replace, no navigation).
 * Sidebar pin: CSS sticky top 40 (the spec's accepted equivalent of the ScrollTrigger pin).
 */
export default function BlogIndex() {
  useDocumentMeta({ title: 'Impilo | Blog', description: 'Impilo Blog.' })
  const [params, setParams] = useSearchParams()
  const query = params.get('query') || ''
  const category = params.get('category') || ''
  const filtered = Boolean(query || category)

  const update = (next) => {
    const p = new URLSearchParams(params)
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)))
    setParams(p, { replace: true })
  }
  const onQuery = (q) => update({ query: q })
  const onCategory = (name) => update({ category: name })
  const clear = () => setParams(new URLSearchParams(), { replace: true })

  const results = useMemo(() => {
    let list = query.trim() ? search(query) : SORTED_POSTS
    if (category) list = list.filter((post) => post.categories.includes(category))
    return list
  }, [query, category])

  // On a param change: jump to the top (no animation) and refresh ScrollTrigger.
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    window.scrollTo(0, 0)
    ScrollTrigger.refresh()
  }, [query, category])

  const [featured, ...rest] = SORTED_POSTS

  let heading = null
  let clearLabel = ''
  if (query && category) {
    heading = <div className="mob:type-body-r">Search results for “{query}” in {category}</div>
    clearLabel = 'Clear Search / Category'
  } else if (query) {
    heading = <div className="text-blue01 mob:type-body-r">Search results for “{query}”</div>
    clearLabel = 'Clear Search'
  } else if (category) {
    heading = <div className="mob:type-body-r">Categories / {category}</div>
    clearLabel = 'Clear Category'
  }

  return (
    <div className="flex justify-center u-pt-[30] mob:pt-0">
      <div className="min-h-[100lvh] bg-silver05 u-rounded-[24] u-w-[1420] tab:u-w-[1002] mob:u-rounded-[16] mob:u-w-[345]">
        <div className="grid min-h-[100lvh] grid-cols-[minmax(0,1fr)_auto] u-gap-[30] u-pb-[60] u-pt-[40] u-px-[40] tab:u-gap-[20] mob:grid-cols-1 mob:gap-0 mob:u-px-[16] mob:u-py-[20]">
          <MobileOnly>
            <SearchBar value={query} onChange={onQuery} className="u-mb-[12]" />
          </MobileOnly>

          <div className="min-w-0">
            {filtered ? (
              <>
                <div className={`${headerClass} mob:type-body-r`}>
                  {heading}
                  <button
                    type="button"
                    onClick={clear}
                    className="flex items-center whitespace-nowrap type-body-m text-blue02 u-gap-[10]"
                  >
                    <InlineSvg svg={clearSvg} className="u-h-[18] u-w-[18]" aria-hidden="true" />
                    {clearLabel}
                  </button>
                </div>
                {results.length ? (
                  <CardGrid posts={results} />
                ) : (
                  <p className="type-body-r">No Results Found</p>
                )}
                <MobileOnly>
                  <div className="h-[30lvh]" />
                  <EmailInput />
                  <Categories mobile="filtered" onSelect={onCategory} />
                </MobileOnly>
              </>
            ) : (
              <>
                <LargeCard post={featured} />
                <MobileOnly>
                  <EmailInput />
                  <Categories mobile onSelect={onCategory} />
                </MobileOnly>
                <div className={headerClass}>Previous Articles</div>
                <CardGrid posts={rest} />
              </>
            )}
          </div>

          <div className="border-l border-lavender06 u-pl-[30] u-w-[390] tab:u-pl-[20] mob:hidden">
            <div className="sticky flex flex-col u-gap-[28] u-top-[40]">
              <SearchBar value={query} onChange={onQuery} />
              <EmailInput />
              <Categories onSelect={onCategory} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
