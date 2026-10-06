import { useState } from 'react'
import InlineSvg from '../shared/InlineSvg'
import AutoAnimate from '../shared/AutoAnimate'
import PrimaryButton from '../shared/PrimaryButton'
import pulseSvg from '../../assets/svg/blog/filedownload-pulse.svg?raw'

const FIELDS = [
  { name: 'fullName', placeholder: 'Full Name', type: 'text' },
  { name: 'email', placeholder: 'Email Address', type: 'email' },
  { name: 'company', placeholder: 'Name of Company', type: 'text' },
]
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* Simple line-art laptop for the success state (spec: "use any simple line-art laptop"). */
function Laptop({ className }) {
  return (
    <svg viewBox="0 0 458 280" fill="none" className={className} aria-hidden="true">
      <rect x="69" y="12" width="320" height="210" rx="14" stroke="var(--blue07)" strokeWidth="2" />
      <rect x="89" y="32" width="280" height="170" rx="6" stroke="var(--blue03)" strokeWidth="2" />
      <path d="M12 236h434l-24 32H36L12 236Z" stroke="var(--blue07)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M199 246h60" stroke="var(--blue03)" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M119 132h44l8-16 8 32 14-62 14 62 8-16h96"
        stroke="var(--brightGreen)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/*
 * FileDownload embedded gated-download form (BLOG_SPEC B2.5). Submission is FAKED locally
 * (the original posts to HubSpot): inner dims to .5 while "submitting", then crossfades
 * (AutoAnimate, opacity only) to the success state.
 */
export default function FileDownload({ title }) {
  const [values, setValues] = useState({ fullName: '', email: '', company: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success

  const validate = () => {
    const next = {}
    FIELDS.forEach((f) => {
      const v = values[f.name].trim()
      // Measured: the original fields are not required; only a non-empty malformed email is flagged.
      if (f.type === 'email' && v && !EMAIL_RE.test(v)) next[f.name] = 'Invalid'
    })
    return next
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (status !== 'idle') return
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length) return
    setStatus('submitting')
    window.setTimeout(() => setStatus('success'), 800)
  }

  const set = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="bg-blue01 text-silver05 u-min-h-[881] u-p-[60] u-rounded-[24] u-w-[680] mob:u-p-[24] mob:u-w-[313]"
    >
      {/* Pulse + title sit outside the AutoAnimate (measured: title spans the full 560 content width). */}
      <InlineSvg svg={pulseSvg} className="inline h-auto align-baseline u-w-[160] mob:u-w-[82]" aria-hidden="true" />
      <h1 className="border-b border-blue02 type-h3 u-mb-[40] u-mt-[24] u-pb-[40]">{title}</h1>
      <AutoAnimate activeKey={status === 'success' ? 'success' : 'form'} inFrom={{ opacity: 0 }} outTo={{ opacity: 0 }} className="auto-animate--start">
        {status === 'success' ? (
          <div className="flex flex-col items-center">
            <Laptop className="h-auto u-mb-[56] u-mt-[83] u-mx-[50] u-w-[458] mob:u-mx-[7] mob:u-w-[250]" />
            <h4 className="text-center type-h4">Success, download will begin shortly!</h4>
            <a
              href="#"
              role="button"
              onClick={(e) => e.preventDefault()}
              className="file-download__late-link type-body-m text-blue03"
            >
              Click here if the download does not begin automatically
            </a>
          </div>
        ) : (
          <div>
            <div
              className="file-download__inner flex flex-col u-gap-[20]"
              style={{ opacity: status === 'submitting' ? 0.5 : 1 }}
            >
              {FIELDS.map((f) => (
                <label key={f.name} className="file-download__field" data-invalid={errors[f.name] ? '' : undefined}>
                  <input
                    type={f.type}
                    name={f.name}
                    placeholder={f.placeholder}
                    aria-label={f.placeholder}
                    value={values[f.name]}
                    onChange={set(f.name)}
                    disabled={status !== 'idle'}
                    className="file-download__control type-h4 mob:type-body-r"
                  />
                  {errors[f.name] && (
                    <span className="file-download__msg type-kicker-s text-brightTurquoise">{errors[f.name]}</span>
                  )}
                </label>
              ))}
              <label className="file-download__field file-download__field--area">
                <textarea
                  name="message"
                  placeholder="Anything else you want us to know?"
                  aria-label="Anything else you want us to know?"
                  value={values.message}
                  onChange={set('message')}
                  disabled={status !== 'idle'}
                  className="file-download__control type-body-m"
                />
              </label>
              <div />
              <PrimaryButton type="submit" className="mob:w-full" innerClassName="mob:text-center">
                Download
              </PrimaryButton>
            </div>
          </div>
        )}
      </AutoAnimate>
    </form>
  )
}
