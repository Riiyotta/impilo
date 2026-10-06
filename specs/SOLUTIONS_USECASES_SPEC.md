Source: https://impilo.health/

# Impilo: Solutions and Use-Case templates, Clone Spec

Measured live with Playwright (Chromium, `?noSmooth`, so native scroll with pinType `fixed`) on 2026-10-06 at 1440x900, 768x1024 and 390x844. These measurements were cross-checked against the original TSX source, which ships in public source maps (`/component---src-pages-*.js.map`). Values marked "src" come from that source. Every other value was measured.

**Read `CLONE_SPEC.md` section 0 first.** The following are reused unchanged and are NOT re-specced here:
- fluid `--u` model
- Gilroy
- type tokens (h1…kickerS)
- color tokens
- Primary button, Link, Pill
- TextAnimation (multiLine SplitText / fade, `top 75%`, once)
- AnimatedPaths
- header (DesktopTablet + Mobile, same blue05 theme)
- dropdowns, mobile menu
- preloader, page transition
- fixed-reveal footer with the 727px spacer
- the `main::before` blue05 backdrop

**There are no header or footer variants on any of these 13 routes.** Header, footer and spacer are identical to the homepage.

Shorthand in this doc: `N` = N design px. Multiply by `--u`, which at 1440 is 1px, at 390 is 1.04px and at 768 is 0.75px. All measured numbers at 1440 equal design px. Font tokens refer to CLONE_SPEC 0.3, e.g. `h2` = 92/600/92%/-3.68. `bodyM` and `h5` are the same token (14/600/144%/-0.56).

**Border rendering:** a 1px design border renders as 0.5px on DPR-2 screens because the fluid unit gives 0.99px. Build it as `calc(1*var(--u))` or plain 1px.

---

## 0. Template map

Two templates were found by comparing styled-component names in the DOM and source.

| Template | Routes | Section components |
|---|---|---|
| **A. SolutionsOverview** (bespoke, heavily animated) | `/solutions/` | `sc-01-Hero`, `sc-02-Explore` (+`Illustrations`), `sc-03-Support`, `sc-04-Platform` (+`Laptop`), `sc-05-ApiPlatform` |
| **B. ContentPage** (simple, flat stacked sections) | `/solutions/impilo-platform/`, `/solutions/digital-health-logistics/`, `/solutions/tech-enabled-services/`, `/solutions/direct-to-patient/`, `/solutions/clinic-rpm/`, `/solutions/support-crm/`, `/use-cases/virtual-care-companies/`, `/use-cases/physicians-and-provider-groups/`, `/use-cases/health-plans-and-payers/`, `/use-cases/health-systems-and-msos/`, `/use-cases/value-based-care/`, `/use-cases/oems/` | `<page>__Hero/HeroContent/Title/Subtitle/Stats/Stat`, `<page>__Section` (light or `dark`), `<page>__SectionTitle`, grid blocks, `<page>__CTAWrapper` or `CallToAction`. Use-case pages add the shared `CapabilitiesCarousel` and `Buttons/Arrow`. |

Notes on template B:
- Each B page re-declares its own styled components (`impilo-platform__Card`, `digital-health-logistics__Service` …), but the CSS is copy-pasted and almost identical.
- All 6 use-case pages share byte-identical styles. OEMs only lacks the WhyChoose grid.
- Build one `ContentPage` kit (section 2) and drive each route from data.
- **Representatives measured in full:**
  - `/solutions/` for A
  - `/use-cases/virtual-care-companies/` for B, use-case flavour
  - `/solutions/impilo-platform/` for B, solution flavour

### New shared components needed
1. `ContentHero`, `ContentSection` (light or dark), `SectionTitle`, `SectionSubtitle`, `CtaRow`, `CallToAction` (text + button)
2. Grid blocks:
   - `BorderedCardGrid` (left-aligned)
   - `IconCardGrid` (centered, with 48px icon)
   - `TextItemGrid` (title + description, no card)
   - `TwoColumnGrid` (column headline + items)
   - `OutcomesList` (bullets)
   - `StatsRow`
3. `CapabilitiesCarousel` and `ArrowButton` (round white chevron button)
4. `AutoAnimate`, a two-slot content swapper. Used by the carousel and the Laptop panel; see 1.5.
5. `createSmoothPin` + `createSlideUp` "stacked sections" scroll behaviour, used on `/solutions/` only (1.0)
6. Template A only:
   - `WidePulse` (AnimatedPaths over a full-bleed path)
   - `Illustrations` 2x2 boxes
   - stacked pinned `SupportCards`
   - `Laptop` 3D carousel
   - `WeightCounter`

---

## 1. Template A: `/solutions/` (SolutionsOverview)

Title "Impilo | Solutions". Document height: 13,269 at 1440x900, 14,093 at 390, 10,341 at 768.

Page order inside `main`:
1. Hero (`section`)
2. Explore
3. Support
4. Platform
5. ApiPlatform

There is no CTA section; ApiPlatform is followed directly by the footer spacer.

### 1.0 Stacked-section scroll mechanic (Hero, Explore, and Support on mobile)
This mechanic is new to these templates. From `library/smoothPin.tsx` and `utils/createSlideUp.ts`:
- **Pin:** `ScrollTrigger.create({ trigger: section, pin: true, start: "bottom bottom", end: "bottom top", pinSpacing: false })`. When the section's bottom reaches the viewport bottom, it freezes. The next section, which is `position: relative; z-index: 1` with rounded top corners, then scrolls up over it.
- **Slide-up:** `gsap.to(section.children, { y: () => -0.4*innerHeight, ease: "linear", scrollTrigger: { trigger: section, start: "bottom bottom", end: "bottom top", scrub: true } })`. While it is being covered, the content drifts up 40vh.
- With ScrollSmoother (pinType `transform`), the ease is CustomEase `"M0,0 C0.186,0 0.162,0.02 0.306,0.163 0.574,0.429 0.95,0.91 1,1"`. A "goop" tween also runs: the parent goes y 0→+50→0 over ±200px around the pin start (`smoothLevel` 200, `/4`).
- **Build:** use native scroll with the `linear` ease and no goop. This matches what was measured with `?noSmooth`.
- Measured at 1440:
  - Hero pin 780→1680
  - Explore pin 4062→4962

### 1.1 Hero (`sc-01-Hero__Wrapper`, `<section>`)
**Layout**
- Wrapper: `min-height: 100vh; display: grid; place-items: center; padding-bottom: 200` (mobile 100). The background is transparent, so the blue05 page backdrop shows. Box at 1440: y 113, h 1567.
- Inner:
  - `max-width: 1440; width: 100%; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 50 50 0`
  - tablet: `max-width: 1024`
  - mobile: `max-width: 500; padding: 0 23`
- **Title** `h1`:
  - token h1, color silver05 (#fff)
  - `width: 1094; padding: 8; margin-bottom: 42`
  - Measured 1094x358, 3 lines, 7 words.
  - Tablet: h2, width 924 (69px font at 768).
  - Mobile: h3 (47.84px), width 329, `margin-bottom: -35`; measured 342x149, 3 lines.
  - Topic: heading about delivering care anywhere.
  - This title is **not** wrapped in TextAnimation; it is visible immediately.

**IllustrationsWrapper**
- `position: relative; width: 106%; height: 255`
- tablet: width 165%
- mobile: `scale: .55; width: 445%`
- Absolutely positioned isometric line-art SVGs, in `top/left` design px within the wrapper:

| SVG (asset) | width | top | left | rotate | notes |
|---|---|---|---|---|---|
| pill (solutions-hero-pill.svg) "Pill2" | 38 | 153 | 106 | -34deg | class `pill` |
| pill "Pill1" | 38 | 201 | 94 | 78deg | pill |
| tablet (solutions-hero-tablet.svg) "Tablet1" | 62 | 157 | 231 | -156deg | pill |
| glucose (solutions-hero-glucose.svg) | 360 | 37 | 350 | 0 | |
| tablet "Tablet3" | 62 | 180 | 693 | 18deg + `transform: scaleY(-1)` | pill |
| tablet "Tablet2" | 62 | 140 | 710 | -24deg + scaleY(-1) | pill |
| watch (solutions-hero-watch.svg) | 239 | 0 | 758 | 0 | |
| pill "Pill3" | 38 | 119 | 1036 | 34deg | pill |
| pill "Pill4" | 38 | 167 | 1048 | -78deg | pill |
| pill-container (solutions-hero-pill-container.svg) | 144 | 64 | 1173 | 24deg | |

- Each SVG has class `illustration`. The pills and tablets also have class `pill`.
- Stroke colours are baked into the SVGs: cyan-green line art on transparent.

**WidgetsWrapper** (the dashboard cards)
- `display: grid; position: relative; z-index: 3; gap: 20`
- Desktop: `grid-template-rows: 198px 240px; grid-template-columns: 285px 405px 610px`. Measured 1340x458 at x 50, y 818.
  - kits-overview (solutions-hero-kits-overview.svg): rows 1/span 2, col 1
  - patient-info: row 1, col 2
  - billing-report: row 2, col 2
  - readings-overview (610x458): rows 1/span 2, col 3
- Tablet:
  - rows `198 240 458`, cols `285 405`
  - readings-overview is replaced by `solutions-hero-readings-overview-tablet.svg` (viewBox 710x458) at row 3, cols 1/span 2
  - measured 532x702 at 768
- Mobile: `display: none`.
- SVGs: `width/height: 100%`. The cards are part of the SVG art: lavender04/blue panels with rounded corners. Use the files.
- **WeightCounter** (`Weight__Wrapper`, HTML, overlaid on the readings card):
  - `position: absolute; top: 111.5; left: 761` (tablet `left: 27; top: 589`)
  - `height: 54; display: flex; align-items: start; overflow: clip`
  - bodyL with `font-size: 62; letter-spacing: 1.3`, color `color(display-p3 .7505 .747 .9258)` ≈ #BFBEEC
  - starts at opacity 0
  - Three digit columns, each a stack of 54-high divs:
    - `.hundreds` [2,1]
    - `.tens` [0,9,8], with `margin: 0 -2`
    - `.ones` 24 divs reading 9,8,…,0,9,8,…
  - Final reading is "187". Measured 110.8x54 at (811, 930).

**ContentWrapper**
- `display: flex; flex-direction: column; align-items: center; margin-top: 53; gap: 20`
- tablet `margin-top: 62`; mobile `margin-top: -15; gap: 28`
- Paragraph `p`:
  - bodyR, white, `width: 710; padding: 8` (mobile width 329, padding 0)
  - TextAnimation fade
  - 20 words; 2 lines at 1440, 4 lines at 390
  - Topic: paragraph about handling behind-the-scenes care work.
- Primary button **"See how"** → `/request-demo/` (139x63).

**Motion**
- **Intro timeline:** paused, and played on the preloader's `anyEnd` event, i.e. right after the preloader exit. Offsets are in seconds from the timeline start.
  - `.illustration`: fromTo `{opacity: 0, y: 100}` → `{opacity: 1, y: 0}`, 1.5s power2.out, stagger `{from: "random", each: .025}`, at 0
  - `.widget` (the 4 cards): same from/to, 1.5s power3.out, stagger `{from: "start", each: .35}`, at 0.75
  - `.weight`: same from/to, 1.5s power3.out, delay 1.05, at the same position as the widgets
  - `#graph-line` (path inside readings-overview): `from {drawSVG: 0}` over 1.5s. The line draws in. Implement with `stroke-dasharray` / `stroke-dashoffset` if DrawSVG is unavailable.
  - Counter rolls:
    - `.hundreds` yPercent → -100 (1.25s power2.inOut) at 2.3
    - `.tens` → -100 at 2.3, then → -200 at 3.5 (1.25s each, power2.inOut)
    - `.ones` → -2200 over 5s power2.inOut at 0.5
    - `.ones` x → -10 (1.5s) at 4.15
    - `.tens` x → -5 (1.5s) at 3
    - Net effect: the number rolls from 209 to 187.
- **Idle bob** (starts after the illustration tween completes):
  - The illustrations are shuffled randomly.
  - Each gets `gsap.to(el, { yPercent: el has class pill ? -10 : -5, duration: 5, ease: "power2.inOut", repeat: -1, yoyo: true, delay: index*0.5 })`.
  - Controlled by ScrollTrigger on IllustrationsWrapper with `start: "top bottom", end: "bottom top", toggleActions: "play pause resume pause"`. Measured: 10 tweens with delays 0…4.5.
- **Stacked-section pin + slide-up** as in 1.0. The trigger is the Hero wrapper; the slide-up target is `Inner`.

### 1.2 Explore (`sc-02-Explore__Wrapper`)
**Box and children**
- Box at 1440: y 1680, h 3282.
- `background: blue01 (#161658); color: #fff; text-align: center; min-height: 100vh; display: grid; place-items: center`
- `border-radius: 24 24 0 0; padding-top: 180; padding-bottom: 204; margin-bottom: -24`
- mobile: `padding-top: 100`; measured padding-bottom 212
- `z-index` is auto; it sits over the pinned Hero by DOM order.
- Children, in order:
  1. **Pill, white variant** (`Pill white`): white background, logo paths fill blue01, 64x28. Same loop animation as the homepage Pill.
  2. **Title** (div):
     - h2 white, `margin-top: 16`; mobile h3
     - 3 words, 1 line (797 wide). Label: "Explore our solutions", a short UI heading; keep or paraphrase.
     - multiLine TextAnimation
  3. **Description:**
     - bodyR, `width: 424; margin-top: 32` (mobile 329)
     - 21 words, 4 lines (5 at 390)
     - Topic: three integrated solution layers. TextAnimation fade.
  4. **WidePulse** svg:
     - `width: 100vw; margin-top: 67` (mobile 60)
     - Two paths with the same `d`:
       - base: stroke blue02, width 10, miterlimit 16
       - `.animate`: stroke brightBlue, width 10, linecap round, driven by AnimatedPaths with `lineLength: 150` design px and `lineSpeed` 2000 (desktop) / 1800 (tablet) / 1500 (mobile)
       - The `.animate` path shows a bright-blue 150px dash travelling along the ECG pulse line.
       - AnimatedPaths ScrollTrigger: `top 90%`, `play pause resume pause`.
     - Desktop:
       - viewBox `${-o/2} 0 ${1440+o} 472`, where `o = documentWidth - 1440`
       - d = `M${-o/2} 460H341L376 397L411 334L446 397L481 460H611L720 20L846 460H982L1016.5 393.5L1053 460L1123 295L1189 460H${1440+o/2}`
       - At exactly 1440: `M0 460H341L376 397L411 334L446 397L481 460H611L720 20L846 460H982L1016.5 393.5L1053 460L1123 295L1189 460H1440`
     - Tablet:
       - viewBox `0 0 1024 346`
       - d `M0 334H242.489L267.378 289.041L292.267 244.082L317.156 289.041L342.044 334H434.489L512 20L601.6 334H698.311L722.844 286.543L748.8 334L798.578 216.25L845.511 334H1040`
     - Mobile:
       - viewBox `0 0 375 147`
       - d `M0 135H88.8021L97.9167 118.534L107.031 102.068L116.146 118.534L125.26 135H159.115L187.5 20L220.312 135H255.729L264.714 117.619L274.219 135L292.448 91.875L309.635 135H390`
  5. **SubTitle:**
     - h3 white, `margin-top: 105; width: 520`
     - tablet margin-top 215; mobile margin-top 120, width 344
     - 2 words: "Tech-Enabled Services" (UI label). multiLine TextAnimation.
  6. **SubDescription:**
     - bodyR, `margin-top: 32; width: 520` (mobile 345)
     - 21 words, 3 lines
     - Topic: expert operations and healthcare 3PL.
  7. **Illustrations** grid, see below.
  8. **Primary "Discover Our Full Services Layer"** → `/solutions/tech-enabled-services/`, `margin-top: 50` (mobile 40).
  9. **Logos** row:
     - `display: flex; gap: 86; margin-top: 150`, each svg 100x100
     - tablet margin-top 50
     - mobile `gap: 16; flex-wrap: wrap; justify-content: center; margin-top: 44`
     - Order: ISO, HIPAA, HQAA, SOC, FDA (`solutions-explore-logo-*.svg`). Measured 844x100.
  10. **Pride** note:
      - bodyM, color blue07 (#B1C3FC), `margin-top: 24; width: 385` (mobile 264, margin 18)
      - 18 words in 2 lines, with a `<br>` after line 1
      - Topic: regulatory compliance statement.
- Touch devices only: every direct child gets `will-change: transform; transition: transform .5s cubic-bezier(.23,1,.32,1)`.

**Illustrations** (`Illustrations__Wrapper`)
- Desktop: `display: grid; grid-template-columns: repeat(2,1fr); gap: 80 100; margin-top: 65`. Measured 1340x1320.
- Tablet: 1 column, gap 60.
- Mobile: 1 column, gap 20, margin-top 58.
- `svg { overflow: visible }`.
- **Box:**
  - `width: 620; min-height: 620; border: 1px solid brightBlue (#3FAEFF); border-radius: 24`
  - `display: flex; flex-direction: column; align-items: center` (top-aligned)
  - Tablet: `display: grid; grid-template-columns: auto 1fr; min-height: 400; width: 924; padding: 0 110; gap: 24 75; place-content: center; place-items: center`. The first child (the art) spans `grid-row: 1/3` with `margin: -50 0`.
  - Mobile: `width: 345; min-height: unset; padding-bottom: 48`.
- Box contents:
  - Art (fixed height, auto width):

    | Box | SVG | height | margin-top | margin-bottom | mobile margins |
    |---|---|---|---|---|---|
    | 1 | white-label | 234 | 68 | 53 | 45 / 41 |
    | 2 | ordering | 163 | 106 | 86 | 78 / 79 |
    | 3 | box | 223 | 87 | 45 | 38 / 39 |
    | 4 | cart | 232 | 73 | 50 | 44 / 44 |

  - Title: bodyXL (42/500/130%/-1.68), white, two lines with a `<br>`; ≤4 words each.
    - Labels: "Digital Health / Logistics", "Digital Health / Concierge", "Medical Supply / Procurement", "Regulatory-Grade / Fulfillment & Compliance".
    - Mobile: `padding: 0 10`, `br` hidden.
  - Description:
    - bodyM, blue07, `width: 360; margin-top: 24`; box 2 uses width 340
    - tablet `margin: 0`; mobile `width: 339; padding: 0 27`
    - 25–28 words, 4 lines
    - Topics: medical-grade logistics; concierge support; supply sourcing; compliant fulfillment.

**Motion (Explore)**
- Text reveals: TextAnimation on the title, description, subtitle and subdescription.
- WidePulse travelling dash (AnimatedPaths).
- **Mouse parallax on art layers.** The SVGs contain `g.layer-1/2/3`.
  - `mousemove` on window: `.layer-2` gets `x = (cx/innerWidth - .5)*4`, `y = (cy/innerHeight - .5)*4`. That is ±2px.
  - `.layer-3`: the same with factor 12, i.e. ±6px.
  - Both use `ease: power3.out, duration: 1`.
  - No-hover devices: a fake pointer at x = center tweens y from `-innerHeight` to `3*innerHeight`, 8s, power3.inOut, yoyo, repeat -1. It drives the same function with duration 0.
- **Cart hover bounce** (box 4):
  - onMouseEnter plays the timeline, or restarts it if it has finished.
  - `.cart` y → -20 (0.2s power1.out), then back to 0 (0.2s power1.in) at 0.2.
  - `.box` y → -20 (0.2s power1.out) at 0.
  - `.box-1`, `.box-2`, `.box-3` y → 0, `bounce.out` 0.8s, at 0.2 / 0.25 / 0.3.
  - Touch devices: triggered once by ScrollTrigger `start: "center center"`, `toggleActions: "restart none none none"`.
  - The hook classes `.cart`, `.box`, `.box-1/2/3` are inside `solutions-explore-cart.svg`.
- **Stacked pin + slide-up (1.0).** Trigger is the Explore wrapper; the slide-up targets all of its children.

### 1.3 Support (`sc-03-Support__Wrapper`): pinned stacking cards
**Box and header**
- Box at 1440: y 4938, h 4529.
- Wrapper:
  - `background: #fff; border-radius: 24; padding-top: 232; padding-bottom: calc(100lvh + 250); margin-bottom: -100lvh`
  - `text-align: center; display: grid; place-items: center; position: relative; z-index: 1`
  - `::before { content: ""; position: absolute; top: 100%; left: 0; width: 100%; height: 24; background: #fff }` fills the gap under the radius.
  - Tablet: `padding-top: 151`.
  - Mobile: `padding: 100 0 180; margin-bottom: 0; border-radius: 24 24 0 0`.
- Pill (blue01 default variant).
- Title:
  - h2 blue01, `margin-top: 16; max-width: 1111` (tablet 924)
  - mobile h3, max-width 345, 2 lines
  - "Direct-to-Patient Solutions" (2 words, 1 line). Not text-animated.
- Description:
  - bodyR blue01, `margin-top: 32; max-width: 576` (mobile 345)
  - 20 words, 2 lines (4 at 390)
  - Topic: physical and digital at-home care.

**Cards**
- Desktop/tablet: block, centered.
- Mobile:
  - `width: 100vw; padding: 0 100vw; margin: 0 -100vw; display: flex; overflow: scroll; scroll-snap-type: x mandatory; gap: 10; scrollbar hidden`
  - **On hover-capable mobile** (stacked variant): `flex-direction: column; align-items: center`, and children get `margin-left/right: 0 !important`.
  - **On touch mobile** (scroll variant): a horizontal snap carousel.
- **Card ×4:**
  - `width: 860; min-height: 548; margin-top: 150; padding: 66 0 100`
  - `background: silver04 (#F4F4FB); border: 1px solid lavender04 (#B1A6F6); border-radius: 24`
  - `display: flex; column; center/center; position: relative; z-index: 1; scroll-snap-stop: always`
  - Mobile: `width: 310; padding: 42 22.5 66; margin-top: 42; flex-shrink: 0; scroll-snap-align: center`
- CardImage:
  - an 80x80 box holding an `<img>` of a circle icon
  - Implementation: `img { width: 320; margin: -120; scale: .25; max-width: unset }`, which renders a 320px image at quarter scale so it stays crisp
  - Assets: `solutions-support-heart.svg`, `-lightbulb.svg`, `-chat.svg`, `-document.svg` (80x80 viewBox; coloured ring, white disc with inner shadow, 1.5px stroke glyph)
- CardTitle:
  - h3 blue01, `margin-top: 35; max-width: 400` (mobile margin 26)
  - 3–4 words, 2 lines
  - Labels: "RPM Hardware & Setup", "Patient Support & Engagement", "At-Home Lab Collection Kits", "DME & Medical Devices"
- CardDescription:
  - bodyR blue01, `margin-top: 52; max-width: 461`
  - 30–35 words, 5 lines (8 at 390)
  - Topics: patient-ready kits; patient support; at-home lab kits; DME management.
- CTA:
  - Primary **"Discover Our Patient-Ready Solutions"** → `/solutions/direct-to-patient/`
  - `margin-top: 80` (mobile 50)
- **Thermo** decoration (`solutions-support-thermo.svg`, a 388x817 line-art thermometer in lavender):
  - `position: absolute; top: 1745; right: calc(50vw + 245); width: 388; z-index: -1`
  - `transition: transform .5s cubic-bezier(.23,1,.32,1)`; hidden on mobile
  - Uses ScrollSmoother `data-speed="0.5"`, so it scrolls at half speed.
  - In native mode the site's fallback applies a scrubbed translateY between scroll 4066 and 7500. It measured -858.5px at page top.
  - **Build:** parallax y = 0.5 × scroll delta across the section.

**Motion: desktop and tablet ("pin" variant)**
- n = 4. For each card i (1-based):
  - `ScrollTrigger.create({ trigger: card, pin: true, start: "center center", endTrigger: lastCard, end: () => "center center-=" + innerHeight, pinSpacing: false })`
  - For i < n: `gsap.to(card, { scale: 1 - 0.1*(n-i), yPercent: -11*(n-i), ease: "power1.inOut", scrollTrigger: { trigger: card, start: "center center", endTrigger: lastCard, end: "center center", scrub: true } })`
  - Measured targets: card 1 scale .7 / yPercent -33; card 2 .8 / -22; card 3 .9 / -11.
  - pinType fixed: every card also gets `y: -0.4*innerHeight` (linear, scrub) from lastCard `center center` to `center -50%`. Together these push the whole stack up and away.
- Result: each card pins at the viewport centre, the next one slides over it, and the earlier cards shrink and step upward. This produces a fanned stack; see `recon/screens/pages/solutions-1440-y7400.png`.
- Measured pin ranges at 1440x900: 5357→8351, 6055→8351, 6752→8350, 7450→8350.

**Motion: mobile**
- "stacked" (hover-capable): no card pins. The whole section uses the 1.0 pin + slide-up.
- "scroll" (touch):
  - The 1.0 behaviour applies.
  - Each card has horizontal ScrollTriggers with `scroller: Cards` and `horizontal: true`:
    - `start: "left right", end: "center center"`: scale .9→1 and x -10→0
    - `start: "center center", end: "right left"`: scale 1→.9 and x 0→10
    - Both use power3.inOut with scrub.
  - Nudge hint at `top center`: the Cards container does xPercent -3 / scale .98 (0.2s power3.out), then back with `bounce.out` 0.5s. It repeats every 3s until the user scrolls the first card past the left edge.

### 1.4 Platform (`sc-04-Platform__Wrapper`)
**Box and header**
- Box at 1440: y 8567, h 2522.
- `background: blue02 (#232265); color: #fff; text-align: center; display: grid; place-items: center`
- `padding: 232 0 200; border-radius: 24; position: relative; z-index: 1; min-height: 100lvh`
- Tablet: flex column, centered, padding-bottom 148.
- Mobile: flex column, padding `100 0`.
- No pin.
- Logo: `logo-header.svg` (already in `public/assets/svg`; identical file), width 70.
- Title:
  - h2 (mobile h3), `margin-top: 16`
  - "Meet the Platform" (3 words, 1 line)
- Description:
  - bodyR, `width: 436; margin-top: 32; margin-bottom: 50` (mobile width 329)
  - 21 words, 3 lines
  - Topic: unified platform functions.

**Laptop** (desktop/tablet), `Laptop__Wrapper`
- `display: flex; flex-direction: column; align-items: center; perspective: 3000`
- **LaptopTop:**
  - `display: grid; place-items: start center; transform-origin: bottom center; will-change: transform`
  - children stacked in `grid-area: 1/1/2/2`
  - `solutions-laptop-top.svg` at width 875 (878x553 frame)
  - The **screen image** is an AutoAnimate slot whose svg is `margin-top: 27; width: 822; height: 482; border-radius: 7`.
- **LaptopBottom:** `solutions-laptop-bottom.svg`, width 1110, `margin-top: -2`.
- **Panel:**
  - `margin-top: -173; width: 712; min-height: 320; padding: 0 22`
  - `background: blue02; border: 1px solid blue03 (#4846BF); border-radius: 11`
  - `position: relative; z-index: 1; display: flex; column; center/center; gap: 17`
  - The panel overlaps the laptop base.
  - PanelTitle: bodyXL white; 4–6 words, 2 lines.
  - PanelText: bodyM blue07, `width: 398`; 31–33 words, 3 lines.
  - Both are wrapped in `WideAutoAnimate` (AutoAnimate, alignment center, `margin: -50vw; padding: 50vw; pointer-events: none`, children `pointer-events: all`).
- **Arrows:**
  - `margin-top: 18; gap: 18; display: flex`
  - two `<button>`s (no aria-label on the original; add `aria-label` in the clone) containing `solutions-laptop-arrow.svg` at 39x39 (white circle, blue chevron)
  - Previous: `scale: -1`
  - Click → `active = (active ± 1) mod 3`
- 3 items (screen, title, text):
  1. `solutions-laptop-screen-readings.svg`, "Patient Monitoring Operations Platform" (topic: device data in one format)
  2. `solutions-laptop-screen-details.svg`, device management (6 words)
  3. `solutions-laptop-screen-dashboard.svg`, data review and patient management (5 words)
- **Motion:**
  - Laptop lid opens on scroll: `gsap.from(LaptopTop, { rotateX: -80, ease: "linear", scrollTrigger: { trigger: Laptop__Wrapper, start: "top bottom", end: "center center", scrub: 3 } })`. Measured 8201→9105; at rest it is `matrix3d` ≈ rotateX(80deg) before scroll.
  - Slide swap (AutoAnimate, 1s):
    - the old content `opacity → 0` (power3.inOut)
    - the new content `from opacity 0`
    - the container width/height tween to the new size with power3.inOut
    - `yPercent` is disabled via `parameters: {yPercent: undefined, opacity: 0}`, so it is a crossfade with a size morph
  - Measured panel at 1440: x 364, y 9633, 712x320; arrows at y 9971.

**Laptop on mobile**
- The laptop is not rendered. `Panels` becomes a flex column of 3 static panels.
- Each panel:
  - `PanelImage svg 345x202, radius 10`
  - title h4 (24.96px), `margin: 6 0 17; width: 345`
  - text bodyM, width 340
  - panel `margin-bottom: 90` (last 0), no border
- Measured panel box is 740 wide (712 design × 1.04, overflowing; it is clipped by `main`). Use `width: 100%` in the clone.

**Snippets and closing CTA**
- Snippets:
  - `display: grid; grid-template-columns: repeat(2,1fr); gap: 60 140; margin-top: 115`; measured 720x257
  - mobile: flex column, gap 28, margin-top 60
- Snippet ×4:
  - `width: 290; display: grid; place-items: center; gap: 12`
  - SnippetTitle: bodyR, brightTurquoise (#72E6FF), 2–4 words. Labels: "Biometric and Engagement Alerting", "EHR integration", "Unified Device Data", "API + SDK Integration".
  - SnippetText: bodyM white; 14–24 words, 3 lines.
  - Snippet 2 text is wrapped in `SmallText` (width 250).
  - Snippet 4 contains an inline link `<a>` "our API & SDK" → `https://docs.impiloplatform.com`, styled `text-decoration: underline; color: brightTurquoise`, followed by a `<br>`.
- Call:
  - h2, `max-width: 1165; margin-top: 250; margin-bottom: 26`
  - tablet max-width 1024, margins 187/58
  - mobile h3, width 345, margins 94/26
  - 8 words, 2 lines (4 at 390)
  - Topic: heading about empowering a virtual care program.
- ButtonGroup:
  - `display: flex; gap: 24; align-items: center`
  - mobile column, gap 16
  - Primary **"Explore DIY RPM Solutions"** → `/solutions/clinic-rpm/`
  - Primary **"Request Demo"** → `/request-demo/`

### 1.5 AutoAnimate (shared library component; reused by CapabilitiesCarousel)
- Renders a hidden `sizer` div with the new content.
- The wrapper (`overflow: clip; display: grid; align-items/justify-content: <alignment>`) has two slot divs stacked in `grid-area: 1/1/2/2`, each with `min-width/min-height: 100%`.
- On key change (throttled to `duration*1000 + 100` ms):
  1. Tween the wrapper `width/height` to the sizer's size: power3.inOut over `duration` (default 1). After the tween, set width and height to auto.
  2. Old slot: `to { yPercent: -100, ease: "power3.inOut", duration, ...parameters, ...toParameters }`
  3. New slot: `from { yPercent: 100, ... , ...fromParameters }`
- The first render is skipped.
- On resize, revert the tweens and set the size to auto.

### 1.6 ApiPlatform (`sc-05-ApiPlatform__Wrapper`)
**Box and header**
- Box at 1440: y 11090, h 1452.
- `background: #fff; border-radius: 24; padding: 232 0; text-align: center; display: grid; place-items: center; position: relative; z-index: 1`
- tablet padding `151 0`; mobile `100 0` with radius `24 24 0 0`
- Pill.
- Title:
  - h2 blue01, `margin-top: 16; max-width: 1111`
  - "API-First RPM Platform" (3 words, 1 line); mobile h3, 2 lines
  - multiLine TextAnimation
- Description:
  - bodyR blue01, `margin-top: 32; max-width: 576`
  - 22 words, 3 lines
  - Topic: API integration for developers. TextAnimation fade.

**Features grid**
- `display: grid; grid-template-columns: repeat(2,1fr); gap: 60; margin-top: 80; max-width: 1200`; measured 1200x661 (cells 570 wide)
- tablet: gap 40, max-width 924
- mobile: 1 column, gap 40, margin-top 42, max-width 345
- Feature ×4:
  - `background: silver04; border: 1px solid lavender04; border-radius: 24; padding: 40`
  - `display: flex; column; align-items: center; min-height: 300`
  - mobile: `padding: 30; min-height: auto`
- IconWrapper:
  - `80x80 grid center; margin-bottom: 24; svg 48x48` (mobile 60 / 16 / 36)
  - Icons: `solutions-icon-api.svg`, `-data.svg`, `-integration.svg`, `-security.svg` (48 viewBox, stroke #06F, 2px)
- FeatureTitle:
  - h4 blue01, `margin-bottom: 16` (mobile h5, 12)
  - 2 words: "RESTful API", "Unified Device Data", "Easy Integration", "Enterprise Security"
- FeatureDescription:
  - bodyR blue01 (mobile bodyM)
  - 15–22 words, 2–3 lines
- No hover states.

### 1.7 Tablet (768) notes for template A
Everything follows the fluid model with the tablet overrides listed above. Measured:
- hero title 69px, 693 wide
- widgets 532x702
- Illustrations boxes horizontal, 693x300, with art left and text right
- Logos gap 64.5
- Support padding-top 113 (151 design)
- Platform Call 69px

---

## 2. Template B: ContentPage (solution sub-pages + use-cases)

**Structure**
- Flat, full-bleed stacked sections with no rounded corners, no pins and no stacking.
- The page follows the normal header (blue05) directly.
- After the last section come the standard footer spacer and the fixed footer.
- The only motion is TextAnimation (on hero title/subtitle, all section titles, and some CTA paragraphs), button/link hovers, and the carousel.

**Measured page heights at 1440**

| Route | Height |
|---|---|
| VCC | 5106 |
| PPG | 5066 |
| HPP | 5079 |
| HSM | 4878 |
| VBC | 5325 |
| OEMs | 3912 |
| impilo-platform | 4258 |
| DHL | 3993 |
| TES | 4332 |
| DTP | 4701 |
| clinic-rpm | 4102 |
| support-crm | 4465 |

At 390, VCC is 4928.

### 2.1 Primitives (src + measured on VCC / impilo-platform)
**Hero** (`__Hero`)
- `background: blue01 (#161658); min-height: 80vh; display: grid; place-items: center; padding: 120 0` (mobile `80 0`)
- Measured VCC: 1440x1091 at y 113. At 390: padding 83.2, h 865.

**HeroContent**
- `max-width: 1000` (DHL, clinic-rpm and support-crm use **800**)
- `text-align: center; display: flex; flex-direction: column; align-items: center; gap: 32; padding: 0 32`
- mobile `padding: 0 24; gap: 24`

**Title** (`h1`)
- h1 white; mobile h3 (47.84px)
- multiLine TextAnimation
- Lines at 1440 range 2–6, because the width is limited by HeroContent (936 inner)
- VCC: 9 words, 5 lines, 926 wide. At 390: 333x267, 6 lines.

**Subtitle**
- Two variants:
  - **(a)** h5/bodyM 14/600, white, opacity .9; mobile bodyR. Used by impilo-platform, TES, DTP and all use-cases.
  - **(b)** h4 24/500, white, opacity .9; mobile h5. Used by DHL, clinic-rpm and support-crm.
- TextAnimation fade.

**Description** (support-crm only): h5, white, opacity .8; mobile bodyR.

**Hero CTA:** Primary button.

**Stats** (optional)
- `display: flex; gap: 48; flex-wrap: wrap; justify-content: center; margin-top: 16` (plus the 32 flex gap)
- mobile: column, gap 24
- Stat: bodyM, white, opacity .8. Three short labels, recorded per route below.

**Section** (`__Section`)
- `padding: 120 0; text-align: center`
- background silver05 (#fff), or with `dark`: blue01 (#161658)
- mobile: `padding: 80 0`

**SectionTitle**
- h2; colour blue01, or white on dark sections (see the bug note)
- `margin-bottom: 64; padding: 0 32`
- mobile h3, `margin-bottom: 40; padding: 0 24`
- Some pages omit the horizontal padding: DHL, clinic-rpm and support-crm.
- multiLine TextAnimation. Full width (1440); text centered.

**SectionSubtitle** (impilo-platform dark section only)
- h4 white, opacity .8, `margin-bottom: 64; padding: 0 32`
- mobile h5, `margin-bottom: 40`
- In that section the title's margin-bottom is 24 (mobile 16).

**Grids** (shared base)
- `display: grid; gap: 40; max-width: 1200; margin: 0 auto; padding: 0 32`
- mobile `grid-template-columns: 1fr; padding: 0 24; gap: 32`
- Variants:

| Variant | Columns desktop / tablet | Item style |
|---|---|---|
| **BorderedCardGrid** (`CardGrid`, left) | 3 (impilo-platform), or `repeat(columns)` = 4 / 3 with gap **32** (DTP), mobile gap 24 / tablet 2 | `background: silver04; border: 1px solid lavender04; border-radius: 24; padding: 40` (DTP: 32, mobile 24; platform mobile `32 24`); `text-align: left`. Title h4 blue01 mb16 (mobile h5 mb12); desc bodyR blue01 (mobile bodyM). **Dark variant** (DTP dark section): background blue02, title and desc white, desc opacity .9. The intended `border-color: blue03` loses to the media-query border, so the measured border is **lavender04**. Replicate that. |
| **IconCardGrid** (`Services`, `Benefits`, `Features` with icon) | 3 / 2 (TES, clinic-rpm, support-crm) or 2 (DHL) | same card, `padding: 40`, flex column, centered, `text-align: center`; IconWrapper 80x80 with svg 48 and mb 24 (mobile 60 / 36 / 16); title h4 mb16; desc bodyR |
| **TextItemGrid** (`Capabilities`, `SupportGrid`, `ProcurementGrid`, `Features`, `CommunicationFeatures`, `Benefits`, `IntelligenceGrid`, `DMEGrid`, `WhyChooseGrid`) | 2 or 3 (3-col collapses to 2 on tablet); IntelligenceGrid has max-width 1000 | no card. `text-align: left`. On dark: white text, desc opacity .9. On light: blue01, desc opacity .8. Title h4 mb16 (mobile h5 mb12). Desc bodyR (mobile bodyM). |
| **TwoColumnGrid** (impilo-platform dark) | 2, gap **60** (mobile gap 48) | Column, left-aligned, white. ColumnHeadline h3, mb 32 (mobile h4 mb 24). ColumnItem mb 32 (last 0; mobile 24). ItemTitle h5 mb 12 (mobile bodyL mb 8). ItemDescription bodyR opacity .9 (mobile bodyM). |
| **OutcomesList** (`ul`) | max-width 800, `margin: 0 auto; padding: 0 32; list-style: none; text-align: left` (mobile padding 0 24) | `li` bodyR blue01 (mobile bodyM), `position: relative; padding-left: 24; margin-bottom: 16` (mobile 12); `::before { content: "•"; position: absolute; left: 0; color: blue03 #4846BF }` |

- DTP `DMEGrid`: the 3rd item has `$center` = `grid-column: 1 / -1; max-width: 600; margin: 0 auto; text-align: center`. On mobile it reverts to left-aligned.

**CTAWrapper** (`display: grid; place-items: center; margin-top: 64`, mobile 40) holding a Primary button. In a CTA-only section it follows the title directly.

**CallToAction** (solution pages)
- `max-width: 600; margin: 0 auto; display: flex; column; center; gap: 32; padding: 0 32` (mobile `0 24`, gap 24)
- Text colour: blue01 on light; support-crm sets silver05 on dark
- Optional paragraph: bodyR, TextAnimation fade, 19–23 words, 2–3 lines; topic "invitation to see the logistics/RPM in action"
- Then a Primary button.

**Measured at 1440 (VCC)**
- Section 1: h 838, title 196 (2 lines)
- WhyChoose grid 1200x220, cells 548
- Problem h4 22px high
- Solution 2 lines
- CTA 63 high, 64 below the grid

**Measured at 390**
- SectionTitle 47.84px
- grid single column 340 wide, gap 33.3
- Problem 14.56px
- outcome li 14.56px / 41.9 high (2 lines)

### 2.2 CapabilitiesCarousel (use-case pages, always `dark`)
**Layout**
- Wrapper: `width: 100%; display: grid; place-items: center`.
- Inner:
  - `width: 100%; max-width: 1200; display: grid; place-items: center; position: relative; padding: 0 100` (tablet `0 80`, mobile `0 50`)
  - measured 1200x376 at 1440
  - 390: 390 wide, padding 52
- **AutoAnimate** with alignment center, `padding: 100vw; margin: -100vw; pointer-events: none` (children `all`):
  - `parameters: { yPercent: undefined, opacity: 0 }`
  - `fromParameters: { xPercent: dir==="right" ? 110 : -110 }`
  - `toParameters: { xPercent: dir==="right" ? -110 : 110 }`
  - duration 1, power3.inOut
  - Effect: the old card slides out sideways while fading, the new card slides in from the opposite side, and the height morphs.
- **Card:**
  - `max-width: 800; min-height: 280; padding: 48; border-radius: 24; text-align: center; display: flex; flex-direction: column; justify-content: center`
  - dark: `background: blue02 #232265`; border measured `1px solid lavender04 #B1A6F6` (the blue03 override loses, as in 2.1)
  - mobile: `padding: 32 24; min-height: 240`
  - Measured 800x290–407 at 1440 (VCC card 1: 332); 286x311 at 390.
  - CardSubtitle (optional):
    - bodyM, brightTurquoise #72E6FF on dark (blue03 on light), `margin-bottom: 12` (mobile 8)
    - 3–6 words; short labels, recorded per route below
  - CardTitle:
    - h3 white, `margin-bottom: 24`; mobile h4 (24.96), mb 16
    - 6–17 words, 2–6 lines
  - CardDescription:
    - bodyR white, opacity .9; mobile bodyM
    - 15–32 words, 2 lines
    - The last card ("And Much More") has an empty description and a 17-word title.
- **ArrowButton** (`Arrow__Wrapper`, `<button type=button>`, aria-labels "Previous Capability" / "Next Capability"):
  - `position: absolute; top: 50%; transform: translateY(-50%)`; left: 0 / right: 0 of Inner
  - `35x35; border-radius: 99vw; background: #fff; display: grid; place-items: center; cursor: pointer`
  - `box-shadow: 0 -1px 1px 1px #fbfaff inset, 0 2px 5px 0 rgb(212 209 242 / 68%), 0 0 0 1px rgb(133 143 172 / 25%)`
  - Chevron `usecases-carousel-chevron.svg`, width 7 (7x9, stroke blue01, 2px, round caps). The left button's svg uses `rotate: 180deg`.
  - No hover style.
  - Measured at 1440: x 120 and 1285, y centre of the card.
- **Dots:**
  - `display: flex; gap: 12; margin-top: 32` (mobile 8 / 24)
  - Dot `<button>`: 12x12, `border-radius: 50%; border: none; transition: all .2s ease`
  - background: active white / inactive blue03 (#4846BF) on dark; active blue01 / inactive lavender04 on light
  - `:hover` background silver04 (dark) or blue02 (light)
- Logic:
  - next/prev wrap around and set `direction` right/left
  - clicking a dot sets direction by comparing indices
  - No autoplay. No swipe.

### 2.3 Route recipes (section order and contents)
Notation: `L` = light section, `D` = dark section. "T a/b" = section title with a words and b lines at 1440. Item word counts are title/description.

**Use-case pages (B2).** VCC, PPG, HPP, HSM and VBC share this order:
1. Hero (1000 content, subtitle variant a, "Request a Demo" → /request-demo/, Stats ×3)
2. L: title, then WhyChooseGrid (2 cols, Problem h4 + Solution bodyR opacity .8), then CTA ("See How Impilo Works" on VCC / "See How It Works" elsewhere) → /solutions/
3. D: title, then CapabilitiesCarousel (dark)
4. L: title, then OutcomesList, then CTA "Talk to Our Team" → `mailto:sales@impilo.health`
5. D: title, then CTA "Request a Demo" → /request-demo/

OEMs:
1. Hero
2. L: title, OutcomesList, CTA "See How It Works" → /solutions/
3. D: title, Carousel
4. D: title, CTA "Request a Demo"

OEMs has no WhyChoose and no second outcomes section; the two dark sections are adjacent.

| Route | Hero title | Subtitle | Stats (labels) | WhyChoose items | Carousel cards (subtitle labels) | Outcomes | Section titles (w/l) |
|---|---|---|---|---|---|---|---|
| virtual-care-companies | 9w / 5l, "launch and scale virtual care" | 31w / 2l | 400k+ Patients Connected · Healthcare-Grade 3PL · API-First Platform | 4 (5–6w / 14–16w) | 5: Digital Health Logistics · Device Connectivity & RPM Platform · Patient CRM & Engagement · At-Home Labs & DME Delivery · And Much More | 5 (11–15w) | 7/2, 12/3, 5/1, 10/2 |
| physicians-and-provider-groups | 8w / 5l, "remote care for practices" | 35w / 2l | 400k+ Patients Connected · Healthcare-Grade Logistics & Support · Built for Clinical Workflows | 4 (6–9w / 15–25w) | 5: RPM Hardware & Patient-Ready Setup · Monitoring Tools & Patient Coordination · Diagnostics, Devices & Supplies · Behind-the-Scenes Infrastructure · And Much More | 5 (11–18w) | 4/1, 10/2, 5/1, 8/2 |
| health-plans-and-payers | 5w / 4l, "member monitoring at scale" | 27w / 2l | 400k+ Patients Connected · Standardized, Vendor-Agnostic Data · Nationwide At-Home Capabilities | **5** (7–10w / 15–20w) | 5: Connected Devices & RPM Infrastructure · At-Home Lab Kits & Diagnostic Workflows · Standardized Data Across Vendors · Member Engagement & Outreach Tools · And Much More | **7** (9–12w, 1 line) | 7/2, 8/2, 5/1, 5/2 |
| health-systems-and-msos | 8w / 3l, "distributed care for systems" | 30w / 2l | 400k+ Patients Connected · Healthcare-Grade Logistics · Integrates Into Your Clinical Systems | 4 (6–10w / 17–20w) | 5: Centralized Remote Care Infrastructure · Monitoring & Workflow Automation · Patient-Ready Devices, Labs & Supplies · Data Connectivity & Intelligent Insights · And Much More | 6 (10–15w) | 7/2, 8/2, 5/1, 8/3 |
| value-based-care | 11w / 6l, "value-based care outcomes" | 33w / 2l | 400k+ Patients Connected · Healthcare-Grade Logistics · API-First Platform | 4 (8–12w / 18–20w) | 5: Patient-Ready Devices & RPM Setup · Monitoring & Patient Coordination Tools · At-Home Labs & Diagnostics · Data Connectivity & Intelligent Insights · And Much More | 5 (11–17w) | 5/2, 6/2, 5/1, 10/3 |
| oems | 8w / 3l, "device makers reaching patients" | 26w / 2l | 400k+ Patients Connected · Healthcare-Grade Fulfillment · Hundreds of Devices Integrated | — | 4: Clinical-Grade Logistics & Fulfillment · Device Integration & Connectivity Platform · Distribution, DME, & Procurement Support · And Much More | 5 (11–17w, 2 lines) | 5/1, 6/2, 6/2 |

Carousel card description lengths (src): 15–32 words; the last card is always "And Much More" with a title only.

**Solution sub-pages (B1)**

| Route (title tag) | Hero | Sections in order |
|---|---|---|
| `/solutions/impilo-platform/` ("Impilo \| The Impilo Platform") | content 1000; title 5w / 3l; subtitle (a) 19w; CTA "Request a Demo"; Stats: 400k+ Patients Connected · Compliant & Certified · Available in all 50 States | L: T 6/2, BorderedCardGrid 3 cols, 3 cards (3–5w / 19–23w), card 352x297 → D: T 4/1 (margin-bottom 24), SectionSubtitle 7w, TwoColumnGrid 2 columns, each a headline (6–7w) + 2 items (3–5w / 17–24w) → L: T 6/1, IntelligenceGrid (max-width 1000) 2 items (2–5w / 20–22w) → D: T 7/2, CTAWrapper "Request a Demo" |
| `/solutions/digital-health-logistics/` ("Impilo \| Digital Health 4PL & Logistics") | content 800; title 5w / 3l; subtitle (b) 19w / 2l; CTA "Schedule a Demo"; no stats | L: T 3/1, IconCardGrid **2 cols**, 4 cards (icons: box, truck, explore-box art, ISO logo; 2–3w / 14–19w) → D: T 2/1 **title colour blue01 on blue01 (invisible, original bug)**, TextItemGrid 3 cols, 6 items (2w / 12–19w, white) → L: T 5/2, CallToAction (19w paragraph + "Schedule a Demo") |
| `/solutions/tech-enabled-services/` ("Impilo \| Tech-Enabled Services") | content 1000; title 2w / 2l; subtitle (a) 21w; CTA "See how"; same Stats as platform | L: T 6/2, IconCardGrid 3 cols, 3 cards (icons ISO, warehouse, truck; 4–7w / 15–21w; card 352x423) → D: T 8/2, TextItemGrid 2 cols, 4 items (3–5w / 14–21w) → L: T 7/2, TextItemGrid 3 cols, 3 items (2–5w / 16–17w) → D: T 5/1, CallToAction with button only ("See how") |
| `/solutions/direct-to-patient/` ("Impilo \| Direct-to-Patient Solutions") | content 1000; title 7w / 4l; subtitle (a) 20w / 1l; CTA "Request a Demo"; same Stats | L: T 4/2, BorderedCardGrid **4 cols gap 32, padding 32**, 4 cards (3–4w / 18–25w; card 260x384) → D: T 5/2, BorderedCardGrid dark 3 cols, 3 cards (blue02, 357x255) → L: T 8/2, TextItemGrid 2 cols, 3 items, the 3rd centered full-row → D: T 6/2, CallToAction button only ("See how") |
| `/solutions/clinic-rpm/` ("Impilo \| DIY RPM Solution") | content 800; title 8w / 6l; subtitle (b) 20w; CTA "Schedule a Demo"; no stats | L: T 6/2, IconCardGrid 3 cols, 3 cards (icons api, box, chat; 3w / 20–27w; 352x375) → D: T 4/1 **blue01-on-blue01 bug**, TextItemGrid 2 cols, 4 items (2–3w / 12–20w) → L: T 6/2, CallToAction (23w paragraph + "Schedule a Demo") |
| `/solutions/support-crm/` ("Impilo \| CRM for Healthcare Providers") | content 800; title 5w / 4l; subtitle (b) 10w / 1l + Description (h5, opacity .8) 24w / 2l; CTA "Schedule a Demo"; no stats | L: T 3/1, IconCardGrid 3 cols, 3 cards (icons api, chat, ISO; 3–5w / 26–40w; 352x478) → D: T 2/1, TextItemGrid 3 cols, 3 items (1–2w / 12–14w) → L: T 5/1, TextItemGrid 2 cols, 4 items (5–7w / 12–22w) → D: T 6/2, CallToAction white text (20w paragraph + "Schedule a Demo") |

Icon assets for IconCardGrid:
- `solutions-icon-api.svg`
- `solutions-icon-box.svg`
- `solutions-icon-truck.svg`
- `solutions-icon-warehouse.svg`
- `solutions-support-chat.svg` (80 viewBox, rendered at 48)
- `solutions-explore-logo-iso.svg` (100 viewBox, at 48)
- `solutions-explore-box.svg` (the 258x269 box illustration squeezed into 48x48)

**Notes on these routes**
- **Bug note:** on DHL and clinic-rpm, the dark-section SectionTitle has no `dark` prop, so it renders blue01 on blue01 and is effectively invisible. Matching the original means keeping it. Recommended: render it white and flag it to the user.
- `/solutions/clinic-rpm/` and `/solutions/support-crm/` are not in the header dropdowns. clinic-rpm is linked from `/solutions/` ("Explore DIY RPM Solutions"); support-crm has no inbound link found.

### 2.4 Motion in template B
- **TextAnimation** (CLONE_SPEC 0.5), `top 75%`, once:
  - multiLine: hero titles and all section titles
  - fade: hero subtitle, support-crm description, CallToAction paragraphs
- Grid items, cards, stats and outcomes are **not** animated; they are visible immediately.
- No pins, no parallax, no ScrollSmoother effects. Measured ScrollTriggers on VCC: only TextAnimation ×6, plus the shared AnimatedPaths from the preloader/transition.
- Carousel: AutoAnimate slide/fade, 1s power3.inOut. Dot `transition: all .2s ease`.
- Buttons and links: as CLONE_SPEC 0.5.

### 2.5 Tablet (501–1024)
Pure fluid scaling (1024 base). The only changes:
- 3-column grids (`CardGrid`, `Services`/`Benefits`/`Features` with 3 cols, `Capabilities`, `ProcurementGrid`, `CommunicationFeatures`) become `repeat(2,1fr)`
- carousel Inner padding `0 80`

---

## 3. Assets added (all in `public/assets/svg/`)
All are inline SVGs from the live DOM. GSAP inline styles were stripped, and the animation hook classes (`layer-1/2/3`, `cart`, `box`, `box-1..3`, `#graph-line`) were kept. No new raster images, fonts or videos are used by these templates.

| File | Use |
|---|---|
| solutions-hero-pill.svg (38x83), solutions-hero-tablet.svg (63x69), solutions-hero-glucose.svg (360x252), solutions-hero-watch.svg (241x267), solutions-hero-pill-container.svg (145x230) | Hero floating line art |
| solutions-hero-kits-overview.svg (285x458), solutions-hero-patient-info.svg (405x198), solutions-hero-billing-report.svg (405x240), solutions-hero-readings-overview.svg (610x458, contains `#graph-line`), solutions-hero-readings-overview-tablet.svg (710x458) | Hero widget cards |
| solutions-explore-white-label.svg (284x236), solutions-explore-ordering.svg (273x165), solutions-explore-box.svg (258x269), solutions-explore-cart.svg (221x232) | Explore boxes (layered) |
| solutions-explore-logo-iso / -hipaa / -hqaa / -soc / -fda.svg (100x100) | Compliance logos |
| solutions-support-heart / -lightbulb / -chat / -document.svg (80x80) | Support card icons (originally data-URI `<img>`) |
| solutions-support-thermo.svg (388x817) | Support parallax decoration |
| solutions-laptop-top.svg (878x553), solutions-laptop-bottom.svg (1112x156), solutions-laptop-arrow.svg (39x39) | Laptop frame + nav arrow |
| solutions-laptop-screen-readings.svg, -details.svg, -dashboard.svg (822x482) | Laptop screens |
| solutions-icon-api / -data / -integration / -security / -box / -truck / -warehouse.svg (48x48) | Feature/icon cards |
| usecases-carousel-chevron.svg (7x9) | Carousel arrow button |

Reused from the homepage: `logo-header.svg` (Platform logo, 70 wide) and `pill-logo.svg`.

---

## 4. Links pointing off impilo.health (in page content of these routes)
| Label | href | Where |
|---|---|---|
| "our API & SDK" | https://docs.impiloplatform.com | `/solutions/` Platform snippet 4 |
| "Talk to Our Team" | mailto:sales@impilo.health | the 5 use-case pages with an outcomes section (not OEMs) |

Plus the global header and footer externals already in CLONE_SPEC:
- "Docs" → https://docs.impiloplatform.com
- "Careers" → https://careers.impilo.health
- "Linkedin" → https://www.linkedin.com/company/impilo-inc/
- "Contact Us" → mailto:sales@impilo.health
- tel:+12028385839

## 5. Reference screenshots (`recon/screens/pages/`)
- `solutions-1440-y{0,500,1800,3000,5600,7400,8700,9400,11500}.png`: viewport frames at those scroll positions (pins make a full-page capture misleading).
- `solutions-390-full.jpg`
- `usecase-vcc-1440-full.jpg`, `usecase-vcc-390-full.jpg`. In these captures the section titles and subtitle are blank because TextAnimation had not fired yet.
- `solution-impilo-platform-1440-full.jpg`

## 6. Not measurable / approximations
- Thermo parallax: ScrollSmoother `data-speed=0.5`; the native fallback formula was not read. Use 0.5x scroll parallax.
- Random values: the hero illustration intro stagger (`from: random`) and the bob order (shuffled) differ on every load.
- The ScrollSmoother "goop" (pinType transform) is not present in native mode; it is described in 1.0 for completeness.
- Copy was intentionally not transcribed. Only word and line counts and topics are given; short labels are recorded verbatim.
