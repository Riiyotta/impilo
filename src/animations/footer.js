import { Application, Graphics } from 'pixi.js'
import { gsap, ci, canHover, MQ } from './utils'

/*
 * Footer lines (original `W` in app bundle, CLONE_SPEC 11).
 * PIXI app resized to the Lines__Canvas box (inset -ci(100)), 30 horizontal 1px lines (#6563EA = 6644714)
 * from x = ci(100) to canvas.width - ci(100), spread over the box height minus 2*ci(100).
 * A white pill follows the pointer via quickTo x/y (xPercent/yPercent -50, top/left 0). Lines whose
 * resting y is within ci(63) of the pointer bend around it: target y = clamp(rest -+ ci(40)) and a
 * bezier detour of half-width ci(97) / ci(22.5). Each line's y uses quickTo.
 * Ease: hover devices elastic.out(1.5,0.3) 3s, otherwise power3.out .4s.
 * Pill scale -> 1 (1.6s, same ease) inside the padded area, -> 0 (.3s power2.in) outside.
 * On load/resize the pill is centred and shown. Hidden (not initialised) on mobile.
 */
export function initFooterLines() {
  const holder = document.querySelector('[data-anim="footer-lines-canvas"]')
  const pill = document.querySelector('[data-anim="footer-white-pill"]')
  if (!holder || !pill) return () => {}

  let teardown = null
  let alive = true

  const start = () => {
    if (teardown || !alive) return
    const app = new Application()
    let ready = false
    let disposed = false
    let cleanupInner = () => {}

    app
      .init({
        resizeTo: holder,
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio,
        autoDensity: true,
      })
      .then(() => {
        if (disposed) {
          app.destroy(true)
          return
        }
        ready = true
        holder.appendChild(app.canvas)
        cleanupInner = setup(app)
      })

    teardown = () => {
      disposed = true
      cleanupInner()
      if (ready) {
        app.destroy(true)
      }
      teardown = null
    }
  }

  const setup = (app) => {
    const s2 = ci(100)
    const a2 = ci(97)
    const l2 = ci(63)
    const u2 = ci(22.5)
    const c2 = ci(40)
    const hover = canHover()
    const ease = hover ? 'elastic.out(1.5,0.3)' : 'power3.out'
    const duration = hover ? 3 : 0.4

    // The original positions the pill purely with GSAP from top/left 0.
    gsap.set(pill, { top: 0, left: 0, translate: 'none', xPercent: -50, yPercent: -50 })

    let visible = null
    const setVisible = (v) => {
      if (v === visible) return
      visible = v
      gsap.to(pill, {
        scale: v ? 1 : 0,
        pointerEvents: v ? 'all' : 'none',
        duration: v ? 1.6 : 0.3,
        ease: v ? ease : 'power2.in',
        overwrite: 'auto',
      })
    }
    setVisible(false)

    const lines = Array.from({ length: 30 }, () => new Graphics())
    const ys = Object.fromEntries(lines.map((_, i) => [i, undefined]))
    const lineTo = lines.map((_, i) => gsap.quickTo(ys, String(i), { ease, duration }))
    const g = { x: 0, y: 0 }
    let key = ''
    const v = { ease, duration }
    const px = gsap.quickTo(pill, 'x', { onUpdate: () => gsap.set(pill, { xPercent: -50 }), ...v })
    const py = gsap.quickTo(pill, 'y', { onUpdate: () => gsap.set(pill, { yPercent: -50 }), ...v })
    const gx = gsap.quickTo(g, 'x', { ...v })
    const gy = gsap.quickTo(g, 'y', {
      onUpdate: () => {
        const k =
          Object.entries(ys)
            .filter((e) => !e[0].startsWith('_'))
            .map((e) => e[0] + ':' + e[1])
            .join(',') +
          ',' +
          (g.x + ',' + g.y)
        if (key === k) return
        key = k
        lines.forEach((_, d) => {
          const step = (holder.clientHeight - 2 * s2) / (lines.length - 1)
          const rest = s2 + step * d
          const away = rest < g.y ? rest - c2 : rest + c2
          const clamped = Math.max(g.y - l2, Math.min(g.y + l2, away))
          const near = Math.abs(rest - g.y) < l2
          lineTo[d](near ? clamped : rest)
        })
      },
      ...v,
    })

    const draw = () => {
      lines.forEach((l, d) => {
        const step = (holder.clientHeight - 2 * s2) / (lines.length - 1)
        const h = s2 + step * d
        const m = ys[d]
        l.clear()
        l.moveTo(s2, h)
        if (m && g) {
          l.lineTo(g.x - a2, h)
          const x1 = g.x - u2 - (a2 - u2) / 2
          l.bezierCurveTo(x1, h, x1, m, g.x - u2, m)
          l.lineTo(g.x + u2, m)
          const x2 = g.x + u2 + (a2 - u2) / 2
          l.bezierCurveTo(x2, m, x2, h, g.x + a2, h)
        }
        // Like the original: canvas.width is in device pixels.
        l.lineTo(app.canvas.width - s2, h)
        l.stroke({ color: 6644714, width: 1 })
      })
    }

    const onMove = (e) => {
      const r = holder.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      setVisible(x >= s2 && x <= r.width - s2 && y >= s2 && y <= r.height - s2)
      px(x - s2)
      py(y - s2)
      gx(x)
      gy(y)
    }
    const center = () => {
      const r = holder.getBoundingClientRect()
      const cx = r.width / 2
      const cy = r.height / 2
      px(cx - s2)
      py(cy - s2)
      gx(cx)
      gy(cy)
      setVisible(true)
    }

    app.stage.addChild(...lines)
    app.ticker.add(draw)
    // Only render while the footer canvas is on screen (it sits under the whole page otherwise).
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? app.ticker.start() : app.ticker.stop()))
    io.observe(app.canvas)
    center()
    const onTouch = (e) => {
      e.preventDefault()
      const t = e.touches[0]
      t && onMove({ clientX: t.clientX, clientY: t.clientY })
    }
    const touchHost = pill.parentElement
    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', center)
    touchHost && touchHost.addEventListener('touchmove', onTouch, { passive: false })

    return () => {
      gsap.killTweensOf(pill)
      gsap.killTweensOf(g)
      gsap.killTweensOf(ys)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', center)
      touchHost && touchHost.removeEventListener('touchmove', onTouch)
      io.disconnect()
      app.ticker && app.ticker.remove(draw)
      lines.forEach((l) => {
        app.stage && app.stage.removeChild(l)
        l.destroy()
      })
      gsap.set(pill, { clearProps: 'all' })
    }
  }

  // The lines block is display:none on mobile; only run PIXI where it is visible.
  const mq = window.matchMedia(MQ.mobile)
  const sync = () => (mq.matches ? teardown && teardown() : start())
  sync()
  mq.addEventListener('change', sync)
  // ci() values follow the viewport width (the original re-runs on its Gy() hook changes).
  let lastW = window.innerWidth
  let timer = 0
  const onResize = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (window.innerWidth === lastW) return
      lastW = window.innerWidth
      teardown && teardown()
      sync()
    }, 200)
  }
  window.addEventListener('resize', onResize)

  return () => {
    alive = false
    clearTimeout(timer)
    mq.removeEventListener('change', sync)
    window.removeEventListener('resize', onResize)
    teardown && teardown()
  }
}
