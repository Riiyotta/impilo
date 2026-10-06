import { Link } from 'react-router-dom'

/*
 * CLONE_SPEC 0.5 Primary button markup for route pages:
 *  - `to`   -> react-router <Link> (internal navigation)
 *  - `href` -> plain <a> (mailto: etc.)
 *  - neither -> <button> (default type "submit"), used by the request-demo form.
 * Same classes as PrimaryButton, so the hover roll is identical.
 */
function Label({ children }) {
  return (
    <span className="btn-primary__inner type-body-l">
      <span className="btn-primary__overflow">
        <span className="btn-primary__label">{children}</span>
        <span className="btn-primary__label" aria-hidden="true">
          {children}
        </span>
      </span>
    </span>
  )
}

export default function PrimaryAction({ to, href, type = 'submit', children, className = '', ...rest }) {
  const cls = `btn-primary ${className}`
  if (to)
    return (
      <Link to={to} className={cls} {...rest}>
        <Label>{children}</Label>
      </Link>
    )
  if (href)
    return (
      <a href={href} className={cls} {...rest}>
        <Label>{children}</Label>
      </a>
    )
  return (
    <button type={type} className={cls} {...rest}>
      <Label>{children}</Label>
    </button>
  )
}
