import FieldMessage from './FieldMessage'

/*
 * Input__Field / Input__Control (spec R.2). States: default border blue03, hover blue04,
 * focus = no ring, invalid ([data-invalid]) border brightTurquoise + in-field message.
 * Styling lives in pages.css (.field / .field__control).
 */
export default function TextInput({ error, className = '', ...inputProps }) {
  return (
    <div
      className={`field flex items-center u-gap-[8] u-h-[66] p-0 u-rounded-[12] u-w-[550] tab:w-full mob:u-w-[297] ${className}`}
      data-invalid={error ? '' : undefined}
    >
      <input
        className="field__control block h-full w-full type-h4 u-px-[21] u-rounded-[12] mob:type-body-r"
        aria-invalid={error ? true : undefined}
        {...inputProps}
      />
      <FieldMessage className="u-pl-[10] u-pr-[21]">{error}</FieldMessage>
    </div>
  )
}
