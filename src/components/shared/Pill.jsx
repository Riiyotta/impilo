import InlineSvg from './InlineSvg'
import pillLogo from '../../assets/svg/pill-logo.svg?raw'

/* CLONE_SPEC 0.5 Pill. GSAP clip-path wipe loop runs on the logo path (data-anim="pill"). */
export default function Pill({ className = '', ...rest }) {
  return (
    <div className={`pill ${className}`} data-anim="pill" {...rest}>
      <InlineSvg svg={pillLogo} className="pill__logo" aria-hidden="true" />
    </div>
  )
}
