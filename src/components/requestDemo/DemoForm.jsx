import { useEffect, useRef, useState } from 'react'
import AutoAnimate from '../shared/AutoAnimate'
import PrimaryAction from '../shared/PrimaryAction'
import TextInput from '../shared/form/TextInput'
import TextArea from '../shared/form/TextArea'
import Select from '../shared/form/Select'

const REFERRALS = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'conference', label: 'Conference' },
  { value: 'referral', label: 'Word of Mouth/Referral' },
  { value: 'google', label: 'Google' },
  { value: 'employee', label: 'Impilo Employee' },
  { value: 'other', label: 'Other' },
]

const EMPTY = { name: '', phone: '', email: '', company: '', referral: '', conference: '', other: '', comments: '' }
const REQUIRED = ['name', 'phone', 'email', 'company', 'referral']
const SUBMIT_DELAY = 1200

function validate(values) {
  const errors = {}
  const required = values.referral === 'conference' ? [...REQUIRED, 'conference'] : REQUIRED
  required.forEach((k) => {
    if (!values[k].trim()) errors[k] = 'Required'
  })
  // typeMismatch, or an address without "@domain"
  if (!errors.email && !/^[^\s@]+@[^\s@]+$/.test(values.email.trim())) errors.email = 'Invalid'
  return errors
}

/*
 * COMPANY_PAGES_SPEC R.2 form. Static look-alike: no reCAPTCHA, no HubSpot, no network.
 * Submit: preventDefault -> client-side validation -> "submitting" (opacity .5) -> after a short
 * delay, the local success state (AutoAnimate swap). Append ?formError to the URL to see the
 * error state instead of success.
 */
export default function DemoForm() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [attempted, setAttempted] = useState(false)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])

  const set = (name, value) => {
    const next = { ...values, [name]: value }
    setValues(next)
    if (attempted) setErrors(validate(next))
  }
  const bind = (name) => ({ name, value: values[name], onChange: (e) => set(name, e.target.value) })

  const onSubmit = (e) => {
    e.preventDefault()
    if (status === 'submitting') return
    setAttempted(true)
    const errs = validate(values)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setStatus('submitting')
    const fail = new URLSearchParams(window.location.search).has('formError')
    timer.current = setTimeout(() => setStatus(fail ? 'error' : 'success'), SUBMIT_DELAY)
  }

  const key = status === 'success' ? 'success' : status === 'error' ? 'error' : 'form'

  return (
    <AutoAnimate
      activeKey={key}
      className="rd-swap auto-animate--start"
      inFrom={{ opacity: 0 }}
      outTo={{ opacity: 0 }}
      animateWidth
    >
      {key === 'success' ? (
        <div className="flex flex-col items-center whitespace-nowrap type-h4 text-silver05 tab:u-w-[852] mob:whitespace-normal mob:text-center">
          <img
            src="/assets/images/request-demo-form-plane.webp"
            alt=""
            aria-hidden="true"
            className="block u-h-[313] u-mb-[48] u-mt-[44] u-w-[313] tab:u-mb-[33] tab:u-mt-[94] mob:h-auto mob:u-mb-[10] mob:ml-0 mob:u-mr-[15] mob:u-mt-[30] mob:u-w-[280]"
          />
          <p>Thanks! Your message is on its way. We&apos;ll be in touch.</p>
        </div>
      ) : (
        <div>
          {key === 'error' && (
            <p className="rd-error type-h4 text-brightTurquoise u-mb-[20] u-w-[400]" style={{ lineHeight: 1.2 }}>
              Something went wrong while sending your details. Please try submitting the form again, or if the problem
              continues, simply <a href="mailto:sales@impilo.health">email us.</a>
            </p>
          )}
          <form
            className="rd-form grid u-gap-[20] u-w-[550] tab:u-w-[852] mob:u-w-[297]"
            data-submitting={status === 'submitting' ? '' : undefined}
            noValidate
            onSubmit={onSubmit}
          >
            <TextInput {...bind('name')} placeholder="Full Name*" autoComplete="name" error={errors.name} />
            <TextInput {...bind('phone')} type="tel" placeholder="Phone Number*" autoComplete="tel" error={errors.phone} />
            <TextInput {...bind('email')} type="email" placeholder="Email Address*" autoComplete="email" error={errors.email} />
            <TextInput {...bind('company')} placeholder="Name of Company*" autoComplete="organization" error={errors.company} />
            <Select
              name="referral"
              placeholder="How did you hear about us?*"
              options={REFERRALS}
              value={values.referral}
              onChange={(v) => set('referral', v)}
              error={errors.referral}
            />
            {values.referral === 'conference' && (
              <TextInput {...bind('conference')} placeholder="Which conference?*" error={errors.conference} />
            )}
            {values.referral === 'other' && <TextInput {...bind('other')} placeholder="How did you hear about us?" />}
            <TextArea {...bind('comments')} placeholder="Anything else you want us to know?" />
            <div />
            <div className="flex w-full items-center justify-between mob:flex-col-reverse mob:text-center mob:u-gap-[32]">
              <PrimaryAction type="submit" className="mob:w-full">
                Submit Information
              </PrimaryAction>
            </div>
          </form>
        </div>
      )}
    </AutoAnimate>
  )
}
