import InlineSvg from '../shared/InlineSvg'
import searchSvg from '../../assets/svg/blog/search.svg?raw'

/* SearchBar (BLOG_SPEC B1.3): icon + input; value lives in the URL (?query=). */
export default function SearchBar({ value, onChange, className = '' }) {
  return (
    <div className={`relative flex grow items-center ${className}`}>
      <InlineSvg svg={searchSvg} className="absolute u-left-[16] u-h-[18] u-w-[18]" aria-hidden="true" />
      <input
        type="text"
        aria-label="Search the Blog"
        placeholder="Search the Blog..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="blog-search w-full border border-lavender04 bg-lavender06 type-body-m text-blue01 u-h-[52] u-rounded-[12] u-pb-[16] u-pl-[48] u-pr-[16] u-pt-[16]"
      />
    </div>
  )
}
