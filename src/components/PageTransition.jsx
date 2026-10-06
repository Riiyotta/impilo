import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useBlocker, useLocation, useNavigate } from 'react-router-dom'
import InlineSvg from './shared/InlineSvg'
import pulseSvg from '../assets/svg/transition-pulse.svg?raw'
import { playTransitionIn, playTransitionOut } from '../animations/transition'
import { ScrollTrigger } from '../animations/utils'

/*
 * Page transition "slide" (BLOG_SPEC B3.1 / CLONE_SPEC 0.6 Transition__Wrapper, 12).
 *
 * Flow for an internal link click (UniversalLink -> useTransitionNavigate):
 *   1. overlay plays "in" over the old page
 *   2. at 0.5s (covered): scroll to top, router navigates -> old page unmounts (its animation
 *      cleanup reverts pins), new page mounts and builds its own timelines
 *   3. <RouteChangeEffects/> (rendered after the outlet, so it runs after the page's layout
 *      effects) refreshes ScrollTrigger and plays "out".
 * Browser back/forward (POP) to another page is held by useBlocker, the overlay plays "in", then
 * the blocked navigation proceeds and the same steps 2-3 run.
 */
const TransitionContext = createContext(null)

export const normalizePath = (p) => (p || '/').replace(/\/+$/, '') || '/'

export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const overlayRef = useRef(null)
  const pending = useRef(false)
  const locRef = useRef(location)
  locRef.current = location

  const go = useCallback(
    (to) => {
      if (pending.current) return
      const url = new URL(to, window.location.origin)
      const cur = locRef.current
      const samePath = normalizePath(url.pathname) === normalizePath(cur.pathname)
      if (samePath) {
        // Same page (possibly different query/hash): no overlay, plain navigation.
        if (url.pathname + url.search + url.hash !== cur.pathname + cur.search + cur.hash) navigate(to)
        window.scrollTo(0, 0)
        return
      }
      pending.current = true
      playTransitionIn(overlayRef.current, () => {
        window.scrollTo(0, 0)
        navigate(to)
      })
    },
    [navigate],
  )

  // Browser back/forward to a different page: hold it until the overlay has covered the old page.
  const blocker = useBlocker(
    ({ historyAction, currentLocation, nextLocation }) =>
      historyAction === 'POP' &&
      !pending.current &&
      normalizePath(currentLocation.pathname) !== normalizePath(nextLocation.pathname),
  )
  useEffect(() => {
    if (blocker.state !== 'blocked') return
    pending.current = true
    playTransitionIn(overlayRef.current, () => {
      window.scrollTo(0, 0)
      blocker.proceed()
    })
  }, [blocker])

  const finish = useCallback(() => {
    if (!pending.current) return
    playTransitionOut(overlayRef.current, () => {
      pending.current = false
    })
  }, [])

  const pathname = normalizePath(location.pathname)
  const value = useMemo(() => ({ go, finish, overlayRef, pathname }), [go, finish, pathname])
  return <TransitionContext.Provider value={value}>{children}</TransitionContext.Provider>
}

/* Navigate with the slide transition. Returns null outside the provider (no router). */
export function useTransitionNavigate() {
  const ctx = useContext(TransitionContext)
  return ctx ? ctx.go : null
}

/* Current normalized pathname (null outside the provider). */
export function useRoutePathname() {
  const ctx = useContext(TransitionContext)
  return ctx ? ctx.pathname : null
}

/* Transition__Wrapper: fixed overlay, blue02, z 100, centered pulse svg 168 wide; hidden on load. */
export function TransitionOverlay() {
  const { overlayRef } = useContext(TransitionContext)
  return (
    <div ref={overlayRef} className="transition-overlay" aria-hidden="true">
      <InlineSvg svg={pulseSvg} className="h-auto u-w-[168]" />
    </div>
  )
}

/* Rendered BEFORE the page outlet: resets scroll before the new page's layout effects run. */
export function RouteScrollReset() {
  const { pathname } = useLocation()
  const key = normalizePath(pathname)
  const first = useRef(true)
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    if (first.current) {
      first.current = false
      return
    }
    window.scrollTo(0, 0)
  }, [key])
  return null
}

/* Rendered AFTER the page outlet: runs once the new page has built its timelines. */
export function RouteChangeEffects() {
  const { pathname } = useLocation()
  const key = normalizePath(pathname)
  const { finish } = useContext(TransitionContext)
  const first = useRef(true)
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    window.scrollTo(0, 0)
    ScrollTrigger.refresh()
    const raf = requestAnimationFrame(() => finish())
    return () => cancelAnimationFrame(raf)
  }, [key, finish])
  return null
}
