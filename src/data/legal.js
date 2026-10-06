/*
 * Placeholder legal content for /terms/, /privacy/, /app-privacy/ (COMPANY_PAGES_SPEC L.2).
 * Generic, original filler sized to the spec's word counts -- NOT a real policy.
 * text(n, k) builds an n-word passage from a pool of neutral clauses starting at clause k.
 * Item shapes: string | { parts: [...] } where a part is a string or { link: 'home' | 'mailto', label }.
 */
const POOL = [
  'These placeholder terms describe how a sample service might be offered to its users.',
  'Nothing in this section creates any real obligation for any person or company.',
  'Users should review the full agreement before relying on any feature of the service.',
  'The provider may update this document from time to time without prior notice.',
  'Continued use of the service after an update means the changes are accepted.',
  'Personal information is handled only as described in the applicable privacy notice.',
  'Any data shared through the service is stored using reasonable security measures.',
  'Access may be suspended if the service is used in a way that breaks these terms.',
  'All trademarks and content remain the property of their respective owners.',
  'The service is provided as is, without warranties of any kind, express or implied.',
  'Liability is limited to the fullest extent permitted by the applicable law.',
  'Questions about this document can be sent to the contact address listed above.',
  'Each section should be read together with the rest of this placeholder document.',
  'Health decisions should always be made together with a qualified care professional.',
]
const WORDS = POOL.join(' ').split(' ')
const START = POOL.map((_, i) => POOL.slice(0, i).join(' ').split(' ').filter(Boolean).length)

const STOP = new Set(['the', 'a', 'an', 'of', 'to', 'and', 'any', 'by', 'in', 'on', 'for', 'with', 'or', 'is', 'are', 'be', 'may', 'can', 'should', 'this', 'these', 'its', 'as', 'at', 'from', 'that', 'if', 'all', 'each', 'without', 'only', 'using', 'together', 'about', 'described', 'sent', 'means', 'made', 'used'])

export function text(n, k = 0) {
  const from = START[k % POOL.length]
  const out = []
  for (let i = 0; out.length < n; i++) out.push(WORDS[(from + i) % WORDS.length])
  // Don't end a cut-off sentence on a dangling function word.
  while (out.length > 1 && STOP.has(out[out.length - 1].toLowerCase())) out.pop()
  return out.join(' ').replace(/[.,]$/, '') + '.'
}

let k = 0
const t = (n) => text(n, k++)

const NOTICE = 'Placeholder text — not a real policy.'

export const LEGAL = {
  terms: {
    docTitle: 'Impilo | Terms of Service',
    title: 'Terms of Service',
    notice: NOTICE,
    address: ['Impilo Placeholder, Inc.', '100 Example Street, Suite 200', 'Philadelphia, PA 00000'],
    intro: [t(42), t(33)],
    sections: [
      { title: 'Using This Website', items: [
        { parts: ['This placeholder website is available at ', { link: 'home', label: 'www.impilo.health' }, ' for demonstration only.'] },
        t(11),
      ] },
      { title: 'Eligibility', items: [t(29), t(16), t(37)] },
      { title: 'Accounts and Access', items: [t(34), t(45)] },
      { title: 'Acceptable Use', items: [t(19), t(46), t(19), t(22)] },
      { title: 'Intellectual Property', items: [t(45)] },
      { title: 'Third-Party Services', items: [t(44), t(35)] },
      { title: 'Disclaimers', items: [t(41), t(45)] },
      { title: 'Limitation of Liability', items: [t(55)] },
      { title: 'Indemnification', items: [t(29)] },
      { title: 'Termination', items: [t(30)] },
      { title: 'Governing Law', items: [t(39)] },
      { title: 'Contact Information', items: [
        t(28),
        { parts: ['Placeholder support requests may be sent to ', { link: 'mailto', label: 'support@impilo.health' }, ' at any time.'] },
        t(26),
      ] },
      { title: 'Changes to These Terms', items: [t(25)] },
    ],
  },
  privacy: {
    docTitle: 'Impilo | Privacy Policy',
    title: 'Privacy Policy',
    notice: NOTICE,
    address: ['Attention: Privacy Office, Impilo Placeholder, Inc.', '100 Example Street, Suite 200', 'Philadelphia, PA 00000, USA'],
    intro: [t(30)],
    sections: [
      { title: 'Information We Collect', items: [t(32), t(27)] },
      { title: 'How Information Is Used', items: [t(52), t(25)] },
      { title: 'Sharing of Information', items: [t(58), t(30), t(32)] },
      { title: 'Data Security', items: [t(39)] },
      { title: 'Data Retention', items: [t(47)] },
      { title: 'Your Choices', items: [t(50)] },
      { title: 'Children', items: [t(44)] },
      { title: 'Contact Us', items: [
        { parts: ['Placeholder privacy questions can go to ', { link: 'mailto', label: 'support@impilo.health' }, ' by email.'] },
        t(24),
      ] },
    ],
  },
  'app-privacy': {
    docTitle: 'Impilo | Privacy Policy',
    title: 'Impilo Patient App Privacy Policy',
    notice: NOTICE,
    address: ['Impilo Placeholder, Inc.', '100 Example Street, Suite 200', 'Philadelphia, PA 00000'],
    addressExtraBreak: true,
    intro: [t(26)],
    // Flatter structure: one level of numbered items, some with a short nested list.
    items: [
      { text: 'Information the app may collect:', sub: [t(14), t(18)], subList: ['Readings', 'Device details'] },
      { text: t(31), list: [t(6), t(7), t(6)] },
      { text: t(43) },
      { text: t(35) },
      { text: t(58), list: [t(5), t(6), t(5)] },
      { text: t(15) },
      { text: t(36) },
      { text: t(16) },
      { text: t(23) },
    ],
  },
}
