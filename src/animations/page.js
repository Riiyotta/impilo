import { ScrollTrigger } from './utils'
import { initPills } from './loops'
import { initTextAnimations } from './text'

/*
 * Generic per-page animation lifecycle for non-homepage routes.
 * Scoped to `root` (the page's top element): Pill pulse loops + TextAnimation reveals
 * ([data-anim="text-lines"] / [data-anim="text-fade"], CLONE_SPEC 0.5). Text splits are rebuilt
 * once fonts are ready and when the viewport width changes (line breaks depend on both).
 * Returns a full cleanup; call it from the page's useLayoutEffect.
 */
export function initPageAnimations(root) {
  if (!root) return () => {}
  const disposePills = initPills(root)
  let disposeText = null
  const build = () => {
    disposeText && disposeText()
    disposeText = initTextAnimations(root)
    ScrollTrigger.refresh()
  }
  build()

  let alive = true
  document.fonts && document.fonts.ready.then(() => alive && build())

  let lastW = window.innerWidth
  let timer = 0
  const onResize = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (window.innerWidth === lastW) return
      lastW = window.innerWidth
      build()
    }, 200)
  }
  window.addEventListener('resize', onResize)

  return () => {
    alive = false
    clearTimeout(timer)
    window.removeEventListener('resize', onResize)
    disposeText && disposeText()
    disposePills()
  }
}
