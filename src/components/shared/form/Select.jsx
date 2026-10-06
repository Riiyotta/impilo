import { useEffect, useId, useRef, useState } from 'react'
import FieldMessage from './FieldMessage'

/*
 * ReferralDropdown (spec R.2), a look-alike of Radix Select in popper mode:
 *  - trigger: Input__Field box, padding 0 20, h4, chevron flips (scale 1 -1) while open
 *  - content: below the trigger with an 8 design-px offset, trigger width, z 2, no open animation
 *  - items: bodyR, padding 11 22 (first/last 14 outer), highlight bg #16165855
 * Keyboard: Enter / Space / ArrowUp / ArrowDown open; arrows move; Enter / Space select;
 * Escape / Tab close. Click outside closes.
 */
export default function Select({ name, placeholder, options, value, onChange, error }) {
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const listId = useId()
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    const onPointer = (e) => {
      if (!rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [open])

  const openList = () => {
    setHighlight(Math.max(0, options.findIndex((o) => o.value === value)))
    setOpen(true)
  }
  const choose = (i) => {
    onChange(options[i].value)
    setOpen(false)
    triggerRef.current.focus()
  }
  const onKeyDown = (e) => {
    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault()
        openList()
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => Math.min(options.length - 1, h + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => Math.max(0, h - 1))
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (highlight >= 0) choose(highlight)
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      if (e.key === 'Escape') e.preventDefault()
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className="relative u-w-[550] tab:w-full mob:u-w-[297]">
      <button
        ref={triggerRef}
        type="button"
        name={name}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={error ? true : undefined}
        data-state={open ? 'open' : 'closed'}
        data-placeholder={selected ? undefined : ''}
        data-invalid={error ? '' : undefined}
        className="field select__trigger flex w-full items-center type-h4 u-gap-[8] u-h-[66] u-px-[20] u-rounded-[12] mob:type-body-r"
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
      >
        <span className="select__value mr-auto">{selected ? selected.label : placeholder}</span>
        <FieldMessage className="u-pl-[10] u-pr-[18]">{error}</FieldMessage>
        <img
          src="/assets/svg/icon-chevron-down.svg"
          alt=""
          aria-hidden="true"
          className="select__chevron block h-auto shrink-0 u-w-[18] mob:u-w-[16]"
        />
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          className="select__content absolute left-0 z-[2] m-0 w-full list-none p-0 u-rounded-[12]"
          style={{ top: 'calc(100% + var(--u) * 8)' }}
        >
          {options.map((o, i) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              data-highlighted={i === highlight ? '' : undefined}
              className="select__item type-body-r text-silver05 u-px-[22] u-py-[11]"
              onPointerMove={() => setHighlight(i)}
              onPointerLeave={() => setHighlight(-1)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(i)}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
