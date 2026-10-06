import { gsap, ci, KP, breakpoint } from '../utils'
import { runPage, whenAnyEnd } from './runner'
import { splitFillLines, restoreFillLines, lineFillTimeline } from './lineFill'

/* COMPANY_PAGES_SPEC A motion. Returns a cleanup for the page's useLayoutEffect. */
export function initAbout(root) {
  return runPage(root, (root, state) => {
    const q = (s) => root.querySelector(`[data-anim="${s}"]`)
    const mobile = breakpoint() === 'mobile'
    const cleanups = []

    /* A.1 Hero ---------------------------------------------------------------- */
    const hero = q('about-hero')
    const box = q('about-hero-box')
    const logos = q('about-hero-logos')
    // Pins restore the inline styles they cached on revert; start every rebuild from natural transforms
    // so the entrance's from() tweens resolve to the real end state.
    gsap.set([hero, box], { clearProps: 'transform' })
    const lines = splitFillLines(box)
    cleanups.push(() => restoreFillLines(box))

    // Original: timeline({paused: !played, delay: .1}); once played (anyEnd fired), every rebuild
    // (recreateOnResize) replays the entrance immediately instead of waiting for anyEnd again.
    {
      const entrance = gsap.timeline({ paused: true, delay: 0.1 })
      entrance
        .set(box, { opacity: 1 })
        .from(hero, { scale: 0.5, duration: 1, ease: 'power1.out' }, 0)
        .from(box, { y: '200lvh', duration: 1, ease: 'power3.out' }, 0)
        .from(logos, { opacity: 0, duration: 0.001 }, 0.3)
        .from(lines, { yPercent: 100, clipPath: 'inset(0 0 100% 0)', duration: 1, stagger: 0.2, ease: 'power2.out' }, 0.3)
      // Hold the from-state until anyEnd (preloader / transition finished).
      entrance.progress(0)
      if (state.heroEntered && state.reason === 'resize') entrance.play()
      else if (state.heroEntered) entrance.progress(1)
      else
        cleanups.push(
          whenAnyEnd(() => {
            state.heroEntered = true
            entrance.play()
          }),
        )
    }

    // Line fill: FILL silver05, BASE blue04; scroll 0 -> 35vh.
    lineFillTimeline(lines, { start: 0, end: () => KP(35), scrub: true, invalidateOnRefresh: true })

    // Pin: desktop / fullWidth always; tablet only when 100vh > 900 design px; never on mobile.
    const pinHero = !mobile && (breakpoint() !== 'tablet' || KP(100) > ci(900))
    if (!pinHero) {
      gsap.set(hero, { marginBottom: 0 })
    } else {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: hero,
            start: 1,
            end: () => KP(135),
            pin: true,
            pinSpacing: false,
            scrub: 0.1,
          },
        })
        .to(hero, { yPercent: -50, ease: 'linear' })
    }

    /* A.2 Founded marquee ------------------------------------------------------- */
    const marquee = q('about-marquee')
    const groups = root.querySelectorAll('[data-anim="about-marquee-group"]')
    const M = mobile ? 0 : ci(345)
    const parentLeft = marquee.parentElement.getBoundingClientRect().left + window.scrollX
    const N = Math.max(0, parentLeft)
    gsap.set(marquee, { x: M })
    const mtl = gsap.timeline({ delay: 1 })
    mtl
      .to(marquee, { x: -N, duration: ((N + M) / 548) * 3.5, ease: 'linear' })
      .to(groups, { xPercent: -100, duration: 3.5 * 3, repeat: -1, ease: 'linear' })
    mtl.timeScale(0)
    gsap.to(mtl, {
      timeScale: 1,
      ease: 'power1.out', // original passes no ease -> GSAP default
      scrollTrigger: { trigger: marquee, start: 'top bottom', end: 'bottom bottom', scrub: 4 },
    })

    /* A.3 Anywhere -------------------------------------------------------------- */
    gsap.fromTo(
      q('about-stethoscope'),
      { yPercent: -6 },
      { yPercent: 6, duration: 7, ease: 'power2.inOut', repeat: -1, yoyo: true },
    )
    const anyP = root.querySelector('.about-anywhere__text')
    const anyLines = splitFillLines(anyP)
    cleanups.push(() => restoreFillLines(anyP))
    lineFillTimeline(anyLines, { trigger: anyP, start: 'top center', end: 'bottom center', scrub: true })

    /* A.4 Leadership: plays once ------------------------------------------------ */
    const people = q('about-people')
    if (!state.peoplePlayed) {
      gsap.from(people.children, {
        yPercent: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: people, start: 'top 75%', onEnter: () => (state.peoplePlayed = true) },
      })
    }

    /* A.5 Careers pulse --------------------------------------------------------- */
    const pulsePaths = q('about-pulse').querySelectorAll('path')
    gsap
      .timeline({ repeat: -1 })
      .fromTo(pulsePaths, { drawSVG: '0 0' }, { drawSVG: '0 100%', ease: 'linear', duration: 0.5 })
      .to(pulsePaths, { drawSVG: '100% 100%', ease: 'linear', duration: 0.5 }, 3.5)

    return () => cleanups.forEach((fn) => fn())
  })
}
