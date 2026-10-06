import { useRef, useState } from 'react'
import InlineSvg from '../shared/InlineSvg'
import shareX from '../../assets/svg/blog/share-x.svg?raw'
import shareLinkedin from '../../assets/svg/blog/share-linkedin.svg?raw'
import shareFacebook from '../../assets/svg/blog/share-facebook.svg?raw'
import shareCopy from '../../assets/svg/blog/share-copylink.svg?raw'
import shareBit from '../../assets/svg/blog/share-bit.svg?raw'

/*
 * Share column (BLOG_SPEC B2.6). Visuals and hover hints are kept; by request X / LinkedIn /
 * Facebook do NOT open external share URLs -- they are non-navigating buttons. "Copy Link"
 * copies location.href, shows "Link Copied!", and resets 100ms after mouseleave.
 */
function ShareButton({ svg, label, onClick, onMouseLeave }) {
  return (
    <button
      type="button"
      className="share-btn relative block u-h-[36] u-w-[36]"
      aria-label={label}
      onClick={onClick}
      onMouseLeave={onMouseLeave}
    >
      <InlineSvg svg={svg} className="block u-h-[36] u-w-[36]" aria-hidden="true" />
      <span className="share-hint type-body-xs" aria-hidden="true">
        <InlineSvg svg={shareBit} className="share-hint__bit" />
        {label}
      </span>
    </button>
  )
}

export default function Share() {
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)
  const copy = () => {
    const url = window.location.href
    const done = () => setCopied(true)
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, done)
    else done()
  }
  return (
    <div className="grid u-gap-[18] mob:flex mob:border-b mob:border-lavender05 mob:u-pb-[12]">
      <ShareButton svg={shareX} label="Share on X" />
      <ShareButton svg={shareLinkedin} label="Share on LinkedIn" />
      <ShareButton svg={shareFacebook} label="Share on Facebook" />
      <ShareButton
        svg={shareCopy}
        label={copied ? 'Link Copied!' : 'Copy Link'}
        onClick={copy}
        onMouseLeave={() => {
          clearTimeout(timer.current)
          timer.current = window.setTimeout(() => setCopied(false), 100)
        }}
      />
    </div>
  )
}
