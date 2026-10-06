import UniversalLink from './UniversalLink'

/*
 * CLONE_SPEC 0.5 Primary button: wrapper > inner > overflow > label x2 (rolling swap on hover).
 * With `href` it is a link (internal hrefs use the slide page transition); without one it renders
 * a <button> (e.g. form submit; pass type="submit").
 */
export default function PrimaryButton({ href, children, className = '', innerClassName = '', ...rest }) {
  const inner = (
    <span className={`btn-primary__inner type-body-l ${innerClassName}`}>
      <span className="btn-primary__overflow">
        <span className="btn-primary__label">{children}</span>
        <span className="btn-primary__label" aria-hidden="true">
          {children}
        </span>
      </span>
    </span>
  )
  if (href === undefined) {
    return (
      <button type="button" className={`btn-primary ${className}`} {...rest}>
        {inner}
      </button>
    )
  }
  return (
    <UniversalLink href={href} className={`btn-primary ${className}`} {...rest}>
      {inner}
    </UniversalLink>
  )
}
