/*
 * LineFillText (spec 0.2). Renders the element; the page animation splits it into
 * div.give-me-clipping-please lines and scrubs the gradient fill. FILL/BASE colors come from
 * `--lf-fill` / `--lf-base` set on the element (pages.css or `style`).
 */
export default function LineFillText({ as: Tag = 'p', className = '', children, ...rest }) {
  return (
    <Tag className={className} data-line-fill="" {...rest}>
      {children}
    </Tag>
  )
}
