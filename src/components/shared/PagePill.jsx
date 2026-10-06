import Pill from './Pill'

/*
 * Pill for route pages. `white` gives the white variant (spec 0.2: background #fff, path fill
 * blue01, same size and loop). data-anim is "page-pill" so the page runner drives the loop.
 */
export default function PagePill({ white = false, className = '', ...rest }) {
  return <Pill className={`${white ? 'pill--white' : ''} ${className}`} data-anim="page-pill" {...rest} />
}
