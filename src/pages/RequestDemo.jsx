import { useLayoutEffect, useRef } from 'react'
import DemoForm from '../components/requestDemo/DemoForm'
import { runPage } from '../animations/pages/runner'
import '../styles/pages.css'

/*
 * COMPANY_PAGES_SPEC R: /request-demo/ ("Impilo | Request a Demo").
 * Header variant: sets data-route="request-demo" on <html> while mounted; pages.css hides the
 * desktop header's "Request Demo" CTA from it (see handoff for the equivalent Header prop).
 * The reCAPTCHA / Google policy note is intentionally omitted (no reCAPTCHA in the clone).
 */
export default function RequestDemo() {
  const root = useRef(null)
  useLayoutEffect(() => {
    document.title = 'Impilo | Request a Demo'
    const html = document.documentElement
    html.dataset.route = 'request-demo'
    const dispose = runPage(root.current)
    return () => {
      dispose()
      if (html.dataset.route === 'request-demo') delete html.dataset.route
    }
  }, [])
  return (
    <div ref={root} className="pg-request-demo" data-page="request-demo">
      <section className="mx-auto flex justify-between bg-blue01 text-silver05 u-min-h-[760] u-mt-[25] u-pb-[78] u-pt-[60] u-px-[60] u-rounded-[24] u-w-[1340] tab:block tab:u-min-h-[1074] tab:u-px-[36] tab:u-w-[924] mob:block mob:u-pb-[60] mob:u-pt-[36] mob:u-px-[24] mob:u-w-[345]">
        <div className="flex flex-col items-start u-w-[500] tab:w-auto mob:w-auto">
          <img src="/assets/svg/pill-logo.svg" alt="" aria-hidden="true" className="block w-auto u-h-[78]" />
          <h1 className="border-b border-solid border-blue02 type-h1 text-silver05 u-max-w-[500] u-mb-[26] u-mt-[24] u-pb-[32] tab:max-w-none tab:border-b-0 tab:type-h2 tab:u-mb-[24] tab:pb-0 mob:border-b-0 mob:type-h3 mob:u-mb-[24] mob:pb-0">
            Schedule a Demo
          </h1>
          <p className="type-h4 text-blue07 u-max-w-[500] tab:border-b tab:border-solid tab:border-blue02 tab:u-h-[76] tab:u-mb-[27] tab:u-pb-[32] mob:type-body-l mob:u-h-[83]">
            Share a few details first, then we will find a time on the calendar.
          </p>
        </div>
        <div>
          <DemoForm />
        </div>
      </section>
    </div>
  )
}
