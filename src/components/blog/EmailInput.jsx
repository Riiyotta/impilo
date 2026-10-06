import { useState } from 'react'
import InlineSvg from '../shared/InlineSvg'
import AutoAnimate from '../shared/AutoAnimate'
import emailLogo from '../../assets/svg/blog/email-logo.svg?raw'
import emailSubmit from '../../assets/svg/blog/email-submit.svg?raw'

const TITLES = {
  idle: 'Get Impilo News and Updates right to your inbox.',
  success: 'Thanks for subscribing',
  error: 'Something went wrong. Check your connection, and contact us if the issue persists.',
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/*
 * Newsletter EmailInput (BLOG_SPEC B1.3). The original posts to HubSpot Forms; the clone FAKES the
 * submission locally (no network): loading (input disabled) -> success.
 * Title text crossfades through AutoAnimate (opacity only).
 */
export default function EmailInput() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [invalid, setInvalid] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    if (status === 'loading' || status === 'success') return
    if (!EMAIL_RE.test(email.trim())) {
      setInvalid(true)
      return
    }
    setInvalid(false)
    setStatus('loading')
    window.setTimeout(() => setStatus('success'), 600)
  }

  const titleKey = status === 'success' || status === 'error' ? status : 'idle'
  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="flex flex-col items-start bg-blue02 u-gap-[16] u-px-[24] u-py-[30] u-rounded-[15] mob:u-gap-[20] mob:u-rounded-[14]"
    >
      <InlineSvg svg={emailLogo} className="h-auto u-w-[69]" aria-hidden="true" />
      <AutoAnimate
        activeKey={titleKey}
        inFrom={{ opacity: 0 }}
        outTo={{ opacity: 0 }}
        className="email-input__title type-body-r text-silver05 u-w-[228]"
      >
        <span>{TITLES[titleKey]}</span>
      </AutoAnimate>
      <div className="relative flex w-full u-gap-[16]">
        <div
          className="email-input__field flex w-full items-center bg-silver05 u-rounded-[6]"
          data-invalid={invalid ? '' : undefined}
        >
          <input
            type="email"
            name="email"
            aria-label="Your Email"
            placeholder="Your Email"
            value={email}
            disabled={status === 'loading'}
            onChange={(e) => {
              setEmail(e.target.value)
              if (invalid) setInvalid(false)
            }}
            className="email-input__input w-full bg-transparent type-body-m text-blue01 u-h-[48] u-px-[13] u-py-[15] u-rounded-[6]"
          />
          {status === 'success' ? (
            /* Check-circle icon: not captured in the recon SVGs; minimal stroke icon per spec size/color. */
            <svg viewBox="0 0 18 18" fill="none" className="shrink-0 u-h-[18] u-m-[13] u-w-[18]" aria-hidden="true">
              <circle cx="9" cy="9" r="8" stroke="var(--brightBlue)" strokeWidth="1.5" />
              <path d="M5.5 9.2l2.3 2.3 4.7-4.9" stroke="var(--brightBlue)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <button type="submit" aria-label="submit email" className="shrink-0 u-h-[44] u-p-[12] u-w-[44]">
              <InlineSvg svg={emailSubmit} className="u-h-[20] u-w-[20]" aria-hidden="true" />
            </button>
          )}
        </div>
        {invalid && (
          <span
            className="absolute type-body-xs text-[#f76161] u-ml-[16] u-mt-[6]"
            style={{ top: 'calc(100% + var(--u) * 3)', left: 'calc(var(--u) * -8)' }}
          >
            Invalid Email
          </span>
        )}
      </div>
    </form>
  )
}
