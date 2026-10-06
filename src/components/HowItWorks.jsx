import { useLayoutEffect, useRef } from 'react'
import InlineSvg from './shared/InlineSvg'
import TextLink from './shared/TextLink'
import stepIcon01 from '../assets/svg/step-icon-01.svg?raw'
import stepIcon02 from '../assets/svg/step-icon-02.svg?raw'
import stepIcon03 from '../assets/svg/step-icon-03.svg?raw'
import stepIcon04 from '../assets/svg/step-icon-04.svg?raw'
import ill1Foreground from '../assets/svg/ill1-foreground.svg?raw'
import ill2Svg from '../assets/svg/ill2-illustration.svg?raw'
import ill3Svg from '../assets/svg/ill3-illustration.svg?raw'
import ill4Svg from '../assets/svg/ill4-illustration.svg?raw'

const ILL1_ROWS = 11

/*
 * ScaledContent (CLONE_SPEC 4). On mobile (<=500px) the inner illustration is scaled
 * (.5/.55/.62/.51) and, like the original, the outer box is sized inline to the scaled
 * dimensions so the ImageBox centres the scaled artwork. Scale 1 at tablet/desktop.
 */
const MOBILE_QUERY = '(max-width: 500px)'

function ScaledContent({ scale, children }) {
  const outerRef = useRef(null)
  const innerRef = useRef(null)

  useLayoutEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    const mq = window.matchMedia(MOBILE_QUERY)
    const update = () => {
      if (mq.matches) {
        outer.style.width = `${inner.offsetWidth * scale}px`
        outer.style.height = `${inner.offsetHeight * scale}px`
      } else {
        outer.style.width = ''
        outer.style.height = ''
      }
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(inner)
    mq.addEventListener('change', update)
    return () => {
      ro.disconnect()
      mq.removeEventListener('change', update)
    }
  }, [scale])

  return (
    <div ref={outerRef} className="scaled-outer">
      <div ref={innerRef} className="scaled-inner" style={{ '--mobile-scale': scale }}>
        {children}
      </div>
    </div>
  )
}

function DigitColumn({ className, digits }) {
  return (
    <div className={className}>
      {digits.map((d, i) => (
        <div key={i}>{d}</div>
      ))}
    </div>
  )
}

function IllustrationOne() {
  return (
    <div className="ill-graphic ill-one" data-anim="ill-one">
      <img src="/assets/svg/ill1-background.svg" alt="" className="h-auto w-full" />
      <div className="ill-one__container">
        <div className="ill-one__rows" data-anim="ill-one-rows">
          {Array.from({ length: ILL1_ROWS }, (_, i) => (
            <img key={i} src="/assets/svg/ill1-row.svg" alt="" className="ill-one__row" />
          ))}
        </div>
      </div>
      <InlineSvg svg={ill1Foreground} idPrefix="ill1" className="ill-one__foreground" aria-hidden="true" />
    </div>
  )
}

function IllustrationTwo() {
  return (
    <div className="ill-graphic ill-wide ill-two" data-anim="ill-two">
      <InlineSvg svg={ill2Svg} idPrefix="ill2" className="ill-svg ill-two__svg" aria-hidden="true" />
      {/* Reads "158.00" at rest; GSAP rolls it to "167.58". Classes "scale text" are GSAP hooks. */}
      <div className="ill-two__text scale text" data-anim="ill-two-counter">
        <div>1</div>
        <DigitColumn className="tens" digits={[5, 6]} />
        <DigitColumn className="ones" digits={[8, 9, 0, 1, 2, 3, 4, 5, 6, 7]} />
        <div>.</div>
        <DigitColumn className="decimals first" digits={[0, 5]} />
        <DigitColumn className="decimals second" digits={[0, 8]} />
      </div>
    </div>
  )
}

function IllustrationThree() {
  return (
    <div className="ill-graphic ill-wide ill-three" data-anim="ill-three">
      <img src="/assets/images/ill3-background.png" alt="" className="ill-three__bg" width="680" height="760" />
      <InlineSvg svg={ill3Svg} idPrefix="ill3" className="ill-svg" aria-hidden="true" />
    </div>
  )
}

function IllustrationFour() {
  return (
    <div className="ill-graphic ill-wide ill-four" data-anim="ill-four">
      <InlineSvg svg={ill4Svg} idPrefix="ill4" className="ill-svg ill-four__svg" aria-hidden="true" />
    </div>
  )
}

const STEPS = [
  {
    number: '01.',
    green: false,
    icon: stepIcon01,
    title: (
      <>
        First, Impilo <span>identifies</span> and <span>qualifies</span> patients for the program.
      </>
    ),
    description:
      'Impilo utilizes their data engine to enroll and welcome patients into remote care programs utilizing their platform and digital Health tech specialists.',
    illustration: <IllustrationOne />,
    scale: 0.5,
  },
  {
    number: '02.',
    green: true,
    icon: stepIcon02,
    title: (
      <>
        We <span>pack</span> and <span>ship</span> medical devices and supplies <span>directly</span> to your
        patients.
      </>
    ),
    description:
      'We simplify remote monitoring operations, offering quality support for virtual care programs. Customize and white-label medical device kits, shipped directly to your patient without the need for in-house logistics management.',
    link: { label: 'Learn more about Our Solutions', href: '/solutions/' },
    illustration: <IllustrationTwo />,
    scale: 0.55,
  },
  {
    number: '03.',
    green: false,
    icon: stepIcon03,
    title: (
      <>
        Our specialists <span>educate</span> patients and supply providers with <span>data to support</span> patient
        care.
      </>
    ),
    description:
      'Our team approaches each patient with a personalized strategy ensuring patient activation to build relationships that encourage long-term engagement. We provide insights based on patient data and industry trends, helping providers make informed decisions to enhance program effectiveness.',
    illustration: <IllustrationThree />,
    scale: 0.62,
  },
  {
    number: '04.',
    green: true,
    icon: stepIcon04,
    title: (
      <>
        Unlock new data insights for <span>Population Health</span>, <span>Billing Opportunities</span>, or{' '}
        <span>Patient Engagement</span>.
      </>
    ),
    description:
      'Review your patient data in the Impilo dashboard or integrate into your existing EHR or Digital Health Platform. Our platform allows you to continue working seamlessly from ordering to managing device data.',
    illustration: <IllustrationFour />,
    scale: 0.51,
  },
]

function TextPart({ step, index }) {
  return (
    <div className="works__text-part" data-anim="works-text-part" data-step={index + 1}>
      <div className="grid u-w-[494] u-gap-[36] mob:u-w-[345]">
        <div className={`step-topbar type-body-m ${step.green ? 'text-brightGreen' : 'text-brightBlue'}`}>
          <InlineSvg svg={step.icon} className="step-topbar__icon" aria-hidden="true" />
          <span>{step.number}</span>
        </div>
        <h3 className={`step-title type-h3 text-silver05 ${step.green ? 'step-title--green' : ''}`}>{step.title}</h3>
        <p className="type-body-r text-silver02">{step.description}</p>
        {step.link && (
          <TextLink href={step.link.href} variant="blue">
            {step.link.label}
          </TextLink>
        )}
      </div>
    </div>
  )
}

function ImagePart({ step, index }) {
  return (
    <div className="works__image-part" data-anim="works-image-part" data-step={index + 1}>
      <div className="works__image-box">
        <ScaledContent scale={step.scale}>{step.illustration}</ScaledContent>
      </div>
    </div>
  )
}

/* CLONE_SPEC 4. Section 3: How It Works */
export default function HowItWorks() {
  return (
    <div className="works-wrap">
      <section className="works" data-anim="works">
        {STEPS.flatMap((step, i) => [
          <TextPart key={`t${i}`} step={step} index={i} />,
          <ImagePart key={`i${i}`} step={step} index={i} />,
        ])}
        <div className="works__pseudo-box" data-anim="works-pseudo-box" aria-hidden="true" />
      </section>
    </div>
  )
}
