import { useEffect, useState } from 'react'
import InlineSvg from './shared/InlineSvg'
import AutoAnimate from './shared/AutoAnimate'
import heroIllustration from '../assets/svg/hero-illustration.svg?raw'
import heroInterface from '../assets/svg/hero-interface.svg?raw'

const WORDS = ['manageable.', 'powerful.', 'easy.', 'personalized.']
const MOBILE_QUERY = '(max-width: 500px)'

/* The original renders the dashboard inside ZoomFrom on mobile (no ZoomTo, no zoom). */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches)
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const onChange = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return isMobile
}

function HeroInterface() {
  return (
    <div className="interface" data-anim="hero-interface">
      <InlineSvg svg={heroInterface} idPrefix="hero-ui" className="interface__svg" aria-hidden="true" />
      <InterfaceText />
    </div>
  )
}
const WORD_INTERVAL = 3000
const FIRST_SWAP = 1100

/* Digit column helper: each child is one row of the rolling counter. */
function DigitColumn({ className, digits }) {
  return (
    <div className={className}>
      {digits.map((d, i) => (
        <div key={i}>{d}</div>
      ))}
    </div>
  )
}

/* Interface counter overlay (CLONE_SPEC 2 "Interface / dashboard"). Reads "117 / 72" at rest. */
function InterfaceText() {
  return (
    <div className="interface__text" data-anim="interface-counter">
      <div>1</div>
      <DigitColumn className="tens left" digits={[1, 2, 3]} />
      <DigitColumn className="ones left" digits={[7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]} />
      <div className="slash">/</div>
      <DigitColumn className="tens right" digits={[7, 8]} />
      <DigitColumn className="ones right" digits={[2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3]} />
    </div>
  )
}

function RotatingWord() {
  const [index, setIndex] = useState(0)

  /*
   * Original: useInterval(next, 3000, { immediate: true }) feeding AutoAnimate, whose key changes are
   * debounced to at most one per duration*1000 + 100 = 1100ms. Net effect: "manageable." -> "powerful."
   * at ~1.1s after mount, then one word every 3s on the 3000ms interval grid.
   */
  useEffect(() => {
    const first = setTimeout(() => setIndex((i) => (i + 1) % WORDS.length), FIRST_SWAP)
    const id = setInterval(() => setIndex((i) => (i + 1) % WORDS.length), WORD_INTERVAL)
    return () => {
      clearTimeout(first)
      clearInterval(id)
    }
  }, [])

  return (
    <div className="hero__wordbox type-h1 text-brightTurquoise tab:type-h2 mob:type-h3">
      <AutoAnimate
        activeKey={index}
        className="hero__word-animate auto-animate--start"
        inFrom={{ yPercent: 100 }}
        outTo={{ yPercent: -100 }}
        animateWidth
        animateHeight
      >
        <div className="hero__word">{WORDS[index]}</div>
      </AutoAnimate>
    </div>
  )
}

export default function Hero() {
  const isMobile = useIsMobile()
  return (
    <div data-anim="hero-zoom-parent">
      <section className="hero" data-anim="hero">
        <InlineSvg
          svg={heroIllustration}
          idPrefix="hero-ill"
          className="hero__illustration animated-paths"
          data-anim="hero-illustration"
          aria-hidden="true"
        />
        <div className="hero__content">
          <div className="hero__title type-h2 text-silver05 mob:type-h3">
            Making at home
            <br />
            healthcare
            <RotatingWord />
          </div>
          <p className="hero__description type-body-r text-silver05">
            Remote care logistics and patient support with unified data management.
          </p>
        </div>
        <div className="hero__zoom-from" data-anim="hero-zoom-from" aria-hidden={isMobile ? undefined : 'true'}>
          {isMobile && <HeroInterface />}
        </div>
      </section>
      {!isMobile && (
        <div className="hero__zoom-to" data-anim="hero-zoom-to">
          {/* pin (ZoomTo) > soft-pin drift layer > Flip target (the original's ref div) > interface */}
          <div data-anim="hero-zoom-drift">
            <div data-anim="hero-zoom-el">
              <HeroInterface />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
