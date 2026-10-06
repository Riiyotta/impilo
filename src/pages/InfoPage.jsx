import { useLayoutEffect, useRef } from 'react'
import Pill from '../components/shared/Pill'
import Cta from '../components/Cta'
import { initPageAnimations } from '../animations'

/*
 * Shared shell for simple on-brand content pages (/developers/, /careers/), built from homepage
 * pieces: white panel (radius 24), Pill + h2 heading with the multi-line TextAnimation, h4 intro
 * (WhiteGlove large-text style, text-fade), bordered cards (Integrations card border/radius), and
 * the CTA section. Page-specific motion is built on mount and reverted on unmount.
 */
export function Card({ index, title, children }) {
  return (
    <div className="flex flex-col border border-blue04 u-gap-[16] u-p-[40] u-rounded-[24] mob:u-p-[24]">
      <span className="type-kicker-s text-blue03">{String(index).padStart(2, '0')}</span>
      <h3 className="type-h4 text-blue01">{title}</h3>
      <p className="type-body-r text-blue01">{children}</p>
    </div>
  )
}

export default function InfoPage({ title, intro, cardsTitle, cards, children, cta }) {
  const ref = useRef(null)
  useLayoutEffect(() => initPageAnimations(ref.current), [])
  return (
    <div ref={ref}>
      <div className="u-h-[30]" />
      <div className="overflow-clip bg-silver05 u-mx-[10] u-rounded-[24] mob:u-mx-[15]">
        <section className="flex flex-col items-center u-pb-[100] u-pt-[135] u-px-[50] mob:u-px-[15] mob:u-pt-[100] mob:u-pb-[60]">
          <Pill />
          <h1
            className="text-center type-h2 text-blue02 u-mt-[16] u-w-[1111] tabdown:w-full mob:type-h3"
            data-anim="text-lines"
          >
            {title}
          </h1>
          <p className="text-center type-h4 text-blue02 u-mt-[59] u-w-[498] mob:w-full mob:type-body-r" data-anim="text-fade">
            {intro}
          </p>
        </section>
        <section className="mx-auto max-w-page u-px-[95] tab:u-px-[50] mob:u-px-[15]">
          {cardsTitle && <h2 className="type-h3 text-blue01 u-mb-[40] mob:type-h4">{cardsTitle}</h2>}
          <div className="grid grid-cols-3 u-gap-[40] tab:grid-cols-2 tab:u-gap-[30] mob:grid-cols-1 mob:u-gap-[20]">
            {cards.map((card, i) => (
              <Card key={card.title} index={i + 1} title={card.title}>
                {card.text}
              </Card>
            ))}
          </div>
          {children}
        </section>
        <Cta {...cta} />
      </div>
    </div>
  )
}
