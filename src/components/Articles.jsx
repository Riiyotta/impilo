import { useState } from 'react'
import InlineSvg from './shared/InlineSvg'
import AutoAnimate from './shared/AutoAnimate'
import UniversalLink from './shared/UniversalLink'
import chevron from '../assets/svg/icon-arrow-chevron.svg?raw'

const ARTICLES = [
  {
    title:
      "Remote Patient Monitoring for Sleep Apnea: Breaking Down Barriers with Wesper's At-Home Sleep Testing",
    excerpt:
      "Discover how Wesper's innovative at-home sleep testing technology is revolutionizing sleep apnea diagnosis and treatment through remote patient monitoring.",
    // Original pointed at impilo.health; now an internal placeholder post (src/data/posts.js).
    url: '/blog/remote-monitoring-programs-that-scale/',
  },
  {
    title: 'How Remote Monitoring and Targeted Wellness Programs Improve Hypertension',
    excerpt:
      'Learn how remote patient monitoring and personalized wellness programs are transforming hypertension management and improving patient outcomes.',
    url: '/blog/device-data-decoded/',
  },
  {
    title: 'Enhancing Rural Healthcare Access Through RPM',
    excerpt:
      'Explore how remote patient monitoring is bridging healthcare gaps in rural communities and improving access to quality care for underserved populations.',
    url: '/blog/remote-monitoring-for-rural-and-community-clinics/',
  },
]

/* CLONE_SPEC 8. Section 6: Quotes / article carousel */
export default function Articles() {
  const [state, setState] = useState({ index: 0, direction: 1 })
  const go = (direction) =>
    setState((s) => ({ index: (s.index + direction + ARTICLES.length) % ARTICLES.length, direction }))
  const article = ARTICLES[state.index]
  const dir = state.direction

  return (
    <section className="grid w-full bg-silver05 [place-items:start_center]">
      <div className="relative grid h-full w-full max-w-page place-items-center u-pt-[114] u-px-[50] mob:u-px-[15]">
        <AutoAnimate
          activeKey={state.index}
          className="quotes-animate"
          inFrom={{ xPercent: 110 * dir, opacity: 0 }}
          outTo={{ xPercent: -110 * dir, opacity: 0 }}
          animateHeight
        >
          <div className="flex flex-col items-center u-gap-[48] mob:u-gap-[24]">
            <h3 className="m-0 text-center type-h3 text-blue01 u-w-[1113] tab:u-w-[696] mob:type-h4 mob:u-w-[280]">
              {article.title}
            </h3>
            <p className="m-0 text-center type-body-l text-blue01 u-w-[1113] tab:u-w-[696] mob:u-text-[14] mob:leading-[144%] mob:u-w-[280]">
              {article.excerpt}
            </p>
            <UniversalLink
              href={article.url}
              className="border-2 border-blue01 type-body-r text-blue01 no-underline transition-all duration-200 ease-[ease] rounded-[8px] u-px-[24] u-py-[12] hover:bg-blue01 hover:text-silver05 mob:font-normal mob:u-px-[16] mob:u-py-[8] mob:u-text-[14]"
            >
              Read Full Article →
            </UniversalLink>
          </div>
        </AutoAnimate>
        <button
          type="button"
          aria-label="Previous Quote"
          className="quote-arrow quote-arrow--prev absolute u-left-[50] u-top-[234] tab:u-top-[344] mob:u-left-[15] mob:u-top-[186]"
          onClick={() => go(-1)}
        >
          <InlineSvg svg={chevron} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Next Quote"
          className="quote-arrow absolute u-right-[50] u-top-[234] tab:u-top-[344] mob:u-right-[15] mob:u-top-[186]"
          onClick={() => go(1)}
        >
          <InlineSvg svg={chevron} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
