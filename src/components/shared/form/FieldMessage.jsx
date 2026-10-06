/* Validation message shown inside the field, right-aligned after the control (spec R.2). */
export default function FieldMessage({ children, className = '' }) {
  if (!children) return null
  return (
    <span className={`shrink-0 whitespace-nowrap type-kicker-s text-brightTurquoise ${className}`} role="alert">
      {children}
    </span>
  )
}
