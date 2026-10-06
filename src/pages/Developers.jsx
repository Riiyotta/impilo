import InfoPage from './InfoPage'
import { useDocumentMeta } from '../lib/meta'

/* /developers/ -- internal replacement for the external "Docs" link. Placeholder copy. */
const CARDS = [
  {
    title: 'Device data API',
    text: 'Receive normalized readings from supported devices in one consistent format, with units and timestamps included.',
  },
  {
    title: 'SDKs for mobile and web',
    text: 'Connect patient-owned devices and apps with ready-made building blocks for common platforms.',
  },
  {
    title: 'Events and webhooks',
    text: 'Subscribe to shipment, onboarding and reading events so your workflows react as soon as something changes.',
  },
]

export default function Developers() {
  useDocumentMeta({
    title: 'Impilo | Developers',
    description: 'Build on the Impilo platform: device data, SDKs and events for connected care programs.',
  })
  return (
    <InfoPage
      title="Build on the Impilo platform"
      intro="One set of tools for device data, patient onboarding and fulfillment, so your team can focus on the care experience."
      cardsTitle="What you can build with"
      cards={CARDS}
      cta={{ title: 'Ready to start building with Impilo?', buttonLabel: 'Explore Our Integrations', href: '/integrations/' }}
    />
  )
}
