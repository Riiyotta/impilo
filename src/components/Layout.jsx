import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Preloader from './Preloader'
import Header from './Header'
import Footer, { FooterSpacer } from './Footer'
import {
  TransitionProvider,
  TransitionOverlay,
  RouteScrollReset,
  RouteChangeEffects,
  normalizePath,
} from './PageTransition'
import { initGlobalAnimations } from '../animations'

/*
 * Global animations (preloader first-load exit, footer white-pill pulse, footer PIXI lines).
 * Rendered as the FIRST child so its layout effect runs before the page's (React runs sibling
 * subtrees' layout effects in order), matching the original single-entry init order.
 */
function GlobalAnimations() {
  useLayoutEffect(() => initGlobalAnimations(), [])
  return null
}

/*
 * Shared page skeleton (CLONE_SPEC 0.6):
 *   Transition__Wrapper (fixed overlay) -> Preloader (fixed, z 100, first load only)
 *   -> scroll index (z 2: header, main.layout-main > page, FooterSpacer) -> fixed footer (z 1)
 * The page outlet is keyed by pathname so every route change remounts the page and its
 * animation lifecycle (query-string changes on /blog/ do not remount).
 */
export default function Layout() {
  const { pathname } = useLocation()
  return (
    <TransitionProvider>
      <GlobalAnimations />
      <RouteScrollReset />
      <TransitionOverlay />
      <Preloader />
      <div className="relative z-[2]" data-anim="scroll-index">
        <Header />
        <main className="layout-main">
          <Outlet key={normalizePath(pathname)} />
        </main>
        <FooterSpacer />
      </div>
      <Footer />
      <RouteChangeEffects />
    </TransitionProvider>
  )
}
