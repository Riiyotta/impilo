/*
 * Placeholder blog content (BLOG_SPEC B0). ORIGINAL copy written for the clone -- not taken from
 * impilo.health. Together the posts exercise every rich-text node the original renders:
 * paragraph, heading-1, heading-2, bold/italic/underline/code/superscript/subscript marks,
 * internal + mailto hyperlinks, unordered/ordered lists, blockquote, hr, embedded image and the
 * embedded FileDownload form, plus a trailing empty paragraph.
 *
 * Shape (mirrors the Contentful fields the original uses):
 *   { title, slug, createdAt, overwritePublishDate?, blogAuthorName, categories[], mainImage,
 *     articleTextPreview (search + meta description only, never rendered), relatedArticles[] (slugs),
 *     articleText: Block[] }
 * Block: { type: 'paragraph' | 'heading-1' | 'heading-2' | 'blockquote', content: Inline[] }
 *      | { type: 'unordered-list' | 'ordered-list', items: Inline[][] }
 *      | { type: 'hr' } | { type: 'embedded-asset', src, width, height, alt }
 *      | { type: 'embedded-entry', entry: 'fileDownload', title }
 * Inline: string | { text, marks: ('bold'|'italic'|'underline'|'code'|'superscript'|'subscript')[] }
 *       | { type: 'hyperlink', uri, content: Inline[] }
 *
 * No external-domain hyperlinks (user request); the non-internal link path is exercised by mailto:.
 */

/* --- tiny authoring helpers --- */
const m = (text, ...marks) => ({ text, marks })
const b = (text) => m(text, 'bold')
const i = (text) => m(text, 'italic')
const u = (text) => m(text, 'underline')
const a = (uri, ...content) => ({ type: 'hyperlink', uri, content })
const p = (...content) => ({ type: 'paragraph', content })
const h1 = (...content) => ({ type: 'heading-1', content })
const h2 = (...content) => ({ type: 'heading-2', content })
const quote = (...content) => ({ type: 'blockquote', content })
const ul = (...items) => ({ type: 'unordered-list', items })
const ol = (...items) => ({ type: 'ordered-list', items })
const hr = () => ({ type: 'hr' })
const img = (src, width, height, alt) => ({ type: 'embedded-asset', src, width, height, alt })
const download = (title) => ({ type: 'embedded-entry', entry: 'fileDownload', title })

export const POSTS = [
  {
    title: 'Partnering for Better At-Home Care: A New Approach to Device Fulfillment',
    slug: 'partnering-for-better-at-home-care',
    createdAt: '2026-09-21T14:00:00Z',
    blogAuthorName: 'Impilo Team',
    categories: ['Partnerships', 'Company News'],
    mainImage: { src: '/assets/images/blog/cover-1.webp', width: 1200, height: 800 },
    articleTextPreview:
      'A look at how shared fulfillment, clear handoffs and a single support line help care programs get connected devices to patients faster.',
    relatedArticles: ['five-lessons-from-shipping-connected-devices', 'device-data-decoded'],
    articleText: [
      p(
        'Getting a connected device into a patient’s hands sounds simple until a program tries to do it at scale. ',
        'Inventory has to be in the right place, kits have to be configured before they ship, and someone has to answer the phone when a patient cannot get a reading to sync.',
      ),
      p(
        'Over the past year we have worked with partners to treat fulfillment as part of the care experience rather than a back-office task. ',
        b('The result is a shorter path from enrollment to first reading'),
        ', and fewer patients who drop out before they ever start.',
      ),
      h1(b('What changes when fulfillment is shared')),
      p(
        'When a program, a device maker and a logistics team each own a different piece of the journey, small gaps add up. A shared model replaces those gaps with a single plan:',
      ),
      ul(
        ['One kit definition per program, agreed before the first order ships.'],
        ['Devices that arrive pre-paired, so patients do not have to manage settings.'],
        ['A single support line that can see both the shipment and the device status.'],
      ),
      p(
        'None of these ideas are new on their own. Putting them together is what makes the difference for patients and for the clinical teams waiting on their data.',
      ),
      h1(b('Where to start')),
      p(
        'If your program is planning its next phase, we recommend starting with the onboarding call script and working backwards to the kit. You can read more about our approach in ',
        a('/blog/five-lessons-from-shipping-connected-devices/', 'five lessons from a year of shipping devices'),
        '.',
      ),
    ],
  },
  {
    title: 'How Remote Monitoring Programs Scale Without Losing the Human Touch',
    slug: 'remote-monitoring-programs-that-scale',
    createdAt: '2026-08-30T15:00:00Z',
    blogAuthorName: 'Impilo Team',
    categories: ['Digital Health Programs', 'Patient Devices'],
    mainImage: { src: '/assets/images/blog/cover-2.webp', width: 1200, height: 800 },
    articleTextPreview:
      'Growing a remote patient monitoring program means more devices, more data and more patients. Here is how teams keep the experience personal while they grow.',
    relatedArticles: [],
    articleText: [
      p(
        'Most remote monitoring programs start small: a few hundred patients, one or two device types and a care team that knows every name on the list. ',
        'Growth changes that. The question is not whether a program can add patients, but whether it can add them ',
        i('without'),
        ' making each one feel like a ticket in a queue.',
      ),
      p(
        'In conversations with care teams, the same themes come up again and again. Patients stay engaged when the technology fades into the background and the people stay in the foreground. ',
        u('Consistency matters more than novelty.'),
      ),
      h1(b('Design the first week carefully')),
      p(
        'The first seven days decide whether a patient becomes a regular user. A simple, predictable first week usually includes:',
      ),
      ol(
        ['A welcome call within one business day of delivery.'],
        ['A guided first reading, done together over the phone if needed.'],
        ['A follow-up message after the third day confirming that readings are arriving.'],
      ),
      p(
        'Teams that skip these steps often see the same pattern: devices arrive, sit in their boxes and never send a single reading. ',
        b('A few minutes of human contact early on saves hours of outreach later.'),
      ),
      h2(b('Keep the device experience boring')),
      p(
        'The best device is the one a patient forgets about. Cellular devices that work out of the box, clear printed instructions and a single support number all reduce the number of things that can go wrong.',
      ),
      ul(
        ['Prefer devices that transmit without a smartphone.'],
        [
          'Pre-pair and test every unit before it leaves the warehouse, ',
          b('not'),
          ' after a patient calls with a problem.',
        ],
        ['Include a printed card with the support line in every kit.'],
      ),
      h1(b('Let the data find the people')),
      p(
        'As programs grow, care teams cannot review every reading by hand. Rules that surface missed readings and out-of-range values let clinicians spend their time on the patients who need it. ',
        'For teams building their own workflows, our ',
        a('/developers/', 'developer resources'),
        ' describe how device data can flow into existing tools.',
      ),
      h2(b('A checklist for the next phase')),
      ul(
        ['Review onboarding scripts every quarter.'],
        ['Track time from enrollment to first reading as a core metric.'],
        ['Ask patients what confused them, and fix that first.'],
      ),
      p('Scaling well is rarely about one big change. It is a series of small, deliberate ones that keep people at the center.'),
      p(),
    ],
  },
  {
    title: 'Five Lessons From a Year of Shipping Connected Devices to Patients’ Homes',
    slug: 'five-lessons-from-shipping-connected-devices',
    createdAt: '2026-08-12T13:30:00Z',
    blogAuthorName: 'Impilo Team',
    categories: ['Patient Devices'],
    mainImage: { src: '/assets/images/blog/cover-3.webp', width: 2000, height: 1414 },
    articleTextPreview:
      'What we learned about packaging, timing, returns and patient support after a year of sending connected health devices directly to homes.',
    relatedArticles: [],
    articleText: [
      p(
        'A year of direct-to-home shipping taught us that the box is part of the product. Everything a patient sees when they open it shapes how they feel about the program.',
      ),
      quote('The moment a patient opens the box is the first appointment. Treat it like one.'),
      p(
        'Here are five lessons we keep coming back to. None of them are complicated, but each one removed a common reason patients stopped using their devices.',
      ),
      ol(
        [b('Ship on a predictable day.'), ' Patients plan around deliveries; a consistent schedule reduces missed packages.'],
        [b('Put the instructions on top.'), ' The first thing a patient sees should tell them what to do next.'],
        [b('Make returns effortless.'), ' A prepaid label in every kit keeps unused devices from sitting in closets.'],
        [b('Track the first reading, not the delivery.'), ' Delivery is a milestone; the first reading is the goal.'],
        [b('Close the loop with the care team.'), ' Clinicians should know when a patient is ready, without asking.'],
      ),
      hr(),
      p('A well-prepared kit, laid out so that the first step is obvious:'),
      img('/assets/images/blog/cover-7.webp', 1500, 729, 'Illustration of a connected device kit'),
      p(
        'Small details add up. When every kit looks the same and every step is clear, support calls go down and first readings arrive sooner.',
      ),
    ],
  },
  {
    title: 'Closing the Distance: Remote Monitoring for Rural and Community Clinics',
    slug: 'remote-monitoring-for-rural-and-community-clinics',
    createdAt: '2026-07-24T16:00:00Z',
    blogAuthorName: 'Impilo Marketing',
    categories: ['Rural Health/ FQHC', 'White Papers'],
    mainImage: { src: '/assets/images/blog/cover-4.webp', width: 960, height: 372 },
    articleTextPreview:
      'Rural and community clinics face long travel distances and limited staff. This white paper outlines how remote monitoring can extend their reach.',
    relatedArticles: [],
    articleText: [
      p(
        'For many patients in rural areas, the nearest clinic is an hour or more away. Regular check-ins become hard to keep, and small changes in health can go unnoticed between visits.',
      ),
      p(
        'Remote monitoring offers a way to stay connected between appointments. Our new white paper looks at how community clinics can start a program with limited staff and grow it over time.',
      ),
      download('Download the White Paper'),
      p('Interested in learning how remote monitoring can extend the reach of your clinic?'),
      p('Contact us!'),
      p(a('mailto:sales@impilo.health', 'sales@impilo.health')),
    ],
  },
  {
    title: 'Device Data, Decoded',
    slug: 'device-data-decoded',
    createdAt: '2026-07-02T12:00:00Z',
    blogAuthorName: 'Impilo Team',
    categories: ['Built on Impilo'],
    mainImage: { src: '/assets/images/blog/cover-5.webp', width: 2090, height: 1175 },
    articleTextPreview:
      'A short guide to the readings connected devices send, the units they use and how they appear once they reach your systems.',
    relatedArticles: [],
    articleText: [
      p(
        'Every connected device speaks its own dialect. A pulse oximeter reports SpO',
        m('2', 'subscript'),
        ' as a percentage, a scale reports weight in pounds or kilograms, and a blood pressure cuff reports two numbers and a pulse.',
      ),
      p(
        'Before readings reach a care team, they are normalized into a common shape. Each reading carries a ',
        m('device_id', 'code'),
        ', a timestamp and a value with its unit, so downstream tools never have to guess.',
      ),
      h1(b('Three things to check')),
      ul(
        ['Units: confirm that every reading includes one, and that your tools display it.'],
        ['Timestamps: readings are recorded in UTC and shown in the patient’s local time.'],
        ['Duplicates: devices sometimes resend a reading; de-duplicate on device and time.'],
      ),
      p(
        'This is the 1',
        m('st', 'superscript'),
        ' in a short series about device data. Next time we will look at how readings are grouped into daily summaries.',
      ),
    ],
  },
  {
    title:
      'What Care Teams Should Know Before Launching a Remote Patient Monitoring Program: Logistics, Onboarding, Support, Data Flows and Everything in Between',
    slug: 'before-launching-a-remote-patient-monitoring-program',
    createdAt: '2026-06-10T14:00:00Z',
    blogAuthorName: 'Impilo Team',
    categories: [],
    mainImage: { src: '/assets/images/blog/cover-6.webp', width: 1254, height: 836 },
    articleTextPreview:
      'A planning guide for care teams preparing to launch a remote patient monitoring program, from device selection to the first month of readings.',
    relatedArticles: [],
    articleText: [
      p(
        'Launching a remote monitoring program involves more moving parts than most teams expect. Devices, shipping, onboarding, support and data all need an owner before the first patient enrolls.',
      ),
      h1(b('Before the first enrollment')),
      ul(
        ['Choose a small set of devices and stick with it for the pilot.'],
        ['Write the onboarding call script and test it with a colleague.'],
        ['Decide who reviews readings, how often, and what happens when one is missed.'],
      ),
      h1(b('The first month')),
      p(
        'Expect questions. Patients will call about charging, about where to place a device and about whether a reading went through. ',
        'A clear support path keeps those questions from reaching the clinical team.',
      ),
      p(
        'When you are ready to plan your rollout, our team can help. ',
        a('/request-demo/', 'Request a demo'),
        ' to talk it through.',
      ),
    ],
  },
]

/* --- derived helpers --- */
const publishDate = (post) => post.overwritePublishDate || post.createdAt

// Sort order: createdAt DESC (BLOG_SPEC B0).
export const SORTED_POSTS = [...POSTS].sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt))

export const getPost = (slug) => POSTS.find((post) => post.slug === slug)

// Category taxonomy in order of first appearance, newest post first (sidebar order).
export const CATEGORIES = Array.from(new Set(SORTED_POSTS.flatMap((post) => post.categories)))

// Date format "MMMM Do, YYYY", e.g. "September 21st, 2026".
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
export function formatDate(post) {
  const d = new Date(publishDate(post))
  return `${MONTHS[d.getUTCMonth()]} ${ordinal(d.getUTCDate())}, ${d.getUTCFullYear()}`
}

// Related articles, or the 2 newest other posts ("Recent Articles") when there are none (B2.7).
export function getRelated(post) {
  const related = (post.relatedArticles || []).map(getPost).filter(Boolean)
  if (related.length) return { title: 'Related Articles', posts: related }
  return { title: 'Recent Articles', posts: SORTED_POSTS.filter((x) => x.slug !== post.slug).slice(0, 2) }
}
