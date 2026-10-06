import { useLayoutEffect, useRef } from 'react'
import IntegrationsHero from '../components/integrations/IntegrationsHero'
import Sdk from '../components/integrations/Sdk'
import Devices from '../components/integrations/Devices'
import { initIntegrationsPage } from '../animations/pages/integrations'
import '../styles/pages.css'

/* COMPANY_PAGES_SPEC I: /integrations/ ("Impilo | integrations") */
export default function IntegrationsPage() {
  const root = useRef(null)
  useLayoutEffect(() => {
    document.title = 'Impilo | integrations'
    return initIntegrationsPage(root.current)
  }, [])
  return (
    <div ref={root} className="pg-integrations">
      <IntegrationsHero />
      <Sdk />
      <Devices />
    </div>
  )
}
