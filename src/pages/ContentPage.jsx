import { useLayoutEffect, useRef } from 'react'
import { contentPages } from '../data/contentPages'
import ContentHero from '../components/content/ContentHero'
import { ContentSection, SectionTitle, SectionSubtitle } from '../components/content/ContentSection'
import {
  BorderedCardGrid,
  IconCardGrid,
  TextItemGrid,
  TwoColumnGrid,
  OutcomesList,
} from '../components/content/Grids'
import CapabilitiesCarousel from '../components/content/CapabilitiesCarousel'
import CtaRow from '../components/content/CtaRow'
import CallToAction from '../components/content/CallToAction'
import { initPageAnimations } from '../animations/page'
import '../styles/solutions.css'

function Block({ block, dark }) {
  switch (block.type) {
    case 'borderedCards':
      return <BorderedCardGrid {...block} />
    case 'iconCards':
      return <IconCardGrid {...block} />
    case 'textItems':
      return <TextItemGrid {...block} dark={dark} />
    case 'twoColumn':
      return <TwoColumnGrid {...block} />
    case 'outcomes':
      return <OutcomesList {...block} />
    case 'carousel':
      return <CapabilitiesCarousel {...block} />
    case 'cta':
      return <CtaRow {...block} />
    case 'callToAction':
      return <CallToAction {...block} />
    default:
      return null
  }
}

/*
 * Template B (specs/SOLUTIONS_USECASES_SPEC.md section 2): flat stacked sections driven by
 * src/data/contentPages.js. Only motion: TextAnimation (hero title/subtitle, section titles, CTA
 * paragraphs), button hovers and the carousel. Main content only.
 */
export default function ContentPage({ pageKey }) {
  const page = contentPages[pageKey]
  const root = useRef(null)
  useLayoutEffect(() => {
    document.title = page.title
    return initPageAnimations(root.current)
  }, [page])

  return (
    <div ref={root} key={pageKey} data-page={pageKey}>
      <ContentHero
        {...page.hero}
        contentWidth={page.contentWidth || 1000}
        subtitleVariant={page.subtitleVariant || 'a'}
        mobileTitle={page.heroMobileTitle}
      />
      {page.sections.map((s, i) => (
        <ContentSection key={i} dark={s.dark}>
          <SectionTitle dark={s.dark} noPad={page.noPadTitles} tight={s.tight || page.tightTitles}>
            {s.title}
          </SectionTitle>
          {s.subtitle && <SectionSubtitle>{s.subtitle}</SectionSubtitle>}
          {s.blocks.map((b, j) => (
            <Block key={j} block={b} dark={s.dark} />
          ))}
        </ContentSection>
      ))}
    </div>
  )
}
