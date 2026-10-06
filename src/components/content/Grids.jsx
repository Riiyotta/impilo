/*
 * Spec 2.1 grid blocks (template B). Shared base: grid, gap 40, max-width 1200, centered, padding 0 32;
 * mobile 1 column, padding 0 24, gap 32. 3-/4-column grids drop to 2 on tablet (spec 2.5).
 * None of these are animated.
 * Tablet: the original leaves item-title / column margins as raw px (16 / 32 / 12) while paddings, gaps
 * and fonts scale; measured at 768, hence the tab:mb-[Npx] overrides.
 */
const BASE = 'mx-auto grid u-px-[32] mob:grid-cols-1 mob:u-px-[24]'
const MAX = 'u-max-w-[1200]'
const GAP = 'u-gap-[40] mob:u-gap-[32]'
const COLS = {
  2: 'grid-cols-2',
  3: 'grid-cols-3 tab:grid-cols-2',
  4: 'grid-cols-4 tab:grid-cols-2',
}
const CARD = 'border-solid border-lavender04 u-rounded-[24] [border-width:calc(var(--u)*1)]'

/*
 * BorderedCardGrid (CardGrid): left-aligned cards. `compact` = DTP variant (gap 32 / mobile 24,
 * padding 32 / mobile 24); default padding 40, mobile 32 24 (impilo-platform).
 * `dark`: blue02 card, white text, desc .9. The border stays lavender04 (the original's blue03
 * override loses to its media-query border; replicated on purpose).
 */
export function BorderedCardGrid({ items, columns = 3, compact = false, dark = false }) {
  const gap = compact ? 'u-gap-[32] mob:u-gap-[24]' : GAP
  const pad = compact ? 'u-p-[32] mob:u-p-[24]' : 'u-p-[40] mob:u-px-[24] mob:u-py-[32]'
  return (
    <div className={`${BASE} ${MAX} ${gap} ${COLS[columns]}`}>
      {items.map((it) => (
        <div key={it.title} className={`${CARD} ${pad} text-left ${dark ? 'bg-blue02' : 'bg-silver04'}`}>
          <h3 className={`type-h4 u-mb-[16] tab:mb-[16px] mob:type-body-m mob:u-mb-[12] ${dark ? 'text-silver05' : 'text-blue01'}`}>
            {it.title}
          </h3>
          <p className={`type-body-r mob:type-body-m ${dark ? 'text-silver05 opacity-90' : 'text-blue01'}`}>{it.text}</p>
        </div>
      ))}
    </div>
  )
}

/* IconCardGrid (Services / Benefits / Features with icon): centered cards with an 80x80 icon box (48 svg). */
export function IconCardGrid({ items, columns = 3 }) {
  return (
    <div className={`${BASE} ${MAX} ${GAP} ${COLS[columns]}`}>
      {items.map((it) => (
        <div key={it.title} className={`${CARD} flex flex-col items-center bg-silver04 text-center u-p-[40] mob:u-px-[24] mob:u-py-[32]`}>
          <div className="cp-icon-wrap grid place-items-center u-h-[80] u-mb-[24] u-w-[80] mob:u-h-[60] mob:u-mb-[16] mob:u-w-[60]">
            <img src={it.icon} alt="" />
          </div>
          <h3 className="type-h4 text-blue01 u-mb-[16] tab:mb-[16px] mob:type-body-m mob:u-mb-[12]">{it.title}</h3>
          <p className="type-body-r text-blue01 mob:type-body-m">{it.text}</p>
        </div>
      ))}
    </div>
  )
}

/*
 * TextItemGrid (Capabilities, WhyChoose, Features, ...): no card, left-aligned.
 * Dark: white, desc .9. Light: blue01, desc .8. `maxWidth` 1000 = IntelligenceGrid.
 * `centerLast` = DTP DMEGrid ($center on the 3rd item: full row, max-width 600, centered; mobile reverts).
 */
export function TextItemGrid({ items, columns = 2, dark = false, maxWidth, centerLast = false }) {
  return (
    <div className={`${BASE} ${GAP} ${COLS[columns]} ${maxWidth === 1000 ? 'u-max-w-[1000]' : MAX}`}>
      {items.map((it, i) => {
        const center = centerLast && i === items.length - 1
        return (
          <div
            key={it.title}
            className={center ? 'cp-center-item mx-auto text-center u-max-w-[600] [grid-column:1/-1]' : 'text-left'}
          >
            <h3 className={`type-h4 u-mb-[16] tab:mb-[16px] mob:type-body-m mob:u-mb-[12] ${dark ? 'text-silver05' : 'text-blue01'}`}>
              {it.title}
            </h3>
            <p className={`type-body-r mob:type-body-m ${dark ? 'text-silver05 opacity-90' : 'text-blue01 opacity-80'}`}>
              {it.text}
            </p>
          </div>
        )
      })}
    </div>
  )
}

/* TwoColumnGrid (impilo-platform dark): column headline h3 + items (h5 title, bodyR .9 text), white. */
export function TwoColumnGrid({ columns }) {
  return (
    <div className={`${BASE} ${MAX} grid-cols-2 u-gap-[60] mob:u-gap-[48]`}>
      {columns.map((col) => (
        <div key={col.headline} className="text-left text-silver05">
          <h3 className="type-h3 u-mb-[32] tab:mb-[32px] mob:type-h4 mob:u-mb-[24]">{col.headline}</h3>
          {col.items.map((it) => (
            <div key={it.title} className="u-mb-[32] last:!mb-0 tab:mb-[32px] mob:u-mb-[24]">
              <h4 className="type-body-m u-mb-[12] tab:mb-[12px] mob:type-body-l mob:u-mb-[8]">{it.title}</h4>
              <p className="type-body-r opacity-90 mob:type-body-m">{it.text}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

/* OutcomesList: bulleted ul, max-width 800, bullets blue03. */
export function OutcomesList({ items }) {
  return (
    <ul className="cp-outcomes mx-auto list-none text-left u-max-w-[800] u-px-[32] mob:u-px-[24]">
      {items.map((t) => (
        <li key={t} className="relative type-body-r text-blue01 u-mb-[16] pl-[24px] mob:type-body-m mob:u-mb-[12]">
          {t}
        </li>
      ))}
    </ul>
  )
}
