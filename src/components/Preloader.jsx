import InlineSvg from './shared/InlineSvg'
import preloaderGraphic from '../assets/svg/preloader-graphic.svg?raw'

/*
 * CLONE_SPEC 0.7 Preloader. Rendered in its first-load state (counter "00").
 * The Animation layer drives the counter (data-anim="preloader-counter") and the exit
 * (yPercent 120 + radius, children y/opacity, then autoAlpha 0).
 */
export default function Preloader() {
  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[100] grid h-full w-full place-items-center bg-blue02 type-h1"
      data-anim="preloader"
      aria-hidden="true"
    >
      {/* Original: a will-change:transform div holds graphic + counter; the exit tweens move it. */}
      <div style={{ willChange: 'transform' }} data-anim="preloader-content">
        <InlineSvg
          svg={preloaderGraphic}
          className="animated-paths inline h-auto align-baseline u-w-[344]"
          data-anim="preloader-graphic"
        />
        <div className="preloader__text">
          <span data-anim="preloader-counter">00</span>
          <span className="preloader__subtext type-kicker-s">Loading</span>
        </div>
      </div>
    </div>
  )
}
