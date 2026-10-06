import FieldMessage from './FieldMessage'

/* TextArea__Field (spec R.2): Input__Field box at height 249; control bodyM, padding 22. */
export default function TextArea({ error, className = '', ...props }) {
  return (
    <div
      className={`field flex items-start u-gap-[8] u-h-[249] p-0 u-rounded-[12] u-w-[550] tab:w-full mob:u-w-[297] ${className}`}
      data-invalid={error ? '' : undefined}
    >
      <textarea className="field__control block h-full w-full type-body-m u-p-[22] u-rounded-[12]" {...props} />
      <FieldMessage className="u-pl-[10] u-pr-[21] u-pt-[22]">{error}</FieldMessage>
    </div>
  )
}
