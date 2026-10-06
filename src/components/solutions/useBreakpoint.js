import { useEffect, useState } from 'react'

/* Breakpoint name per CLONE_SPEC 0.1: mobile <=500, tablet 501-1024, desktop above. */
const get = () => (window.innerWidth <= 500 ? 'mobile' : window.innerWidth <= 1024 ? 'tablet' : 'desktop')

export default function useBreakpoint() {
  const [bp, setBp] = useState(get)
  useEffect(() => {
    const onResize = () => setBp(get())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return bp
}

/* document width (clientWidth, excludes the scrollbar), updated on resize */
export function useDocumentWidth() {
  const [w, setW] = useState(() => document.documentElement.clientWidth)
  useEffect(() => {
    const onResize = () => setW(document.documentElement.clientWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return w
}
