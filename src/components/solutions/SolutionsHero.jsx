import InlineSvg from '../shared/InlineSvg'
import PrimaryButton from '../shared/PrimaryButton'
import readingsOverview from '../../../public/assets/svg/solutions-hero-readings-overview.svg?raw'

const SVG = '/assets/svg/'
const u = (n) => `calc(var(--u) * ${n})`

/* Spec 1.1 IllustrationsWrapper table: width / top / left / rotate (design px). */
const ILLUSTRATIONS = [
  { src: 'solutions-hero-pill.svg', w: 38, top: 153, left: 106, rotate: -34, pill: true },
  { src: 'solutions-hero-pill.svg', w: 38, top: 201, left: 94, rotate: 78, pill: true },
  { src: 'solutions-hero-tablet.svg', w: 62, top: 157, left: 231, rotate: -156, pill: true },
  { src: 'solutions-hero-glucose.svg', w: 360, top: 37, left: 350, rotate: 0 },
  { src: 'solutions-hero-tablet.svg', w: 62, top: 180, left: 693, rotate: 18, flip: true, pill: true },
  { src: 'solutions-hero-tablet.svg', w: 62, top: 140, left: 710, rotate: -24, flip: true, pill: true },
  { src: 'solutions-hero-watch.svg', w: 239, top: 0, left: 758, rotate: 0 },
  { src: 'solutions-hero-pill.svg', w: 38, top: 119, left: 1036, rotate: 34, pill: true },
  { src: 'solutions-hero-pill.svg', w: 38, top: 167, left: 1048, rotate: -78, pill: true },
  { src: 'solutions-hero-pill-container.svg', w: 144, top: 64, left: 1173, rotate: 24 },
]

const ONES = Array.from({ length: 24 }, (_, i) => (9 - (i % 10) + 10) % 10)

/* Weight counter: rolls 209 -> 187 (digit stacks; motion in animations/pages/solutions.js). */
function WeightCounter() {
  return (
    // p3 colour inline: the CSS minifier lowers color(display-p3 ...) in stylesheets to #c0bef0
    <div
      className="sol-hero__weight"
      data-sol="weight"
      aria-hidden="true"
      style={{ color: 'color(display-p3 0.7505 0.747 0.9258)' }}
    >
      <div>
        {[2, 1].map((d, i) => (
          <div key={i} className="hundreds">
            {d}
          </div>
        ))}
      </div>
      <div className="sol-hero__tens-col">
        {[0, 9, 8].map((d, i) => (
          <div key={i} className="tens">
            {d}
          </div>
        ))}
      </div>
      <div>
        {ONES.map((d, i) => (
          <div key={i} className="ones">
            {d}
          </div>
        ))}
      </div>
    </div>
  )
}

/* Spec 1.1 Hero (template A). */
export default function SolutionsHero() {
  return (
    <section
      className="grid min-h-screen place-items-center u-pb-[200] mob:u-pb-[100]"
      data-sol="hero"
    >
      <div
        className="flex w-full max-w-[1440px] flex-col items-center text-center u-px-[50] u-pt-[50] tab:max-w-[1024px] mob:max-w-[500px] mob:u-px-[23] mob:u-pt-[0]"
        data-sol="hero-inner"
      >
        <h1 className="type-h1 text-silver05 u-mb-[42] u-p-[8] u-w-[1094] tab:type-h2 tab:u-w-[924] mob:type-h3 mob:u-mb-[-35] mob:u-w-[329]">
          Quality care at home, wherever patients live
        </h1>

        <div
          className="relative w-[106%] u-h-[255] tab:w-[165%] mob:w-[445%] mob:scale-[.55]"
          data-sol="hero-ills"
          aria-hidden="true"
        >
          {ILLUSTRATIONS.map((ill, i) => (
            <img
              key={i}
              src={SVG + ill.src}
              alt=""
              className={`sol-hero__ill illustration${ill.pill ? ' hero-pill' : ''}`}
              style={{
                width: u(ill.w),
                top: u(ill.top),
                left: u(ill.left),
                rotate: `${ill.rotate}deg`,
                scale: ill.flip ? '1 -1' : undefined,
              }}
            />
          ))}
        </div>

        <div className="relative z-[3] grid u-gap-[20] [grid-template-columns:calc(var(--u)*285)_calc(var(--u)*405)_calc(var(--u)*610)] [grid-template-rows:calc(var(--u)*198)_calc(var(--u)*240)] tab:[grid-template-columns:calc(var(--u)*285)_calc(var(--u)*405)] tab:[grid-template-rows:calc(var(--u)*198)_calc(var(--u)*240)_calc(var(--u)*458)] mob:hidden">
          <img
            src={SVG + 'solutions-hero-kits-overview.svg'}
            alt=""
            className="widget h-full w-full [grid-column:1] [grid-row:1/span_2]"
          />
          <img
            src={SVG + 'solutions-hero-patient-info.svg'}
            alt=""
            className="widget h-full w-full [grid-column:2] [grid-row:1]"
          />
          <img
            src={SVG + 'solutions-hero-billing-report.svg'}
            alt=""
            className="widget h-full w-full [grid-column:2] [grid-row:2]"
          />
          <InlineSvg
            svg={readingsOverview}
            className="widget h-full w-full [grid-column:3] [grid-row:1/span_2] tab:hidden"
            aria-hidden="true"
          />
          <img
            src={SVG + 'solutions-hero-readings-overview-tablet.svg'}
            alt=""
            className="widget hidden h-full w-full [grid-column:1/span_2] [grid-row:3] tab:block"
          />
          <WeightCounter />
        </div>

        <div className="flex flex-col items-center u-gap-[20] u-mt-[53] tab:u-mt-[62] mob:u-gap-[28] mob:u-mt-[-15]">
          <p
            className="type-body-r text-silver05 u-p-[8] u-w-[710] mob:u-p-[0] mob:u-w-[329]"
            data-anim="text-fade"
          >
            We handle the logistics, devices, and patient support behind remote care, so your clinical team can
            stay focused on patients.
          </p>
          <PrimaryButton href="/request-demo/">See how</PrimaryButton>
        </div>
      </div>
    </section>
  )
}
