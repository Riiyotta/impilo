import Pill from './shared/Pill'

const BADGES = [
  { name: 'HIPAA', color: '/assets/images/hipaa.webp', gray: '/assets/images/hipaa-gray.webp' },
  { name: 'SOC 2', color: '/assets/images/soc2.webp', gray: '/assets/images/soc2-gray.webp' },
]

/* CLONE_SPEC 6. Section 4: White Glove */
export default function WhiteGlove() {
  return (
    <section className="relative z-[4] grid w-full place-items-center bg-silver05 u-rounded-t-[24]">
      <div className="flex w-full max-w-page flex-col items-center u-pb-[173] u-pt-[135] tab:u-pb-[82] tab:u-pt-[141] mob:u-pb-[84] mob:u-pt-[141] mob:u-px-[15]">
        <Pill />
        <h3
          className="text-center type-h2 text-blue02 u-mt-[16] tab:u-w-[900] mob:w-[95%] mob:type-h3"
          data-anim="text-lines"
        >
          End-to-end white glove service
        </h3>
        <p
          className="text-center type-h4 text-blue02 u-my-[59] u-w-[498] mob:w-full mob:type-body-r mob:u-my-[28]"
          data-anim="text-fade"
        >
          Our team is here to provide personalized support to you and your patients every step of the way.
        </p>
        <div className="flex w-fit border border-silver01 u-rounded-[24]">
          {BADGES.map((badge, i) => (
            <div
              key={badge.name}
              className={`group relative u-px-[32] u-py-[24] ${i < BADGES.length - 1 ? 'border-r border-silver01' : ''}`}
            >
              <img src={badge.color} alt={badge.name} className="u-h-[92] u-w-[92]" width="92" height="92" />
              <img
                src={badge.gray}
                alt=""
                aria-hidden="true"
                className="absolute u-h-[92] u-left-[32] u-top-[24] u-w-[92] transition-opacity duration-500 ease-[ease] group-hover:opacity-0"
                width="92"
                height="92"
              />
            </div>
          ))}
        </div>
        <p
          className="text-center type-body-m text-blue01 u-mt-[21] u-w-[390] mob:w-full"
          data-anim="text-fade"
        >
          We pride ourselves on regulatory compliance and service quality. Impilo is FDA registered, DME Accredited, and
          (pending) ISO 13485.
        </p>
      </div>
    </section>
  )
}
