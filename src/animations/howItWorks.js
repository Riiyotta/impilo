import { gsap, ci, KP, breakpoint, isIOS, softPin } from './utils'

/* IllustrationOne (original `qt`): rows scroll + head/card intro, trigger container "top center". */
function illustrationOne(el) {
  const q = gsap.utils.selector(el)
  const rows = el.querySelector('[data-anim="ill-one-rows"]')
  const rowsTween = gsap.to(rows, { y: ci(-80), repeat: -1, ease: 'none' })
  const tl = gsap.timeline({ scrollTrigger: { trigger: rows.parentElement, start: 'top center' } })
  tl.fromTo(rowsTween, { timeScale: 10 }, { timeScale: 0, duration: 3 })
  tl.from(
    ['.top-head', '.top-card', '.bottom-head', '.bottom-card'].flatMap((s) => q(s)),
    {
      opacity: 0,
      yPercent: 100,
      duration: 1,
      ease: 'power2.out',
      stagger: 0.25,
      onComplete: () => {
        gsap.to(q('.top-card, .bottom-card, .top-head, .bottom-head'), {
          yPercent: -6,
          duration: 4,
          yoyo: true,
          repeat: -1,
          ease: 'power1.inOut',
          stagger: 1,
        })
      },
    },
    0,
  )
}

/* IllustrationTwo (original `br`): devices rise + float, "158.00" -> "167.58" counter. */
function illustrationTwo(el) {
  const q = gsap.utils.selector(el)
  const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'center 75%' } })
  ;['.scale', '.thermo', '.glucose', '.pressure'].forEach((sel, i) => {
    tl.from(
      q(sel),
      {
        opacity: 0,
        y: 400,
        duration: 2,
        ease: 'power3.out',
        delay: 0.2 * i,
        onComplete: () => {
          gsap.to(q(sel), {
            y: sel === '.scale' ? ci(-30) : undefined,
            yPercent: sel === '.scale' ? undefined : -6,
            duration: 4,
            yoyo: true,
            repeat: -1,
            ease: 'power1.inOut',
            delay: 1 * i,
          })
        },
      },
      0,
    )
  })
  tl.to(q('.tens'), { yPercent: -100, ease: 'power3.inOut', duration: 0.7 }, 0.7)
    .to(q('.ones'), { yPercent: -900, duration: 3, ease: 'power2.inOut' }, 0)
    .to(q('.ones'), { marginRight: -ci(15), duration: 1, ease: 'power2.inOut' }, 2)
    .to(q('.decimals.first'), { marginLeft: ci(2), marginRight: -ci(3), duration: 0.5, ease: 'power2.inOut' }, 2.5)
    .to(q('.scale.text'), { x: ci(1), duration: 1, ease: 'power2.inOut' }, 2)
    .from(q('.scale.text'), { scale: 0.9, duration: 1, ease: 'power2.inOut' }, 2)
    .to(q('.decimals'), { yPercent: -100, duration: 1.5, ease: 'power4.inOut', stagger: 0.2 }, 1.8)
}

/* IllustrationThree (original `Kt`). */
function illustrationThree(el) {
  const q = gsap.utils.selector(el)
  const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'center 75%' } })
  tl.from(q('img'), { opacity: 0 }, 0)
  ;['.panel.pressure', '.panel.graph', '.stetho', '.glucose', '.medicine'].forEach((sel, i) => {
    tl.from(
      q(sel),
      {
        opacity: 0,
        y: 400,
        duration: 2,
        ease: 'power3.out',
        delay: 0.2 * i,
        onComplete: () => {
          if (sel === '.panel.pressure') return
          const target = sel === '.panel.graph' ? '.panel' : sel
          gsap.to(q(target), { yPercent: -6, duration: 4, yoyo: true, repeat: -1, ease: 'power1.inOut', delay: 1 * i })
        },
      },
      0,
    )
  })
  tl.from(q('.graph.line'), { clipPath: 'inset(0 100% 0 0)', duration: 2, ease: 'power3.out' }, 1.5)
}

/* IllustrationFour (original `ut`). */
function illustrationFour(el) {
  const q = gsap.utils.selector(el)
  const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'center 75%' } })
  tl.from(q('.sliders'), { opacity: 0, y: 400, duration: 2, ease: 'power3.out' })
    .from(
      q('.card'),
      {
        opacity: 0,
        y: 400,
        duration: 2,
        ease: 'power3.out',
        onComplete: () => {
          gsap.to(q('.card'), { yPercent: -6, duration: 4, yoyo: true, repeat: -1, ease: 'power1.inOut' })
          gsap.to(q('.panel'), { yPercent: -2, duration: 4, yoyo: true, repeat: -1, ease: 'power1.inOut', delay: 0.5 })
        },
      },
      0.2,
    )
    .from(q('.highlight'), { scale: 0.8, duration: 2.5, ease: 'power3.out' }, 0)
}

/*
 * How It Works (original `cl`, CLONE_SPEC 4).
 * Desktop (>= 1025): every TextPart then every ImagePart is soft-pinned
 *   { trigger: part, start: "center center", end: "+=" + (image ? 75vh : 100vh) + (last ? 100vh : 0),
 *     pinSpacing: !last, smoothLevel: 50 }
 * ImageParts fade from opacity 0 over the 25vh before pin start and to 0 over the 25vh after pin end.
 * PseudoBox frame: soft pin { start: "top -200px", end: "bottom -700%", smoothType "in", smoothLevel 200 }.
 * Tablet + mobile: the whole section is soft-pinned { start: "bottom " + 100vh, end: "bottom top",
 *   pinSpacing: false, smoothType "in", smoothLevel 50, anticipatePin 1 }.
 */
export function initHowItWorks() {
  const section = document.querySelector('[data-anim="works"]')
  if (!section) return
  const bp = breakpoint()
  const desktop = bp === 'desktop' || bp === 'fullWidth'

  if (desktop) {
    const pseudo = section.querySelector('[data-anim="works-pseudo-box"]')
    const texts = Array.from(section.querySelectorAll('[data-anim="works-text-part"]'))
    const images = Array.from(section.querySelectorAll('[data-anim="works-image-part"]'))
    ;[...texts, ...images].forEach((part) => {
      const isImage = images.includes(part)
      const last = part === images[images.length - 1] || part === texts[texts.length - 1]
      const st = softPin({
        trigger: part,
        start: 'center center',
        end: () => '+=' + (KP(isImage ? 75 : 100) + (last ? KP(100) : 0)),
        pinSpacing: !last,
        smoothLevel: 50,
        driftTarget: part.firstElementChild,
      })
      if (isImage) {
        gsap.to(part, { opacity: 0, scrollTrigger: { trigger: part, start: () => st.end, end: () => st.end + KP(25), scrub: true } })
        gsap.from(part, { opacity: 0, scrollTrigger: { trigger: part, start: () => st.start - KP(25), end: () => st.start, scrub: true } })
      }
    })
    softPin({
      trigger: pseudo,
      start: 'top -200px',
      end: 'bottom -700%',
      smoothType: 'in',
      smoothLevel: 200,
      driftTarget: pseudo,
      driftProp: 'translate',
    })
  } else {
    softPin({
      trigger: section,
      start: () => 'bottom ' + KP(100),
      end: 'bottom top',
      pinSpacing: false,
      smoothType: 'in',
      smoothLevel: 50,
      anticipatePin: 1,
      driftTarget: section,
      driftProp: 'translate',
    })
  }

  // Illustration intros (skipped on iOS mobile, as in the original).
  if (bp === 'mobile' && isIOS()) {
    const two = section.querySelector('[data-anim="ill-two"] .scale.text')
    if (two) gsap.set(two, { scale: 0.9 })
    return
  }
  const one = section.querySelector('[data-anim="ill-one"]')
  const two = section.querySelector('[data-anim="ill-two"]')
  const three = section.querySelector('[data-anim="ill-three"]')
  const four = section.querySelector('[data-anim="ill-four"]')
  one && illustrationOne(one)
  two && illustrationTwo(two)
  three && illustrationThree(three)
  four && illustrationFour(four)
}
