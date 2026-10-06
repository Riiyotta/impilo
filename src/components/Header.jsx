import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import InlineSvg from './shared/InlineSvg'
import TextLink from './shared/TextLink'
import PrimaryButton from './shared/PrimaryButton'
import UniversalLink from './shared/UniversalLink'
import { useRoutePathname, useTransitionNavigate } from './PageTransition'
import logoHeader from '../assets/svg/logo-header.svg?raw'
import logoMobile from '../assets/svg/logo-mobile-header.svg?raw'
import chevronSvg from '../assets/svg/icon-chevron-down.svg?raw'

gsap.registerPlugin(ScrollToPlugin)

const SOLUTIONS = [
  { label: 'Overview', href: '/solutions' },
  { label: 'Impilo Platform', href: '/solutions/impilo-platform' },
  { label: 'Digital Health Logistics', href: '/solutions/digital-health-logistics' },
  { label: 'Tech-Enabled Services', href: '/solutions/tech-enabled-services' },
  { label: 'Direct-to-Patient', href: '/solutions/direct-to-patient' },
]

const WHO_WE_SERVE = [
  { label: 'Virtual Care Companies', href: '/use-cases/virtual-care-companies' },
  { label: 'Physicians & Providers', href: '/use-cases/physicians-and-provider-groups' },
  { label: 'Health Plans & Payers', href: '/use-cases/health-plans-and-payers' },
  { label: 'Health Systems & MSOs', href: '/use-cases/health-systems-and-msos' },
  { label: 'Value-Based Care', href: '/use-cases/value-based-care' },
  { label: 'OEMs', href: '/use-cases/oems' },
]

const DESKTOP_LINKS = [
  { label: 'About Us', href: '/about/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'SDK', href: '/integrations/' },
  { label: 'Docs', href: '/developers/' },
]

const MOBILE_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'SDK', href: '/integrations' },
  { label: 'Docs', href: '/developers/' },
  { label: 'Careers', href: '/careers/' },
  { label: 'Contact Us', href: 'mailto:sales@impilo.health' },
]

/* ---------------------------------------------------------------- */
/* Desktop dropdown (Radix DropdownMenu, modal: false, sideOffset 8) */
/* ---------------------------------------------------------------- */
function NavDropdown({ label, items }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const go = useTransitionNavigate()

  useEffect(() => {
    if (!open) return
    const onPointer = (e) => {
      if (!rootRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const state = open ? 'open' : 'closed'
  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="nav-trigger type-body-m"
        aria-haspopup="menu"
        aria-expanded={open}
        data-state={state}
        // Radix DropdownMenu.Trigger toggles on pointerdown (primary button, no ctrl), not on click.
        onPointerDown={(e) => {
          if (e.button !== 0 || e.ctrlKey) return
          setOpen((o) => !o)
          e.preventDefault()
        }}
        // Keyboard activation (Enter/Space fire a click with detail 0).
        onClick={(e) => {
          if (e.detail === 0) setOpen((o) => !o)
        }}
      >
        {label}
        <InlineSvg svg={chevronSvg} className="nav-trigger__chevron" aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" className="nav-dropdown" data-state={state}>
          {items.map((item) => (
            <button
              key={item.href}
              type="button"
              role="menuitem"
              className="nav-dropdown__item"
              onClick={() => {
                setOpen(false)
                if (go) go(item.href)
                else window.location.href = item.href
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function DesktopTabletHeader() {
  return (
    <header className="grid place-items-center bg-blue05 mob:hidden">
      <div className="flex w-full max-w-page items-center justify-between u-px-[50] u-pt-[50]">
        <UniversalLink href="/" aria-label="Impilo home">
          <InlineSvg svg={logoHeader} className="inline h-auto overflow-visible align-baseline u-w-[69.3]" aria-hidden="true" />
        </UniversalLink>
        <nav className="flex items-center u-gap-[40]">
          <NavDropdown label="Our Solutions" items={SOLUTIONS} />
          <NavDropdown label="Who We Serve" items={WHO_WE_SERVE} />
          {DESKTOP_LINKS.map((link) => (
            <TextLink key={link.label} href={link.href}>
              {link.label}
            </TextLink>
          ))}
          <PrimaryButton href="/request-demo/">Request Demo</PrimaryButton>
        </nav>
      </div>
    </header>
  )
}

/* ---------------------------------------------------------------- */
/* Mobile header + menu (Radix Dialog equivalent)                    */
/* ---------------------------------------------------------------- */
function MobileMenuSection({ title, items }) {
  return (
    <div className="flex flex-col gap-[16px]">
      <span className="type-h4 text-blue02">{title}</span>
      <div className="flex flex-col gap-[12px] pl-[16px]">
        {items.map((item) => (
          <UniversalLink
            key={item.href}
            href={item.href}
            className="type-body-r text-blue03 transition-colors duration-200 hover:text-blue04"
          >
            {item.label}
          </UniversalLink>
        ))}
      </div>
    </div>
  )
}

function MobileMenu({ state, onClose, onExited }) {
  const handleAnimationEnd = (e) => {
    if (state === 'closed' && e.target === e.currentTarget) onExited()
  }
  return createPortal(
    <>
      <div className="mobile-overlay" data-state={state} onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className="mobile-menu"
        data-state={state}
        onAnimationEnd={handleAnimationEnd}
      >
        <button type="button" className="mobile-menu__close u-w-[18] u-h-[18]" aria-label="Close Navigation" onClick={onClose}>
          {/* Spec 1.2 gives an 18x18 close svg but no asset was captured; minimal X placeholder. */}
          <svg viewBox="0 0 18 18" fill="none" className="h-full w-full" aria-hidden="true">
            <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1" className="text-lavender01" />
          </svg>
        </button>
        <UniversalLink href="/" aria-label="Impilo home" className="w-fit">
          <InlineSvg svg={logoMobile} className="mobile-menu__logo inline h-auto align-baseline u-w-[133]" aria-hidden="true" />
        </UniversalLink>
        <MobileMenuSection title="Our Solutions" items={SOLUTIONS} />
        <MobileMenuSection title="Who We Serve" items={WHO_WE_SERVE} />
        {MOBILE_LINKS.map((link) => (
          <TextLink key={link.label} href={link.href} variant="menu">
            {link.label}
          </TextLink>
        ))}
        <PrimaryButton href="/request-demo/">Request Demo</PrimaryButton>
        <div className="grid type-body-r text-blue02 u-gap-[4]">
          <UniversalLink href="/privacy">Privacy Policy</UniversalLink>
          <UniversalLink href="/terms">Terms of Service</UniversalLink>
        </div>
      </div>
    </>,
    document.body,
  )
}

function MobileHeader() {
  // 'closed-unmounted' | 'open' | 'closed' (closing animation running)
  const [menuState, setMenuState] = useState('closed-unmounted')
  const headerRef = useRef(null)
  const isOpen = menuState === 'open'

  const open = () => {
    setMenuState('open')
    gsap.to(window, { scrollTo: headerRef.current.offsetTop, duration: 0.5, ease: 'power3.out' })
  }
  const close = () => setMenuState((s) => (s === 'open' ? 'closed' : s))

  // The menu closes on route change (CLONE_SPEC 1.2).
  const pathname = useRoutePathname()
  useEffect(() => {
    close()
  }, [pathname])

  useEffect(() => {
    if (!isOpen) return
    const mq = window.matchMedia('(max-width: 500px)')
    const onChange = (e) => {
      if (!e.matches) close()
    }
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    mq.addEventListener('change', onChange)
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      mq.removeEventListener('change', onChange)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen])

  return (
    <header
      ref={headerRef}
      className="relative z-[2] hidden items-center justify-between bg-blue05 will-change-transform u-h-[113] u-px-[15] mob:flex"
    >
      <UniversalLink href="/" aria-label="Impilo home">
        <InlineSvg svg={logoMobile} className="inline h-auto align-baseline u-w-[69.3]" aria-hidden="true" />
      </UniversalLink>
      <button
        type="button"
        className="hamburger"
        aria-label="Open Navigation"
        aria-expanded={isOpen}
        data-state={isOpen ? 'open' : 'closed'}
        onClick={isOpen ? close : open}
      >
        <span className="hamburger__line" />
        <span className="hamburger__line" />
        <span className="hamburger__line" />
      </button>
      {menuState !== 'closed-unmounted' && (
        <MobileMenu state={menuState} onClose={close} onExited={() => setMenuState('closed-unmounted')} />
      )}
    </header>
  )
}

export default function Header() {
  return (
    <>
      <DesktopTabletHeader />
      <MobileHeader />
    </>
  )
}
