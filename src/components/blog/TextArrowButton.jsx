import InlineSvg from '../shared/InlineSvg'
import UniversalLink from '../shared/UniversalLink'
import textArrow from '../../assets/svg/blog/text-arrow.svg?raw'

/* TextArrowButton (BLOG_SPEC B1.2): bodyM label + 13px arrow, 3-layer shadow, hover brightGreen. */
export default function TextArrowButton({ href, children, className = '', ...rest }) {
  return (
    <UniversalLink href={href} className={`text-arrow-btn type-body-m ${className}`} {...rest}>
      {children}
      <InlineSvg svg={textArrow} aria-hidden="true" />
    </UniversalLink>
  )
}
