import { useLayoutEffect } from 'react'
import Hero from '../components/Hero'
import Focus from '../components/Focus'
import HowItWorks from '../components/HowItWorks'
import WhiteGlove from '../components/WhiteGlove'
import Trusted from '../components/Trusted'
import Articles from '../components/Articles'
import Integrations from '../components/Integrations'
import Cta from '../components/Cta'
import { initHomeAnimations } from '../animations'
import { useDocumentMeta } from '../lib/meta'

/* Homepage body (CLONE_SPEC 2-10). Rendered inside Layout's <main>. */
export default function Home() {
  useDocumentMeta({
    title: 'Impilo | Remote Patient Monitoring Devices',
    description:
      'Impilo provides API infrastructure for patient monitoring and connected supplies. Our platform enables the ability to buy, distribute, support, and integrate digital health devices/supplies. Impilo handles patient monitoring operations, while you handle the clinical.',
  })
  // Homepage timelines: built on mount, fully reverted on unmount (route change).
  useLayoutEffect(() => initHomeAnimations(), [])
  return (
    <>
      <Hero />
      <Focus />
      <HowItWorks />
      <div className="relative z-[2] min-h-screen rounded-[calc(var(--u)*24)] bg-silver03" data-anim="white">
        <WhiteGlove />
        <Trusted />
        <Articles />
        <Integrations />
        <Cta />
      </div>
    </>
  )
}
