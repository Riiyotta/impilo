import InfoPage from './InfoPage'
import { useDocumentMeta } from '../lib/meta'

/* /careers/ -- internal replacement for the external careers subdomain. Placeholder copy. */
const VALUES = [
  {
    title: 'Patients first',
    text: 'Every decision starts with the person opening the box at home. We build for their experience first.',
  },
  {
    title: 'Own the details',
    text: 'Small things decide whether a program works. We take responsibility for them, end to end.',
  },
  {
    title: 'Better together',
    text: 'Operations, engineering and support work as one team, with clear handoffs and shared goals.',
  },
]

const ROLES = [
  { title: 'Operations Coordinator', team: 'Fulfillment', location: 'Philadelphia, PA' },
  { title: 'Patient Support Specialist', team: 'Support', location: 'Remote (US)' },
  { title: 'Software Engineer, Integrations', team: 'Engineering', location: 'Remote (US)' },
]

export default function Careers() {
  useDocumentMeta({
    title: 'Impilo | Careers',
    description: 'Join the team helping care programs bring connected health devices to patients at home.',
  })
  return (
    <InfoPage
      title="Help us build the future of connected care"
      intro="We are a team of operators, engineers and support specialists helping care programs reach patients at home."
      cardsTitle="How we work"
      cards={VALUES}
      cta={{
        title: 'Don’t see your role? We would still like to hear from you',
        buttonLabel: 'Contact Us',
        href: 'mailto:sales@impilo.health',
      }}
    >
      <div className="u-pt-[100] mob:u-pt-[60]">
        <h2 className="type-h3 text-blue01 u-mb-[40] mob:type-h4">Open roles</h2>
        <ul className="border-t border-lavender05">
          {ROLES.map((role) => (
            <li
              key={role.title}
              className="flex items-center justify-between border-b border-lavender05 u-gap-[24] u-py-[28] mob:flex-col mob:items-start mob:u-gap-[8]"
            >
              <span className="type-h4 text-blue01">{role.title}</span>
              <span className="type-body-m text-silver01">
                {role.team} · {role.location}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </InfoPage>
  )
}
