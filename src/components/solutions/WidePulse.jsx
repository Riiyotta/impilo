import useBreakpoint, { useDocumentWidth } from './useBreakpoint'

/*
 * Spec 1.2 WidePulse: full-bleed ECG line. Base path blue02, `.animate` copy brightBlue driven by
 * AnimatedPaths (animations/pages/solutions.js). Desktop geometry extends by o = docWidth - 1440.
 */
function geometry(bp, docWidth) {
  if (bp === 'mobile')
    return {
      viewBox: '0 0 375 147',
      d: 'M0 135H88.8021L97.9167 118.534L107.031 102.068L116.146 118.534L125.26 135H159.115L187.5 20L220.312 135H255.729L264.714 117.619L274.219 135L292.448 91.875L309.635 135H390',
    }
  if (bp === 'tablet')
    return {
      viewBox: '0 0 1024 346',
      d: 'M0 334H242.489L267.378 289.041L292.267 244.082L317.156 289.041L342.044 334H434.489L512 20L601.6 334H698.311L722.844 286.543L748.8 334L798.578 216.25L845.511 334H1040',
    }
  const o = docWidth - 1440
  return {
    viewBox: `${-o / 2} 0 ${1440 + o} 472`,
    d: `M${-o / 2} 460H341L376 397L411 334L446 397L481 460H611L720 20L846 460H982L1016.5 393.5L1053 460L1123 295L1189 460H${1440 + o / 2}`,
  }
}

export default function WidePulse() {
  const bp = useBreakpoint()
  const docWidth = useDocumentWidth()
  const { viewBox, d } = geometry(bp, docWidth)
  // Original wraps the svg in the AnimatedPaths <div>; the svg stays inline, so the wrapper gains the
  // line-box descender gap below it (6.9px at 1440) -- keep that box so following sections line up.
  // The wrapper is also the AnimatedPaths trigger (top 90%), as in the original.
  return (
    <div className="w-full" data-sol="wide-pulse">
      <svg
        className="animated-paths inline h-auto align-baseline w-[100vw] max-w-none u-mt-[67] mob:u-mt-[60]"
        viewBox={viewBox}
        fill="none"
        aria-hidden="true"
      >
        <path d={d} stroke="var(--blue02)" strokeWidth="10" strokeMiterlimit="16" />
        <path
          className="animate"
          d={d}
          stroke="var(--brightBlue)"
          strokeWidth="10"
          strokeMiterlimit="16"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
