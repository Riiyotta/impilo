import { Link } from 'react-router-dom'
import { useTransitionNavigate } from '../PageTransition'

export const isInternal = (href) => typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')

/*
 * UniversalLink (original UniversalLink): internal hrefs ("/...") render a react-router <Link>
 * and navigate with the "slide" page transition; anything else (mailto:, tel:) is a plain <a>.
 * Modified clicks (cmd/ctrl/shift/middle) keep the browser default.
 */
export default function UniversalLink({ href, onClick, children, ...rest }) {
  const go = useTransitionNavigate()
  if (!isInternal(href) || !go) {
    return (
      <a href={href} onClick={onClick} {...rest}>
        {children}
      </a>
    )
  }
  const handleClick = (e) => {
    onClick && onClick(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (rest.target && rest.target !== '_self') return
    e.preventDefault()
    go(href)
  }
  return (
    <Link to={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  )
}
