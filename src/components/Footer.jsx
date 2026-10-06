import InlineSvg from './shared/InlineSvg'
import TextLink from './shared/TextLink'
import PrimaryButton from './shared/PrimaryButton'
import UniversalLink from './shared/UniversalLink'
import logoFooter from '../assets/svg/logo-footer.svg?raw'
import pillLogo from '../assets/svg/pill-logo.svg?raw'

const LINKS = [
  { label: 'Our Solutions', href: '/solutions/' },
  { label: 'About Us', href: '/about/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Docs', href: '/developers/' },
  { label: 'Careers', href: '/careers/' },
  { label: 'Contact Us', href: 'mailto:sales@impilo.health' },
]

/* Transparent spacer at the end of the scroll content that reveals the fixed footer. */
export function FooterSpacer() {
  return (
    <div
      className="pointer-events-none max-h-[100lvh] u-h-[727] mob:u-h-[710]"
      data-anim="footer-spacer"
      aria-hidden="true"
    />
  )
}

/* CLONE_SPEC 11. Footer (fixed, revealed behind the page) */
export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer
      className="fixed bottom-0 left-0 z-[1] grid w-full place-items-center overflow-clip bg-blue05 u-h-[727] mob:u-h-[710]"
      data-anim="footer"
    >
      <div className="flex w-full max-w-page flex-col items-end u-gap-[24] u-pb-[80] u-pt-[104] u-px-[50] tab:u-py-[80] mob:items-start mob:u-gap-[22] mob:u-pb-[19] mob:u-pt-[64] mob:u-px-[20]">
        <div className="flex w-full items-end justify-between mob:flex-col mob:items-start mob:u-gap-[26]">
          <div className="relative mob:flex mob:flex-col mob:items-start">
            <UniversalLink href="/" aria-label="Impilo home">
              <InlineSvg svg={logoFooter} className="inline h-auto align-baseline u-w-[386] mob:u-w-[213]" aria-hidden="true" />
            </UniversalLink>
            <span className="absolute bottom-0 left-0 type-body-xs text-silver05 mob:relative">
              © {year} Impilo, Inc.
            </span>
          </div>
          <div className="flex items-center u-gap-[25] tab:items-end tab:u-gap-[67] mob:flex-col mob:items-start">
            <div className="flex items-center whitespace-nowrap u-gap-[48] tab:flex-col tab:items-start tab:u-gap-[20] tab:u-mb-[21] mob:flex-col mob:items-start mob:u-gap-[24]">
              {LINKS.map((link) => (
                <TextLink key={link.label} href={link.href}>
                  {link.label}
                </TextLink>
              ))}
            </div>
            <PrimaryButton href="/request-demo/">Request Demo</PrimaryButton>
          </div>
        </div>
        <div className="relative w-full u-h-[265] mob:hidden" data-anim="footer-lines-wrapper">
          <div className="relative h-full w-full [overflow:clip_visible]" data-anim="footer-lines">
            {/* Lines__Canvas: PIXI.js appends its canvas here (30 lines #6563EA bending around the pill). */}
            <div
              className="pointer-events-none absolute z-[1] u-inset-[-100]"
              data-anim="footer-lines-canvas"
              aria-hidden="true"
            />
          </div>
          {/* Lines__WhitePill: sibling of Lines__Wrapper in the original, so it is not clipped by it. */}
          <div className="pill footer-pill" data-anim="footer-white-pill" aria-hidden="true">
            <InlineSvg svg={pillLogo} />
          </div>
        </div>
        <div className="footer-info flex w-full items-center justify-end type-body-xs text-silver05 u-gap-[48] mob:u-gap-[25]">
          <span className="[grid-area:address]">2150 Kubach Road Philadelphia, PA, 19116</span>
          <a href="tel:+12028385839" className="[grid-area:phone]">
            (202) 838-5839
          </a>
          <UniversalLink href="/privacy/" className="[grid-area:privacy]">
            Privacy Policy
          </UniversalLink>
          <UniversalLink href="/terms/" className="[grid-area:terms]">
            Terms and Conditions
          </UniversalLink>
          {/* "Linkedin" (external) removed by request. */}
        </div>
      </div>
    </footer>
  )
}
