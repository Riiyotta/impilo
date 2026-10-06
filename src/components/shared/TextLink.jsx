import InlineSvg from './InlineSvg'
import UniversalLink from './UniversalLink'
import arrowSvg from '../../assets/svg/icon-link-arrow.svg?raw'

/* CLONE_SPEC 0.5 Text link: arrow first, then label. variant: default | blue | menu */
export default function TextLink({ href, children, variant = 'default', className = '', ...rest }) {
  const variantClass =
    variant === 'blue' ? 'text-link--blue type-body-m' : variant === 'menu' ? 'text-link--menu type-h4' : 'type-body-m'
  return (
    <UniversalLink href={href} className={`text-link ${variantClass} ${className}`} {...rest}>
      <InlineSvg svg={arrowSvg} className="text-link__arrow" aria-hidden="true" />
      <span>{children}</span>
    </UniversalLink>
  )
}
