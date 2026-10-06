import PagePill from '../shared/PagePill'
import FadeImage from './FadeImage'

const PEOPLE = [
  {
    name: 'Josh Stein',
    photo: '/assets/images/about/leader-josh.webp',
    role: 'CEO',
    bio: 'Previously advised healthcare organizations on growth strategy and has launched two digital health ventures, bringing years of experience across providers, payers and life sciences.',
  },
  {
    name: 'Patrick Quire',
    photo: '/assets/images/about/leader-pat.webp',
    role: 'COO',
    bio: 'Former supply chain leader at a national pharmacy services company, with more than a decade running operations for fast-growing startups and established enterprises in several industries.',
  },
  {
    name: 'David Heimann',
    photo: '/assets/images/about/leader-david.webp',
    role: 'CTO',
    bio: 'Engineering leader and repeat founder focused on building dependable, scalable software. Brings over ten years of experience shipping products for business and consumer audiences, with deep expertise in software architecture and technical strategy.',
  },
]

/* COMPANY_PAGES_SPEC A.4 Leadership: three placeholder people cards. */
export default function Leadership() {
  return (
    <section className="grid place-items-center u-pt-[111] mob:pt-0">
      <PagePill white />
      <h1 className="text-center type-h2 text-silver05 u-mt-[24] mob:type-h3" data-anim="page-text-lines">
        Meet the leadership
      </h1>
      <div
        className="flex u-gap-[60] u-mt-[78] tab:flex-col tab:u-gap-[51] mob:flex-col mob:u-gap-[40] mob:u-mt-[38]"
        data-anim="about-people"
      >
        {PEOPLE.map((p, i) => (
          <article
            key={p.role}
            className="border border-solid border-lavender02 u-p-[16] u-rounded-[24] u-w-[408] tab:flex tab:items-center tab:u-gap-[48] tab:u-pr-[150] tab:u-w-[925] mob:u-w-[344]"
          >
            {/* Photo box: 374 wide, height from the source aspect on desktop (Josh 401x386 -> 360). */}
            <FadeImage
              src={p.photo}
              alt={`headshot of ${p.name}`}
              imgClassName="about-photo__img"
              className={`isolate shrink-0 overflow-clip u-rounded-[18] u-w-[374] ${i === 0 ? 'u-h-[360]' : 'u-h-[374]'} tab:u-h-[382] tab:u-w-[332] mob:u-h-[329] mob:u-w-[312]`}
            />
            <div>
              <div className="flex items-center justify-between u-mb-[20] u-mt-[16] mob:u-mt-[48]">
                <div>
                  <h2 className="type-h4 text-silver05">{p.name}</h2>
                  <p className="type-body-l text-silver05 u-mt-[6]">{p.role}</p>
                </div>
                {/* LinkedIn icon kept as a visual only: no external link in the clone. */}
                {/* Inline in a bodyR line box like the original <a><svg/></a> (36x42.9, icon at its top). */}
                <span className="type-body-r">
                  <img src="/assets/svg/about-linkedin.svg" alt="" aria-hidden="true" className="inline align-baseline u-h-[36] u-w-[36]" />
                </span>
              </div>
              <p className="type-body-m text-blue07 u-pb-[14]">{p.bio}</p>
            </div>
          </article>
        ))}
      </div>
      <p
        className="text-center type-body-r text-silver05 u-mt-[46] u-w-[638] mob:u-w-[344]"
        data-anim="page-text-fade"
      >
        Our people bring together backgrounds in logistics, data engineering and clinical care. In a short time, that
        mix of skills has helped power new kinds of healthcare programs for organizations across the entire country.
      </p>
    </section>
  )
}
