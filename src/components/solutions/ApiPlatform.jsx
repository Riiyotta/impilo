import Pill from '../shared/Pill'

const FEATURES = [
  {
    icon: 'api',
    title: 'RESTful API',
    text: 'Predictable, versioned REST endpoints let your engineers create patients, order kits, and retrieve readings, with webhooks for real-time event streaming.',
  },
  {
    icon: 'data',
    title: 'Unified Device Data',
    text: 'Every supported device reports into one consistent schema, so you write a single integration instead of one per manufacturer or device type.',
  },
  {
    icon: 'integration',
    title: 'Easy Integration',
    text: 'Client libraries, webhooks, and a full sandbox environment help teams move from first call to production quickly.',
  },
  {
    icon: 'security',
    title: 'Enterprise Security',
    text: 'Encryption in transit and at rest, granular role-based access, and detailed audit logs protect health data.',
  },
]

/* Spec 1.6 ApiPlatform (white panel, 2x2 feature cards, no hover states). */
export default function ApiPlatform() {
  return (
    <section
      className="relative z-[1] grid place-items-center bg-silver05 text-center u-py-[232] u-rounded-[24] tab:u-py-[151] mob:rounded-b-none mob:u-py-[100]"
      data-sol="api"
    >
      <Pill />
      <h2
        className="type-h2 text-blue01 u-max-w-[1111] u-mt-[16] mob:type-h3"
        data-anim="text-lines"
      >
        API-First RPM Platform
      </h2>
      <p className="type-body-r text-blue01 u-max-w-[576] u-mt-[32] mob:u-max-w-[345]" data-anim="text-fade">
        Developers connect to our infrastructure through documented endpoints and SDKs, pulling device data and
        patient events straight into their healthcare applications.
      </p>
      <div className="grid w-full grid-cols-2 u-gap-[60] u-max-w-[1200] u-mt-[80] tab:u-gap-[40] tab:u-max-w-[924] mob:grid-cols-1 mob:u-gap-[40] mob:u-max-w-[345] mob:u-mt-[42]">
        {FEATURES.map((f) => (
          <div
            key={f.icon}
            className="flex flex-col items-center border-solid border-lavender04 bg-silver04 u-min-h-[300] u-p-[40] u-rounded-[24] [border-width:calc(var(--u)*1)] mob:min-h-0 mob:u-p-[30]"
          >
            <div className="grid place-items-center u-h-[80] u-mb-[24] u-w-[80] mob:u-h-[60] mob:u-mb-[16] mob:u-w-[60]">
              <img
                src={`/assets/svg/solutions-icon-${f.icon}.svg`}
                alt=""
                className="u-h-[48] u-w-[48] mob:u-h-[36] mob:u-w-[36]"
              />
            </div>
            <h4 className="type-h4 text-blue01 mb-[16px] mob:type-body-m mob:u-mb-[12]">{f.title}</h4>
            <p className="type-body-r text-blue01 mob:type-body-m">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
