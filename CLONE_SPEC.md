Source: https://impilo.health/

# Impilo homepage – Clone Spec (route `/`)

Measured live with Playwright (Chromium) on 2026-10-06 at 1440x900, 1280x800, 768x1024 and 390x844. The original is Gatsby 5 + React + styled-components + GSAP 3.12.5 (ScrollTrigger, Flip, SplitText, DrawSVGPlugin, ScrollToPlugin, ScrollSmoother) + Radix UI (DropdownMenu, Dialog) + PIXI.js (footer canvas).

Companion files (all under ``):
- `ASSETS.json`: manifest of 51 assets (fonts, webp badges, favicons, og image, 29 inline SVGs, 1 inline PNG).
- `recon/original-styles.annotated.css`: the full live stylesheet (2,450 rules). Every hashed class is annotated with its component name, e.g. `.sc-01-Hero__Title-sc-jqilhl-3/*dlZbWg*/`. **Treat this file as the source of truth for any value not repeated below.**
- `recon/svgs/*.svg`: 29 inline SVGs (GSAP runtime styles stripped; animation hook classes kept).
- `recon/assets/{fonts,images,icons}`: local copies of every first-party binary asset.
- `recon/screens/`
  - `full-1440.png`: 14 stitched 1440x900 viewport frames. A real full-page capture is impossible because of pinning, the fixed footer and ScrollSmoother. Individual frames are in `frames-1440/f1440_<scrollY>.png`.
  - `full-390.png`: full page at 390, captured with `?noSmooth`. The fixed footer does not appear in this capture.
  - `dropdown-open-1440.png`, `mobile-menu-open-390.png`, `tablet-768-top.png`.

---

## 0. Global system (read first)

### 0.1 Fluid scaling model (the most important rule)
All sizes are authored in "design px" and converted per breakpoint by a mixin. Breakpoints, from `breakpoints.ts`:

| Name | Media query | Conversion of a design value `N px` |
|---|---|---|
| fullWidth | `min-width: 1441px` | `N px` (fixed). Containers cap at `max-width: 1440px` and center. |
| desktop | `1025px–1440px` | `N / 1440 * 100vw` (1440 = design width) |
| tablet | `501px–1024px` | `N / 1024 * 100vw`. Many components then add tablet-only overrides, which are again `M/1024*100vw`. |
| mobile | `max-width: 500px` | `N / 375 * 100vw`. Mobile overrides use 375 as the base. |

Consequences:
- At 1440 every value equals the design px. At 1280 every value is ×0.8889. For example, the h2 is 92px at 1440 and 81.78px at 1280; this was measured and matches exactly.
- Recommended Tailwind approach: define `--u` per breakpoint and write `calc(N * var(--u))`:
  - `--u: 1px` at ≥1441
  - `--u: calc(100vw/1440)` at 1025–1440
  - `--u: calc(100vw/1024)` at 501–1024
  - `--u: calc(100vw/375)` at ≤500
  
  You can also use a Tailwind plugin or arbitrary values such as `text-[calc(92*var(--u))]`.
- In JavaScript, the helper `ci(px)` does the same thing: it returns `px` if `innerWidth > 1440`, otherwise `px * innerWidth / designWidth`, where designWidth is 1440, 1024 or 375. `KP(n)` returns `n%` of `100vh`.
- Cascade quirk: when the annotated CSS shows two blocks for the same breakpoint, the later one wins. The first is the auto-scaled desktop value; the second is the explicit override.
- Some mobile and tablet rules contain nested media queries written in `vw`, such as `@media (min-width: 384.267vw)`. These never match except the last one, `max-width: 133.333vw`, which always matches. The effective mobile values are the ones stated in this spec.

### 0.2 Fonts
- Family: **Gilroy** with stack `Gilroy, sans-serif`. It is self-hosted with `font-display: swap`.
- Weights used:
  - 400: `https://impilo.health/static/Gilroy-Regular-2b06ef9a7149fe75bec70640ff338aae.woff2`, with woff fallback `/static/Gilroy-Regular-1af44b448054042ea20a94d2fb819058.woff`
  - 500: `/static/Gilroy-Medium-4abcd1e45598b1247446aa7db1e7f16c.woff2`, with woff fallback `/static/Gilroy-Medium-55796bc0064ff9f7c6f4dd8719e98c14.woff`
  - 600: `/static/Gilroy-SemiBold-3fe1415afa09c564daaf778f8a3e5d30.woff2`, with woff fallback `/static/Gilroy-SemiBold-d9c70b94550e8897c4e1ea2a4133a0dc.woff`
- Global rules: `* { text-rendering: geometricPrecision; -webkit-font-smoothing: antialiased }` and `:focus-visible { outline: 2px solid #00f8 }`.
- `html` uses bodyR (see below) with color blue01 and background **blue05**.

### 0.3 Type tokens (design px; scale with the 0.1 model)
| Token | size | weight | line-height | letter-spacing | extra |
|---|---|---|---|---|---|
| h1 | 124 | 600 | 92% | -4.96px (-0.04em) | |
| h2 | 92 | 600 | 92% | -3.68px | |
| h3 | 46 | 600 | 92% | -1.84px | |
| h4 | 24 | 500 | 92% | -0.96px | |
| bodyXL | 42 | 500 | 130% | -1.68px | |
| bodyL | 17 | 600 | 100% | -0.51px | used by buttons and quote excerpt |
| bodyR | 18 | 500 | 144% | -0.72px | default body |
| bodyM / h5 | 14 | 600 | 144% | -0.56px | nav links |
| bodyS | 14 | 400 | 144% | -0.56px | |
| bodyXS | 12 | 600 | 92% | -0.48px | footer meta |
| kickerR | 15 | 500 | 144% | +0.3px | uppercase |
| kickerS | 13 | 600 | 144% | +0.26px | uppercase |

Mobile titles generally drop one level. For example, h2 titles become h3 at 46/375 = 12.267vw, which is 47.84px measured at 390.

### 0.4 Color tokens
The site uses the display-p3 value when supported and falls back to the hex below. Use the hex values, or add `@supports (color: color(display-p3 0 0 0))` with the p3 values from the CSS file.

| var | hex |
|---|---|
| blue01 | #161658 |
| blue02 | #232265 |
| blue03 | #4846BF |
| blue04 | #524FD9 |
| blue05 | #3F3CCD |
| blue06 | #2F6BEE |
| blue07 | #B1C3FC |
| lavender01 | #5250C5 |
| lavender02 | #6563DA |
| lavender03 | #876EEC |
| lavender04 | #B1A6F6 |
| lavender05 | #E6E4FB |
| lavender06 | #F1F1FD |
| silver01 | #9494A7 |
| silver02 | #D8D8E3 |
| silver03 | #F4F4F6 |
| silver04 | #F4F4FB |
| silver05 | #FFFFFF |
| brightTurquoise | #72E6FF |
| brightBlue | #3FAEFF |
| brightGreen | #5CFFB1 |

Other literal colors:
- Hero interface counter text: `color(display-p3 0.4411 0.6982 1)`, which converts to about #59B4FF in sRGB.
- Step icon border: `rgb(14,14,78)`.
- Footer canvas lines: `#6563EA`.
- `<meta name="theme-color" content="#524FD9">`.

### 0.5 Shared components
**Primary button** (`Primary__Wrapper > Primary__Inner > Primary__ChildrenOverflow > span×2`):
- Wrapper:
  - `width: fit-content; background: lavender01; border-radius: 99vw; padding: 8px`
  - `transition: background-color .5s`
- Inner:
  - `background: #fff; border-radius: 99vw; padding: 15px 30px; white-space: nowrap`
  - Text: bodyL, i.e. 17px / 600 / line-height 100% / -0.51px, color blue02
  - `box-shadow: rgba(0,0,0,.45) 0 1px 4px 0, rgb(178,176,255) 0 -1px 3px 0 inset, rgb(60,57,185) 0 0 0 1px`
  - `transition: background-color .5s`
- ChildrenOverflow: `overflow: clip; display: flex; flex-direction: column; height: 17px; gap: 17px`. It holds the label twice.
- Spans: `transition: transform .25s`.
- **Hover:**
  - wrapper becomes lavender03 (#876EEC)
  - inner becomes lavender05 (#E6E4FB)
  - both spans get `transform: translateY(-200%)`, a rolling text swap of 34px; measured
- Measured size at 1440 for "Request Demo": 184.64×63; inner 168.64×47. "Explore Our Integrations" is 254.41×63.

**Text link** (`Link__Wrapper`): an arrow SVG followed by the text.
- `display: flex; align-items: center; gap: 8px`
- bodyM 14/600/144%/-0.56px, color silver04 (#F4F4FB), `transition: color .5s`
- Arrow: width 13px, `transition: transform .5s`; its path has `transition: stroke .5s`
- **Hover:** color brightGreen; arrow `translateX(4px)`; arrow path stroke and fill brightGreen
- Blue variant (step 02 link): color brightBlue, and the arrow path stroke/fill is brightBlue

**Pill** (`Pill__Wrapper`): blue01 background, `border-radius: 99vw`, 64×28, grid centered, containing a 38px-wide `pill-logo.svg`.
- GSAP loop: `timeline({repeat:-1}).from("path", {clipPath: "inset(0% 100% 0% 0%)"}).to("path", {clipPath: "inset(0% 0% 0% 100%)", delay: 3})`
- Each step uses the default 0.5s duration with ease power1.out.
- The effect: the pulse line wipes in from the left, holds 3s, then wipes out to the right.

**TextAnimation** (`TextAnimation__Wrapper`): wraps headings and paragraphs.
- Base: `opacity: 0; overflow: clip`.
- **multiLine** headings: SplitText splits twice into `.line-inner` lines inside `.line-wrapper`.
  - `.line-wrapper{overflow:clip;margin-bottom:-.1em;padding-bottom:.1em}`
  - `.line-inner{transform:translateY(calc(100% + .1em));padding-bottom:9px}`
  - ScrollTrigger `start: "top 75%"` fires once (onEnter) and plays: `set(wrapper, {opacity: 1})`, then `to(lines, {y: 0, stagger: .25})`. That is 0.5s per line with power1.out.
- **Single block** (paragraphs): the same trigger tweens `opacity 0→1` over 0.5s.
- Used on: Focus title, WhiteGlove title, large text and small text, Trusted title and text, Integrations title and text, CTA title.

### 0.6 Page skeleton and stacking (desktop)
```
#___gatsby
 ├ Transition__Wrapper  (fixed overlay; page transitions only, opacity 0 on load)
 ├ Preloader__Wrapper   (fixed, z 100, blue02)
 ├ Layout__ScrollIndex (z 2; #smooth-wrapper > #smooth-content)
 │   ├ header (DesktopTablet ≥501 / Mobile ≤500)   – NOT sticky, scrolls away
 │   ├ main.Layout__Main (overflow: clip visible; ::before {inset:0 0 24px; background: blue05; z -1})
 │   │   ├ 1 Hero
 │   │   ├ 2 Focus ("Allowing you to focus…" + "Let's show you [Request Demo] how we do it")
 │   │   ├ pages__WorksWrap {overflow:clip; margin-bottom:-100vh; padding-bottom:100vh}
 │   │   │    └ 3 HowItWorks (4 steps)
 │   │   └ pages__White {background: silver03; border-radius:24px; z 2; position:relative; min-height:100vh}
 │   │        ├ 4 WhiteGlove  ├ 5 Trusted  ├ 6 Quotes  ├ 7 Integrations  └ 8 CTA
 │   └ Footer__Spacer (height 727px desktop, max-height 100lvh, transparent)
 └ footer (position: fixed; bottom:0; z 1)  → revealed behind the page as the spacer scrolls in
```
- ScrollSmoother is created with `smooth: 0.01`, which is effectively native scroll. It is disabled on touch devices and when `?noSmooth` is set. You can skip it and use native scroll with ScrollTrigger.
- Document height at 1440x900 is 14,227px; at 1280x800 it is 12,647px. The "How it works" pins depend on `100svh`, so height scales with the viewport.
- The announcement banner (Contentful) currently has no active message, because the last one expired on 2026-01-31. **No banner is rendered.**
- The cookie banner and HubSpot chat did not render during this session; neither `#hs-eu-cookie-confirmation` nor the chat iframe was present. The reCAPTCHA badge is hidden with `.grecaptcha-badge{visibility:hidden}`. Do not build any of these.

### 0.7 Preloader (first load)
- `Preloader__Wrapper`: fixed full-screen, background blue02 (#232265), z-index 100, `pointer-events: none`, grid centered.
- Content:
  - `preloader-graphic.svg`: 344px wide at 1440 (23.889vw). An AnimatedPaths line runs along its `.animate` path with lineSpeed 300 and lineLength 30.
  - A counter `Preloader__Text`: "00"→"99", zero-padded; a value of 100 displays as 99. It tracks loading progress.
    - Style: 94px / 600 / 92% / -3.68px, color brightBlue, `position: fixed`, centered with `translate: -50% -50%`.
    - `transform: rotateX(30deg) rotateY(337deg) rotateZ(41deg) translate(-21px,-32px)`; 146×137px box. This places the number isometrically on the graphic.
  - Under the counter, "LOADING" in kickerS (13/600/144%/+0.26px, uppercase) with `scale: 1.2 1`.
- Exit, about 1s after load completes:
  - wrapper `yPercent: 120, borderRadius: "100px 100px 0 0"`, delay .25, duration 1, ease power3.inOut
  - children `y: ci(400)`, duration 1, power3.inOut
  - children opacity → 0 over .5s, power1.inOut
  - then `autoAlpha: 0` at 1s

---

## 1. Header

### 1.1 Desktop and tablet (≥501px), `header.DesktopTablet__Wrapper`
- Box at 1440: top 0, height 112.99, full width. Background blue05 (#3F3CCD). `display: grid; place-items: center`. **Not sticky and no scroll behaviour**: it scrolls away with the page.
- Inner: `max-width: 1440px; width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 50px 50px 0`.
- **Logo**: `logo-header.svg` (white), link to `/`, width 69.3px (40.59px high) at x 50, y 57.5.
- **Links group**: `display: flex; align-items: center; gap: 40px`. In order:
  1. Button **"Our Solutions"** + chevron (Radix DropdownMenu). Spans x 536 to 636.5 at 1440.
  2. Button **"Who We Serve"** + chevron.
  3. Link "About Us" → `/about/`
  4. Link "Blog" → `/blog/`
  5. Link "SDK" → `/integrations/`
  6. Link "Docs" → `https://docs.impiloplatform.com`
  7. Primary button "Request Demo" → `/request-demo/` (hidden on /request-demo). At 1440: x 1205.4, y 50, 184.6×63.
- Text links use the Link component (arrow first, then label; hover described in 0.5).
- Dropdown triggers:
  - Style: bodyM 14/600/144%/-0.56px, color silver04, no background or border, `display: flex; gap: 8px; padding: 0; transition: color .5s`.
  - Hover: brightGreen.
  - Chevron: `icon-chevron-down.svg`, 13px wide, `transition: transform .2s`, `rotate(180deg)` while open.
  - Measured at 1440: 100.45×20.16, y 71.4.
- **Dropdown panel** (Radix, `modal: false`, `sideOffset: 8`, centered under the trigger; measured open at x 478, y 100, 215.8×267.6):
  - `background: blue02 (#232265); border: 1px solid blue03 (#4846BF); border-radius: 12px; padding: 8px 0; min-width: 200px; box-shadow: 0 4px 12px rgba(0,0,0,.15); z-index: 1000`
  - Open animation: `slide-down .15s ease-out` = `from {opacity: 0; transform: translateY(-8px)} to {opacity: 1; transform: none}`
  - Items are `<button>`s:
    - bodyR 18/500/25.92px/-0.72px, color #fff, `padding: 12px 20px; width: 100%; text-align: left; transition: background .2s`
    - Each item is 49.92px tall. These items are **not** fluid-scaled (fixed 18px).
    - Hover/focus: background blue01 (#161658), text white
  - Clicking an item closes the menu and navigates with the page transition.
  - "Our Solutions" items:
    - Overview → `/solutions`
    - Impilo Platform → `/solutions/impilo-platform`
    - Digital Health Logistics → `/solutions/digital-health-logistics`
    - Tech-Enabled Services → `/solutions/tech-enabled-services`
    - Direct-to-Patient → `/solutions/direct-to-patient`
  - "Who We Serve" items:
    - Virtual Care Companies → `/use-cases/virtual-care-companies`
    - Physicians & Providers → `/use-cases/physicians-and-provider-groups`
    - Health Plans & Payers → `/use-cases/health-plans-and-payers`
    - Health Systems & MSOs → `/use-cases/health-systems-and-msos`
    - Value-Based Care → `/use-cases/value-based-care`
    - OEMs → `/use-cases/oems`
- 1280 measurements: logo 61.6×36.1 at (44.4, 51.4); nav link text 12.44px; CTA 164.1×56 at x 1071.5, y 44.4; inner padding 44.44px.
- 768 measurements:
  - header height 84.7; logo 52px wide at (37.5, 43.2)
  - links: text 10.5px, gap 30px (3.906vw)
  - CTA 138.3×47.2 with label 13.5px
  - all items still on one row

### 1.2 Mobile (≤500px), `header.Mobile__Wrapper`
- `display: flex; justify-content: space-between; align-items: center; background: blue05; position: relative; z-index: 2`
- Padding `0 4vw` (15.6px at 390); height 30.133vw (117.5px at 390).
- Logo `logo-mobile-header.svg`: 18.48vw wide (72.1px).
- **Hamburger** `button[aria-label="Open Navigation"]`:
  - 8.533vw square (33.3px); flex column centered; gap 1.6vw (6.24px)
  - three lines, each `height: .533vw; border-radius: .533vw; background: lavender06 (#F1F1FD)`; widths 8.533vw, 5.333vw and 7.2vw
  - transitions: `rotate .4s cubic-bezier(.645,.045,.355,1)`, plus translate, background, width and height
  - **Open state** (`data-state=open`):
    - button `translate: -5.333vw`
    - every line becomes width 6.667vw (26px) with background lavender01
    - line 1: `rotate: -45deg; translate: 0 2.133vw`
    - line 2: `rotate: 45deg`
    - line 3: `rotate: 45deg; translate: 0 -2.133vw`
- **Mobile menu** is a Radix Dialog. On open, the window scrolls to the header with `scrollTo: header.offsetTop`, 0.5s, power3.out.
  - Overlay: `position: fixed; inset: 0; background: rgb(0 0 0 / 20%); z-index: 10`. It fades in with opacity 0→1 over .4s `cubic-bezier(.645,.045,.355,1)` and fades out the same way.
  - Content panel:
    - `position: fixed; top: 1.333vw; left: 1.333vw; width: 97.333vw; padding: 10.667vw; border-radius: 6.4vw; background: #fff; z-index: 11`
    - `display: flex; flex-direction: column; gap: 10.667vw; max-height: calc(100dvh - 2.667vw); overflow-y: auto`
    - Measured at 390: (5, 5, 380×834); padding and gap 41.6px; radius 24.96px.
    - Open animation: `translateY(-100lvh) → 0`, .4s `cubic-bezier(.215,.61,.355,1)`. Close animation: `0 → translateY(-100lvh)`, .4s `cubic-bezier(.55,.055,.675,.19)`.
  - Contents in order:
    1. Close button: 18×18 svg, `position: fixed; top: 47px; right: 45px; scale: 2` (desktop px).
    2. Dark logo (logo svg with all fills blue02), 133px wide design (138 rendered), link to `/`.
    3. Section "Our Solutions" (flex column, gap 16px):
       - title in h4 (24.96px / 500 / 92% / -0.998px), color blue02
       - sub-links in a column with gap 12px and padding-left 16px, bodyR 18.72px/500, color blue03 (#4846BF), hover blue04, `transition: color .2s`
       - sub-links: Overview, Impilo Platform, Digital Health Logistics, Tech-Enabled Services, Direct-to-Patient (same hrefs as desktop)
    4. Section "Who We Serve", same styling: Virtual Care Companies, Physicians & Providers, Health Plans & Payers, Health Systems & MSOs, Value-Based Care, OEMs.
    5. Link components in h4 (24.96px/500), color blue02, arrow svg 24px design width, hover color and arrow stroke blue03:
       - "About Us" → /about
       - "Blog" → /blog
       - "SDK" → /integrations
       - "Docs" → https://docs.impiloplatform.com
       - "Careers" → https://careers.impilo.health
       - "Contact Us" → mailto:sales@impilo.health
    6. Primary button "Request Demo" (191.9×65.5 at 390).
    7. Sub-links block (grid, gap 4px, bodyR, color blue02): "Privacy Policy" → /privacy and "Terms of Service" → /terms.
  - The menu closes on resize to non-mobile, on scrollTo events and on route change.

---

## 2. Section 1: Hero (`sc-01-Hero__Wrapper`)
**Box at 1440:** top 112.99, height 1100.82; background blue05.
- Layout: `display: grid; max-width: 1440px; margin: 0 auto; padding-top: 57px; gap: 16px`.
- `grid-template-columns: 1fr 912px` (measured 512.16 and 911.99). Areas: `"illustration content" "illustration interface"`. Rows measured 468.19 and 559.65.

**Illustration** (`hero-illustration.svg`, grid-area illustration):
- `height: 641px; width: auto; overflow: visible`; all strokes forced to 1px (`* {stroke-width: 1px !important}`).
- Box at 1440: x 0, y 170, 512×641. The art bleeds off the left edge.
- Line art color #6563DA (lavender02) plus device groups `.scale`, `.stetho`, `.thermo`, `.watch` and `.pills`.

**Content** (grid-area content, `place-self: center; width: 912px`):
- Title `div.Hero__Title`:
  - Text: "Making at home" `<br>` "healthcare"
  - Style: h2 92px / 600 / lh 84.64px / -3.68px, color #FFFFFF
  - Box 912×334 at y 170
- Rotating word box `Hero__WordBox` (inside the title, under "healthcare"):
  - Style: h1 124px / 600 / lh 114.08px / -4.96px, color brightTurquoise (#72E6FF)
  - `margin-top: 9px; width: fit-content; padding: 1px; border-radius: 16px`
  - **Dashed border** drawn as a background image:
    `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%23E6E5FBFF' stroke-width='2' stroke-dasharray='1%2c 8' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`
    with `background-position: center`
  - Word element: `padding: 20px 32px; translate: 0 -5%`
  - Measured with "powerful.": 332 wide when collapsed mid-swap, otherwise fits the word. Height 156.08 at y 348.
  - Words cycle every 3000ms: **"manageable." → "powerful." → "easy." → "personalized."** (looping).
- Description `Hero__Description`:
  - Text: "Remote care logistics and patient support with unified data management."
  - Style: bodyR 18/500/25.92px/-0.72px, white, `margin: 41px 0; max-width: 396px`. Wraps to 2 lines (396×51.84 at y 545).

**Interface / dashboard** (`hero-interface.svg`, 1340×870 natural):
- Its starting position and size is the empty grid cell `Hero__ZoomFrom` (area interface, width 862px): at 1440 the svg sits at x 528, y 654, 862×560.
- The real element is `Hero__ZoomTo` (`width: fit-content; margin: -400px auto 0`), pinned. Flip transitions it to fit.
- The animated counter overlay `Interface__Text`:
  - `position: absolute; top: 241.5px; left: 1093px` (in 1340-wide coordinates)
  - 54px / 600 / lh 92% / -2.16px; color display-p3(0.4411 0.6982 1), about #59B4FF
  - `height: 48px; overflow: clip; display: flex; padding-right: 3px`
  - Digit columns, each child 48px tall: `1`, `.tens.left` [1,2,3], `.ones.left` [7,8,9,0,1,2,3,4,5,6,7,8,9,0,1] (`margin-left: -9px; margin-right: 3.75px`), `.slash` "/", `.tens.right` [7,8] (`margin-left: 11.25px`), `.ones.right` [2,3,4,5,6,7,8,9,0,1,2,3] (`margin-left: -4.25px`)
  - Initial reading "117 / 72", final reading "131 / 83"
- Inside the SVG (static art): sidebar card "Louise Belrosa / DOB 7/13/68 / 871-555-3926 / louisebel@gmail.com / 7604 Mesa Vista Circle Salt Lake City, Utah 84034", tabs "Info / Orders / Support / Data", chips "Blood Pressure / Weight / Blood Oxygen / Blood Glucose / Temperature / ECG", and cards "Blood Pressure Average (July 3, 2022 – July 27, 2023)" and "Blood Pressure Pulse Rate Record" with chart lines `.top-animated-line` and `.bottom-animated-line`. This text is SVG, not HTML.

**Hero motion (≥501px; on mobile the zoom and fade are disabled):**
1. **Fade on scroll.** `gsap.to([Illustration, Hero__Wrapper], {opacity: 0, scrollTrigger: {trigger: Hero__Wrapper, start: "clamp(center center+=400px)", end: "center center", scrub: .5}})`. Measured wrapper opacity: 0.98 at scrollY 100, .57 at 200, .26 at 300, .07 at 400, 0 at 500.
2. **Zoom-pin (Flip).**
   - ZoomTo is first fitted onto ZoomFrom. It then animates back to its natural 1340×870 centered size (x 50 at 1440) with `Flip.fit(..., {scale: true, ease: "power2.inOut", scrollTrigger: {trigger: ZoomFrom, start: "center-=ci(400) center", endTrigger: ZoomTo.parent, end: "center+=ci(200) center", scrub: 1}})`.
   - It is pinned with `pin: parent, pinSpacing: false` from `center center` to `center center`, using a "soft pin" helper with smoothLevel `min(200, |Δh|/4)`. That helper adds ±smoothLevel/4 y-drift with power1.in/out around the pin edges.
   - Measured svg box by scrollY:

     | scrollY | x | y | width |
     |---|---|---|---|
     | 0 | 528 | 654 | 862 |
     | 300 | 514 | 359 | 876 |
     | 400 | 474 | 246 | 916 |
     | 500 | 392 | 142 | 998 |
     | 600 | 253 | 81 | 1137 |
     | 700 | 145 | 46 | 1245 |
     | 800 | 82 | 10 | 1308 |
     | 900 | 56 | -75 | 1334 |
     | ≥1000 | 50 | (scrolls normally) | 1340 |
3. **Counter and lines (component `Interface`).** Triggered once the interface center reaches the viewport center (`start: "center center", end: "center top", toggleActions: "play none none reverse"`).
   - Line timeline:
     - `.top-animated-line` from `clipPath: inset(0 100% 0 0)`, 2s, power2.inOut
     - `.bottom-animated-line` the same, at +0.3s
   - Counter timeline (`timeScale .75`):
     - `.tens.left` yPercent -100 (0.4s, power2.inOut, at .5), then yPercent -200 (0.4s, at 1)
     - `.ones.left` x ci(8.5) at .5; `.slash` x ci(2) at .5
     - `.ones.left` yPercent -1400 (1.4s, power2.inOut, at .2)
     - `.tens.right` yPercent -100 (0.5s, at 1.15)
     - `.ones.right` yPercent -1100 (1.5s, at .5)
     - `.tens.right` x ci(2) at 1; `.ones.right` x ci(5.5) at 1
   - Measured: the clip finished and the digits reached -200% by scrollY 1000 at 1440.
4. **Line-art travellers (AnimatedPaths).**
   - Each `path.animate` in the hero illustration gets a DrawSVG dash of length random [50,150]px. It travels along the path's middle portion (range [.2,.7] desktop, [.2,.8] tablet, [.16,.66] mobile) at random speed [150,250]px/s.
   - Ease is linear: grow, travel, shrink, then a 1s gap; repeats with `repeatRefresh`. Paths start staggered by random 0.2–0.6s.
   - Runs while visible (`start: "top 90%", end: "bottom top", toggleActions: "play pause resume pause"`).
   - `.animate` elements start `visibility: hidden` until set visible.
5. **Mouse parallax** (devices with hover). On mousemove, with r = clientX/innerWidth and l = clientY/innerHeight, groups are moved over 1s with power3.out:
   - `.stetho` x = (r-.5)·4, y = (l-.5)·4
   - `.thermo` ±8
   - `.watch` ±12
   - `.pills` ±16 px

   On non-hover devices, a virtual pointer tweens y from -vh to 3vh over 8s, yoyo, repeating forever, power3.inOut.
6. **Rotating word** (AutoAnimate):
   - The outgoing word goes to `yPercent: -100`; the incoming word comes `from yPercent: 100`. Both use duration 1s, ease power3.inOut.
   - The box tweens its width and height to the new word's size with the same duration and ease.
   - `alignment: start` on desktop/tablet, `center` on mobile.

**1280:** hero top 100.4, height 978.5, padding-top 50.66, columns 455.26/810.66, gap 14.22. Title 81.78px, word box 139px tall, description 16px (max-width 352). Interface starts 766.4×497.3 at (469.4, 581.5).

**Tablet (768):**
- Grid gap 4.492vw (34.5px); columns `1fr 61.816vw` (259.6/474.7).
- Illustration height 62.598vw (480.8), margin-left -16.211vw (it starts at x -124.5).
- Content width 58.203vw (447) at x 308.
- Title 68.997px. Word box 95.5px tall at y 324.6.
- Description: 13.5px, `margin: .879vw 0 5.762vw; max-width: 52.051vw`.
- ZoomFrom `width: 74.609vw; margin-right: -100%`. The interface starts 574×373 at (290, 544) and overflows to the right; the svg is 90.234vw.
- Counter text: `top: 15.527vw; left: 71.094vw; scale: .69`.

**Mobile (390):**
- Grid becomes one column with areas `"content" "illustration" "interface"`, gap 0, padding-top 0. Hero height 1104.
- Content 92vw wide (358.8), centered text.
- Title h3-mobile: 12.267vw = 47.84px, lh 44.01, -1.915px, centered.
- Word box `margin: 2.4vw auto 0`, same font size (47.84px), 338×87.6.
- Description: 18.72px (4.8vw), `margin: 2.4vw 0 12.267vw; max-width: 92vw`, centered.
- Illustration: `height: 108.8vw` (424), `margin-left: -14.933vw`; `.line` paths get `scale: 1.6; translate: -14.667vw -2.667vw`.
- Interface: `width: 135.467vw` (528) at x 16.6, `margin: 10.4vw -40vw 0 4.267vw`. It overflows the right edge.
- Counter text hidden. No zoom and no fade.

---

## 3. Section 2: Focus (`section.sc-02-03-Focus__Wrapper`)
**Box at 1440:** top 1683.8, `height: 1394px`.
- `display: flex; flex-direction: column; align-items: center; position: relative; z-index: 2`.
- Background: page blue05 (from main::before).
- Inner: `width: 100%; max-width: 1440px`.

**Top block** `Focus__Top`:
- `display: flex; flex-direction: column; align-items: center; padding: 130px 116px; gap: 34px; height: 594px`.
- Title `h2.Focus__Title`:
  - Text: "Allowing you to focus" / "on patient health care". These are the two SplitText lines at 1440; the source string is "Allowing you to focus on patient health care".
  - Style: **h1 124px / 600 / lh 114.08px / -4.96px**, white, centered. Box 1173.5×246.2 at y 1813.8. Multi-line TextAnimation.
- **Marquee pill** `Focus__MarqueeWrapper`:
  - `width: 296px; height: 72px` (measured 53.85 tall, because grid content sets the row height); `border-radius: 99vw; background: #fff; overflow: clip; display: grid; place-items: center`.
  - Items repeat in a ConstantMarquee:
    - `span` "KEEP SCROLLING" (text "Keep Scrolling", kickerS 13px/600/18.72px/+0.26px uppercase, color blue04 #524FD9, margin-right 10px)
    - `marquee-logo.svg` (106px wide, margin-right 10px)
  - Each item is about 106+10+106+10 = 232px; 8 copies are rendered.
  - Motion: copies are laid out side by side. `gsap.to(children, {x: "-=" + itemWidth, duration: 10, ease: "none"})` with a modifier that wraps the x position, restarting on complete. It moves right-to-left at itemWidth per 10s (about 23px/s at 1440). It plays only while in view (`start: "top bottom", end: "bottom top"`, toggleActions play pause resume pause).
  - Hidden on mobile.

**Bottom white panel** `Focus__BottomInner`:
- `position: absolute; left: 0; bottom: 0; width: 100%; height: calc(100% - 594px)`; background #fff; `border-radius: 24px 24px 0 0`.
- Content is grid centered, full height.
- Title row `Focus__BottomTitle`:
  - Style: h2 92px/600/84.64px/-3.68px, color blue02; `display: flex; align-items: center; gap: 24px; position: relative`.
  - Content: `<span>Let's show you</span>`, then a primary button "Request Demo" → `/request-demo/` (wrapper `display: flex; position: relative; z-index: 3`; button `top: -30px`), then `<span>how we do it</span>`.
  - Box at 1440: 1280×84.6 at y 2721.8. The button is at x 657.9, y 2732.7.

**Focus motion (≥501):**
- White panel grows: `fromTo(BottomInner, {height: "45%"}, {height: "100%", ease: "power1.out", scrollTrigger: {trigger: BottomInner, start: "clamp(top bottom)", endTrigger: section, end: "bottom bottom", scrub: true}})`. Measured: 627px at rest; 909px at scrollY 1700; 1394 (full) at 2300.
- **Request Demo button pins and docks top-right.** A timeline with `scrollTrigger {trigger: section, start: "center top+=ci(76)", end: "bottom+=" + 8*innerHeight, scrub: true, pin: buttonWrapper, pinSpacing: false, anticipatePin: 1}`:
  - First `to(button, {x: bodyWidth - rect.x - rect.width - ci(44), y: 0, duration: 1, ease: "power1.inOut"})`, then a hold of duration 9.
  - Measured at 1440: x 658 → 906 (scrollY 2700) → **1211, y 44 fixed** from about 3100 until about 10000. It then scrolls away with the white section.
  - The result is a floating "Request Demo" CTA in the top-right during the whole How It Works sequence.

**1280:** section top 1496.4, height 1239.1; title 110.2px; marquee 263.1×47.9; panel 557.6; bottom title 81.78px.

**Tablet (768):**
- `height: 161.816vw` (1242.7).
- Top: `height: 83.789vw; padding: 13.867vw 0 42.871vw` (106.5/329.2); gap 25.5.
- Title: 8.984vw (69px), centered, 704 wide.
- Marquee 28.906vw × 7.031vw (222×41.8).
- BottomInner `height: calc(100% - 83.789vw)`, radius 18px.
- BottomTitle is a column: "Let's show you", the button (`width: 18.066vw`, 138.7 wide), "how we do it"; 69px text, gap 18px.

**Mobile (390):**
- `height: 165.867vw` (646.9). Top: `height: 58.933vw; padding: 10.133vw 4vw 15.467vw`.
- Title 47.84px centered (330 wide). Marquee hidden.
- BottomInner `height: calc(100% - 58.933vw)`, radius 6.4vw (24.96).
- BottomTitle is a column, 47.84px, gap 6.4vw; the button sits between the spans (191.9×65.5). No pin and no dock.

---

## 4. Section 3: How It Works (`section.sc-04-HowItWorks__Wrapper`, inside `pages__WorksWrap`)
**Box at 1440:** top 3077.8, height 6555; background **blue01 (#161658)**; text white.
- `position: relative; z-index: 1; padding-bottom: 30px; margin-bottom: -30px`.
- Desktop grid:
  - `grid-template-columns: 1fr 1fr` (720/720)
  - `grid-template-rows: auto 25svh auto 25svh auto 25svh 0` (measured rows 1800, 225, 1575, 225, 1575, 225, 0, 900, including pin spacers)
  - `grid-auto-flow: dense; place-items: start`
  - First child spans rows 1/2; the second child spans rows 1/3 with `margin-top: 25svh`
- Children alternate: TextPart, ImagePart, TextPart, ImagePart… then a PseudoBox. Text is the left column and image the right; the image is offset 25svh lower.
- **TextPart:** `display: grid; place-items: center; width: 100%; height: 100svh; grid-row: span 2`.
- **ImagePart:** `height: 100svh; width: 100%; grid-row: span 2; padding: 20px; overflow: clip visible`.
- **ImageBox:** `background: blue01; width: 100%; height: 100%; display: grid; place-items: center; border-radius: 32px` (680×860 at 1440).
- **PseudoBox:** the frame that masks the right half into a rounded window.
  - `--padding: 200px; position: absolute; top: -200px; right: 0; width: 50vw; height: calc(100svh + 400px); z-index: 2`
  - Borders: top and bottom `calc(200px + 20px) solid blue02`; left and right `20px solid blue02`
  - `::before { position: absolute; inset: -19.5px; border: 20px solid blue02; border-radius: 52px }`
  - Visual result: on the right half, a blue02 (#232265) frame 20px thick with 32px inner radius around the illustration box.
  - Hidden on tablet and mobile.
- **Step text block** `TextParts__Wrapper`: `width: 494px; display: grid; gap: 36px`; at 1440 x 113.
  - TopBar:
    - `display: flex; justify-content: space-between; align-items: end; padding-bottom: 24px; border-bottom: 1px solid blue02; position: relative`
    - Text in bodyM 14/600/20.16/-0.56; color brightBlue for steps 01 and 03, brightGreen for 02 and 04
    - Left: icon svg 46×46, `border: 1px solid rgb(14,14,78); border-radius: 7px; filter: drop-shadow(rgb(14,14,78) 0 0 0) drop-shadow(rgba(0,0,0,.19) 0 1px 9px); overflow: clip`
    - `::before` overlay: 46×46 at 0,0, `border: 1px solid rgb(14,14,78); radius 7px; box-shadow: rgba(255,255,255,.05) 0 -1px 2px inset; z-index: 2`
    - Right: the step number ("01." etc.)
  - Title `TextParts__BlueTitle`: h3 46px/600/42.31px/-1.84px, white. `<span>` highlights are brightBlue (steps 01, 03) or brightGreen (02, 04 via GreenTitle).
  - Description `TextParts__Description`: bodyR 18/500/25.92/-0.72, color silver02 (#D8D8E3).
- **Copy:**
  - 01.
    - Title: "First, Impilo **identifies** and **qualifies** patients for the program." Bold words are the brightBlue spans.
    - Description: "Impilo utilizes their data engine to enroll and welcome patients into remote care programs utilizing their platform and digital Health tech specialists."
    - Illustration: `IllustrationOne`.
  - 02. (green)
    - Title: "We **pack** and **ship** medical devices and supplies **directly** to your patients."
    - Description: "We simplify remote monitoring operations, offering quality support for virtual care programs. Customize and white-label medical device kits, shipped directly to your patient without the need for in-house logistics management."
    - Followed by the blue Link "Learn more about Our Solutions" → `/solutions/` (14px/600, brightBlue, arrow first).
    - Illustration: `IllustrationTwo`.
  - 03.
    - Title: "Our specialists **educate** patients and supply providers with **data to support** patient care."
    - Description: "Our team approaches each patient with a personalized strategy ensuring patient activation to build relationships that encourage long-term engagement. We provide insights based on patient data and industry trends, helping providers make informed decisions to enhance program effectiveness."
    - Illustration: `IllustrationThree`.
  - 04. (green)
    - Title: "Unlock new data insights for **Population Health**, **Billing Opportunities**, or **Patient Engagement**."
    - Description: "Review your patient data in the Impilo dashboard or integrate into your existing EHR or Digital Health Platform. Our platform allows you to continue working seamlessly from ordering to managing device data."
    - Illustration: `IllustrationFour`.
- **Illustrations.** Each is wrapped in `ScaledContent` (scale 1 on desktop; tablet scales are .5/.55/.62/.51), and layers are stacked in one grid cell (`> * {grid-area: 1/1/2/2}`).
  - **One:** 650 wide. Layers:
    - `ill1-background.svg`
    - Container `{margin: 67px 74px 67px 60px; height: 480px; border: 1px solid brightBlue; border-radius: 16px; background: blue01; overflow: clip}` holding AnimatedRows (`opacity: .3; width: 469px; margin: 0 auto`) with 11× `ill1-row.svg` (469×72, `margin: 0 auto 8px`)
    - `ill1-foreground.svg` (`z-index: 1`)
    - Static copy inside the SVG: "Rayna Donin" / "High Blood Pressure" and "Diabetes" / "Zain Baptista".
  - **Two:** 680 wide.
    - `ill2-illustration.svg` (`.tablet-tube` hidden on desktop; `.desktop-tube` hidden on tablet)
    - Overlay counter `IllustrationTwo__Text` (`scale text`):
      - 66px/600/lh 92%/-4.96px, brightGreen, `height: 60px; overflow: clip; display: flex; margin-top: 171px; margin-left: 275px; translate: -21px`
      - Columns: `1`, `.tens` [5,6] (`margin-left: 2px`), `.ones` [8,9,0,1,2,3,4,5,6,7], `.`, `.decimals.first` [0,5] (`margin-right: 2px`), `.decimals.second` [0,8]
      - Each child is 62px tall. The reading goes from "158.00" to "167.58".
  - **Three:** 680 wide. A PNG background `<img>` (`ill3-background.png`, 680×760, `object-fit: contain`) under `ill3-illustration.svg`. The SVG shows "131 / 83" and "One Hour Diabetic PPG".
  - **Four:** 680 wide. `ill4-illustration.svg`, a patient table with "Corey Bergson Open" highlighted; `.highlight{transform-origin: center top}`.

**How It Works motion (≥1025 desktop, pinned sequence):**
- Each TextPart and ImagePart is pinned via the soft-pin helper (pinType from ScrollSmoother/fixed) with `start: "center center"`:
  - `end: "+=" + (image ? 75vh : 100vh) + (last ? 100vh : 0)`
  - `pinSpacing: !last`; smoothLevel 50
- ImageParts fade: `from opacity 0` over the 25vh before pin start (scrub), and `to opacity 0` over the 25vh after pin end (scrub).
- Measured: the image is at opacity 0 at rest; it fades in near scrollY 3100 and reaches opacity 1 at 3500 while text and image are both pinned at y 0. The next step's text slides up from below.
- The PseudoBox is pinned (`trigger: PseudoBox, start: "top -200px", end: "bottom -700%"`, smoothType "in", smoothLevel 200). It stays at y -200 from scrollY ≈3500 to ≈10500.
- The white section (`pages__White`, rounded 24px top) then scrolls up over the last step.
- **Illustration intros** (each fires once when its box center hits 75% of the viewport, `start: "center 75%"`). Skipped on iOS mobile.
  - One:
    - Rows: `gsap.to(rows, {y: ci(-80), repeat: -1, ease: "none"})` (infinite upward scroll). A timeline tweens its timeScale 10→0 over 3s.
    - `.top-head, .top-card, .bottom-head, .bottom-card` from `{opacity: 0, yPercent: 100}`, 1s, power2.out, stagger .25.
    - Then a float loop: yPercent -6, 4s, yoyo, infinite, power1.inOut, stagger 1.
  - Two:
    - `.scale, .thermo, .glucose, .pressure` each from `{opacity: 0, y: 400}`, 2s, power3.out, delay .2·i.
    - Then floats: `.scale` y ci(-30), others yPercent -6; 4s yoyo infinite power1.inOut, delay i.
    - Counter: `.tens` yPercent -100 (.7s, power3.inOut, at .7); `.ones` yPercent -900 (3s, power2.inOut, at 0)
    - `.ones` marginRight -ci(15) at 2; `.decimals.first` marginLeft ci(2), marginRight -ci(3) (.5s at 2.5)
    - `.scale.text` x ci(1) and from scale .9 (1s at 2)
    - `.decimals` yPercent -100 (1.5s, power4.inOut, stagger .2, at 1.8)
  - Three:
    - img from opacity 0
    - `.panel.pressure, .panel.graph, .stetho, .glucose, .medicine` from `{opacity: 0, y: 400}`, 2s, power3.out, delay .2·i
    - Floats yPercent -6 4s yoyo (`.panel` for graph), delay i
    - `.graph.line` from `clipPath: inset(0 100% 0 0)`, 2s, power3.out, at 1.5
  - Four:
    - `.sliders` from `{opacity: 0, y: 400}`, 2s, power3.out
    - `.card` the same at .2; then `.card` yPercent -6 4s yoyo infinite, and `.panel` yPercent -2 4s yoyo (delay .5)
    - `.highlight` from scale .8 (2.5s, power3.out, at 0)

**1280:** section top 2735.5, columns 640/640; text wrapper 439.1 wide at x 100.4; title 40.88px; description 16px; icon 40.9.

**Tablet (768):**
- Single column; `margin-bottom: 9.766vw`; `::before` is shown (a blue02 band 9.766vw tall at the bottom).
- TextPart: `height: auto; min-height: 63.477vw; padding: 8.789vw 0` (487.5 tall).
- ImagePart: `height: 69.824vw` (536); background blue02; padding 1.953vw.
- ImageBox: radius 3.125vw (24), `overflow: clip`.
- Text wrapper 48.242vw (370.5) centered at x 198.8. Title 34.5px; description 13.5px.
- No step pins. Instead, the whole section is pinned at its bottom (`start: "bottom 100vh", end: "bottom top", pinSpacing: false`) so the white section slides over it.

**Mobile (390):**
- Single column. TextPart `padding: 16vw 0` (62.4) with wrapper 92vw (358.8) at x 15.6.
- Title 47.84px/44.01 (12.267vw); description 18.72px; gap 9.6vw (37.44); icon 47.8px.
- ImagePart: `height: 124.8vw` (486.7); `padding: 4.267vw`; background blue02.
- ImageBox: radius 4.267vw (16.6), `overflow: clip`; children `margin: -53.333vw`. Illustrations are scaled .5/.55/.62/.51 and cropped.

---

## 5. White container (`pages__White`)
- Background silver03 (#F4F4F6); `border-radius: 24px`; `z-index: 2; position: relative; min-height: 100vh`.
- At 1440: top 9602.8, height 3897.6. All sections below have #fff backgrounds.

## 6. Section 4: White Glove (`sc-05-WhiteGlove__Wrapper`)
**Box at 1440:** top 9602.8, height 831.24.
- Background #fff; `border-radius: 24px 24px 0 0; position: relative; z-index: 4`; grid centered.
- Inner: `max-width: 1440px; display: flex; flex-direction: column; align-items: center; padding: 135px 0 173px`.
- Content, top to bottom:
  1. **Pill** (64×28, blue01) at y 9737.8.
  2. Title `h3`:
     - Text: "End-to-end white glove service"
     - Style: h2 92px/600/84.64/-3.68px, color blue02, centered, `margin-top: 16px` (1224×93.6). Multi-line TextAnimation.
  3. Large text:
     - Text: "Our team is here to provide personalized support to you and your patients every step of the way."
     - Style: h4 24px/500/92% (22.08px)/-0.96px, blue02, centered, `width: 498px; margin: 59px 0` (2 lines, 44.17 tall).
  4. Logos box:
     - `width: fit-content; border: 1px solid silver01 (#9494A7); border-radius: 24px; display: flex` (314.97×142 at x 562.5).
     - Two cells `LogoWrapper {position: relative; padding: 24px 32px}`; the first has `border-right: 1px solid silver01`.
     - Each cell holds a 92×92 color badge (hipaa.webp / soc2.webp). An absolutely positioned gray version (hipaa-gray / soc2-gray, `top: 24px; left: 32px; transition: opacity .5s`) sits on top. **Hover on a cell:** the gray layer goes to opacity 0, revealing the color badge.
  5. Small text:
     - Text: "We pride ourselves on regulatory compliance and service quality. Impilo is FDA registered, DME Accredited, and (pending) ISO 13485."
     - Style: bodyM 14px/600/20.16/-0.56px, blue01, centered, `width: 390px; margin-top: 21px` (3 lines).
- **1280:** title 81.78px; large text 21.34px; logos 280.3×126.4; small text 12.44px, 346.7 wide.
- **Tablet:** `padding: 13.77vw 0 8.008vw`; title `width: 87.891vw` at 69px; large text 18px, 373.5 wide; logos 237×107; small text 10.5px.
- **Mobile:**
  - `padding: 37.6vw 4vw 22.4vw`; radius 6.4vw
  - title 95% wide at 47.84px
  - large text becomes bodyR: 18.72px/144%, 100% wide, `margin: 7.467vw 0`
  - logos 327.4×147.6; cells padded 6.4vw 8.533vw; badges 24.533vw
  - small text 14.56px, 100% wide

## 7. Section 5: Trusted (`sc-06-Trusted__Wrapper`)
**Box at 1440:** top 10434.05, height 819.02; background #fff.
- Inner: `max-width: 1440px; padding: 0 50px 78px`.
- Card `Trusted__Content`:
  - `background: blue02 (#232265); border-radius: 24px; padding: 100px 43px 43px; display: flex; flex-direction: column; align-items: center`
  - 1340×741 at x 50
- Contents:
  1. Title `h3`:
     - Text: "Trusted by digital" / "health leaders"
     - Style: h2 92px/600/84.64/-3.68px, white, centered, `width: 747px; margin-bottom: 34px`
  2. Text:
     - Text: "Impilo is trusted by medical professionals nationwide for logistics, device & patient support, and unified RPM/device data API for virtual & hybrid care providers, health systems, and digital health companies."
     - Style: bodyR 18/500/25.92, white, centered, `width: 708px; margin-bottom: 139px` (3 lines)
  3. Logo grid:
     - `display: grid; grid-template-columns: repeat(4,1fr); border: 1px solid lavender01 (#5250C5)` (1258×160 at x 91, y 10972)
     - Cells are `<a>` (LogoHover), each `width: 314px; height: 158px; display: grid; place-items: center; position: relative; overflow: clip; border-right: 1px solid lavender01` (none on the last)
     - Logos and targets, in order:
       - brook → https://brook.ai/
       - firefly health → https://www.fireflyhealth.com/
       - Penn Medicine → https://www.pennmedicine.org/
       - dreem health → https://dreemhealth.com/
     - The accessible name of every link is "Impilo Health".
     - SVG: `position: relative; z-index: 5; max-height: 48px; max-width: 180px; transition: filter .5s`. Paths with `fill="#fff"` have `transition: opacity .5s`.
     - **Not hovered:** svg `filter: contrast(0) brightness(2)` (renders white); `[data-transparent]` parts at opacity 0; ovals parked at `top: 100%`.
     - **Hover:**
       - The ovals group (`LogoHover__Ovals`: `position: absolute; left: 50%; transform: translateX(-50%); transition: top .5s; z-index: 0`) rises to `top: 58px`.
       - Three ellipses, each blue01 fill with `1px solid blue03` border and `border-radius: 100%`:
         - Oval1: 370×125 at top 0, z 1
         - Oval2: 360×140 at top 14, z 2
         - Oval3: 330×150 at top 28, z 3
       - The logo's original colors return as the filter is removed.
- **1280:** card 1194.9×658.9, padding 88.88/38.22; title 664 wide; logos 1118.4×142.4 (cells 279.1).
- **Tablet:**
  - Inner `padding: 0 4.883vw`; card `padding: 9.766vw 11.328vw 7.617vw` (75/87/58.5)
  - title and text 100% wide; text `margin-bottom: 2.344vw`
  - logos `width: 61.523vw` (472.5), 2 columns
  - cells 30.664vw × 15.43vw (235.5×118.5) with `border-bottom: .098vw solid lavender01`; the second cell has no right border
- **Mobile:**
  - Inner `padding: 0 4vw`; card `padding: 26.667vw 6.933vw 12.267vw`
  - title 47.84px; text 18.72px with `margin-bottom: 12.267vw`
  - logos in 1 column; cells 78.133vw × 42.133vw (304.7×164.3), no right border, bottom border .267vw

## 8. Section 6: Quotes / article carousel (`sc-07-Quotes__Wrapper`)
**Box at 1440:** top 11253.07, height 382.53; background #fff.
- Inner: `max-width: 1440px; display: grid; place-items: center; position: relative; padding: 114px 50px 0`.
- Slide `Quote__Wrapper`: `display: flex; flex-direction: column; align-items: center; gap: 48px`.
  - `h3` article title: h3 46px/600/42.31/-1.84px, blue01, centered, `margin: 0; width: 1113px`.
  - `p` excerpt: bodyL 17px/600/100%/-0.51px, blue01, centered, width 1113.
  - `a` "Read Full Article →":
    - bodyR 18/500/25.92, blue01, `border: 2px solid blue01; border-radius: 8px; padding: 12px 24px; transition: all .2s ease; text-decoration: none`
    - **Hover:** background blue01, text #fff
- Data: 3 items cycling with wrap-around. Initial index 0.
  1. "Remote Patient Monitoring for Sleep Apnea: Breaking Down Barriers with Wesper's At-Home Sleep Testing"
     - Excerpt: "Discover how Wesper's innovative at-home sleep testing technology is revolutionizing sleep apnea diagnosis and treatment through remote patient monitoring."
     - URL: https://impilo.health/blog/remote-patient-monitoring-for-sleep-apnea-breaking-down-barriers-with-wespers-at-home-sleep-testing/
  2. "How Remote Monitoring and Targeted Wellness Programs Improve Hypertension"
     - Excerpt: "Learn how remote patient monitoring and personalized wellness programs are transforming hypertension management and improving patient outcomes."
     - URL: https://impilo.health/blog/how-remote-monitoring-and-targeted-wellness-programs-improve-hypertension/
  3. "Enhancing Rural Healthcare Access Through RPM"
     - Excerpt: "Explore how remote patient monitoring is bridging healthcare gaps in rural communities and improving access to quality care for underserved populations."
     - URL: https://impilo.health/blog/enhancing-rural-healthcare-access-through-rpm/
- Arrows (`button`, aria-labels "Previous Quote" / "Next Quote"):
  - 35×35 circles, background #fff, `border-radius: 99vw`
  - `box-shadow: rgb(251,250,255) 0 -1px 1px 1px inset, rgba(212,209,242,.68) 0 2px 5px 0, rgba(133,143,172,.25) 0 0 0 1px`
  - Chevron svg 7px wide; the left one has `rotate: 180deg`
  - Positioned absolute: left at `left: 50px; top: 234px`, right at `right: 50px; top: 234px` (measured y 11487 at 1440)
- **Motion** (AutoAnimate wrapper with `padding: 100vw; margin: -100vw; pointer-events: none`, children re-enable events):
  - On next: the outgoing slide goes to `{xPercent: -110, opacity: 0}` and the incoming comes from `{xPercent: 110, opacity: 0}`. Previous mirrors this.
  - Duration 1s, ease power3.inOut. The container also tweens its height to the new slide's height.
- **1280:** title 40.88px (989 wide, 2 lines); excerpt 15.12px; link 169.6×48.4; arrows 31.1.
- **Tablet:**
  - title and excerpt width 67.969vw (522); title 34.5px (4 lines); excerpt 12.75px
  - arrows 26.25px at `top: 33.594vw` (left/right 4.883vw)
- **Mobile:**
  - inner `padding: 30.4vw 4vw 0`; gap 6.4vw
  - title h4: 24.96px/500/92%, width 74.667vw (291)
  - excerpt 14.56px/600/144%
  - link 14.56px/**400**, padding 8.32/16.64
  - arrows 36.4px at `top: 49.6vw`, left/right 4vw

## 9. Section 7: Integrations (`sc-08-Integrations__Wrapper`)
**Box at 1440:** top 11635.6, height 1125.57; background #fff.
- Inner: `max-width: 1440px; display: flex; flex-direction: column; align-items: center; padding: 220px 95px 0`.
- Contents:
  1. **Pill**.
  2. Title `h1`:
     - Text: "Patient care," / "our integrations." / "It's a perfect match." (forced `<br>`s)
     - Style: h2 92px/600/84.64/-3.68px, blue01, centered, `width: 1111px; margin-top: 16px` (280.9 tall). Multi-line TextAnimation.
  3. Cards row:
     - `display: flex; align-items: center; gap: 40px; margin: 55px 0` (1250×280 at x 95)
     - Each card: `width: 390px; height: 280px; border: 1px solid blue04 (#524FD9); border-radius: 24px; padding: 40px 0; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; position: relative`
     - Illustration svg: `position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 248px; height: 240px; overflow: visible`
     - Label: h4 24px/500/22.08/-0.96, blue01, centered, `position: relative; z-index: 2`
     - Labels: "Comprehensive Integration"; "Data Synchronization"; "Data Visualizations" `<br>` "and Reporting"
  4. Text:
     - Text: "Connect popular health devices, apps, existing EHR and workflows via our API & SDK for a unified, up to date view of your patient wellness journey. Custom integrations available upon request."
     - Style: bodyR, blue01, centered, `width: 425px; margin-bottom: 24px` (4 lines)
  5. Primary button "Explore Our Integrations" → `/integrations/` (254.4×63).
- **Motion:** in each illustration, `.layer-1` and `.layer-2` elements float with `fromTo({yPercent: -4}, {yPercent: 4, yoyo: true, repeat: -1, ease: "power2.inOut", duration: 5})`. For card i, the delays are `.layer-1` i·1.5s and `.layer-2` 2s + i·1.5s. This runs always and is not scroll-gated.
- **1280:** title 987.6 wide; cards 346.7×248.9, gap 35.56; label 21.34px; text 377.8 wide.
- **Tablet:**
  - inner `padding: 21.484vw 4.883vw 0`; title 100% wide at 69px
  - cards row wraps (`justify-content: center; flex-wrap: wrap`) with 2 per row plus 1 below; cards 292.5×210, gap 30
  - label 18px; text 41.504vw (318.8)
- **Mobile:**
  - inner `padding: 58.667vw 4vw 0`; title 47.84px
  - cards in a column, each 92vw × 74.667vw (358.8×291.2), radius 24.96, gap 10.667vw
  - illustrations 66.133vw × 64vw; label 24.96px
  - text 100% wide (18.72px); button 264.3×65.5

## 10. Section 8: CTA (`sc-09-Cta__Wrapper`)
**Box at 1440:** top 12761.17, height 739.27.
- Background #fff; `border-radius: 0 0 24px 24px` (this is the bottom of the white page, above the footer reveal).
- Inner: `max-width: 1440px; display: flex; flex-direction: column; align-items: center; padding: 244px 137px 220px; gap: 25px`.
- Title `h1`:
  - Text: "Learn how Impilo empowers" / "your virtual care program"
  - Style: h2 92px/600/84.64/-3.68px, blue01, centered (1086.6×187.3). Multi-line TextAnimation.
- Primary button "Request Demo" → `/request-demo/` (184.6×63 at y 13217).
- **1280:** title 965.8 wide.
- **Tablet:** `padding: 24.414vw 4.883vw 19.531vw`; title 69px (645 wide, 3 lines).
- **Mobile:** `padding: 40vw 4vw 30.667vw`; title 47.84px (4 lines); gap 6.667vw; button 191.9×65.5.

## 11. Footer (`footer.Footer__Wrapper`): fixed reveal
- `position: fixed; bottom: 0; left: 0; width: 100%; height: 727px; z-index: 1; overflow: clip; display: grid; place-items: center; background: blue05 (#3F3CCD)`.
- Page content scrolls over it. The 727px transparent `Footer__Spacer` (`max-height: 100lvh`) at the end of the scroll content reveals it.
- Inner `Footer__Inner`: `max-width: 1440px; width: 100%; display: flex; flex-direction: column; align-items: flex-end; padding: 104px 50px 80px; gap: 24px`.
- **Top row** `Footer__Top` (`display: flex; align-items: flex-end; justify-content: space-between; width: 100%`):
  - Left, LogoWrapper (relative):
    - Big logo `logo-footer.svg`, width 386px (226 tall), white, link to `/`
    - Copyright `position: absolute; left: 0; bottom: 0`: "© 2026 Impilo, Inc." (current year, dynamic); bodyXS 12px/600/11.04/-0.48px, white
  - Right, LinksButton (`display: flex; align-items: center; gap: 25px`):
    - Links row (`display: flex; gap: 48px; white-space: nowrap`), Link component (arrow first, silver04 text, hover brightGreen):
      - "Our Solutions" → /solutions/
      - "About Us" → /about/
      - "Blog" → /blog/
      - "Docs" → https://docs.impiloplatform.com
      - "Careers" → https://careers.impilo.health
      - "Contact Us" → mailto:sales@impilo.health
    - Primary button "Request Demo" → /request-demo/
- **Lines canvas** `Footer__LinesWrapper` (`position: relative; width: 100%; height: 265px`), containing `Lines__Wrapper` (`overflow: clip visible`):
  - A PIXI.js canvas (`Lines__Canvas`: `position: absolute; inset: -100px; z-index: 1; pointer-events: none`) draws **30 horizontal 1px lines, color #6563EA**, evenly spaced across the canvas height minus 2·ci(100) padding, from x ci(100) to width − ci(100).
  - A **white pill** follows the cursor:
    - `Lines__WhitePill`: Pill with #fff background, 100×44, its logo 60px wide with fill blue05, `cursor: none; z-index: 2`
    - Moved with `quickTo` x/y, centered with xPercent/yPercent -50
  - Lines within ±ci(63) of the cursor y bend around the pill: bezier detour of half-width ci(97)/ci(22.5), offset ci(40). Each line's y uses `quickTo`.
  - Easing: on hover-capable devices `elastic.out(1.5,0.3)` with duration 3; otherwise `power3.out` .4.
  - The pill scales to 1 (1.6s, same ease) when the pointer is inside the padded area, and to 0 (.3s, power2.in) when outside. On resize or initial load it is centered and visible.
  - Touchmove is supported. Measured initial pill at 1440: 100×44, transform translate(620, 110.5).
- **Info row** `Footer__Info` (`display: flex; align-items: center; justify-content: end; gap: 48px; width: 100%`; bodyXS 12px/600/92%/-0.48px, white):
  - "2150 Kubach Road Philadelphia, PA, 19116" (span)
  - "(202) 838-5839" → tel:+12028385839
  - "Privacy Policy" → /privacy/
  - "Terms and Conditions" → /terms/
  - "Linkedin" → https://www.linkedin.com/company/impilo-inc/
- At 1440 (viewport 900): footer y 173–900. Logo at y 277; links row y 469; button y 447.5; lines block y 534.5–799.5; info row y 823.5.
- **1280:** height 646.2; padding 92.44/44.44/71.12; logo 343.1×201; links gap 42.66; lines 235.6 tall.
- **Tablet (768):**
  - height 70.996vw (545); `padding: 7.813vw 4.883vw` (60/37.5)
  - links become a column (`flex-direction: column; align-items: flex-start; gap: 1.953vw; margin-bottom: 2.051vw`)
  - LinksButton `gap: 6.543vw; align-items: end` (button bottom-aligned to the right of the column)
  - logo 37.695vw (289.5); lines 25.879vw tall (198.8); info gap 4.688vw
- **Mobile (390):**
  - height 189.333vw (738.4); `padding: 17.067vw 5.333vw 5.067vw; gap: 5.867vw; align-items: flex-start`
  - Top row is a column with gap 6.933vw. The logo is 56.8vw (221.5) and the copyright sits under it (position relative).
  - LinksButton is a column: links column (gap 6.4vw, 14.56px text) then the button.
  - **Lines canvas hidden.**
  - Info becomes a grid (`justify-content: start; gap: 6.667vw`) with areas `"privacy" "terms" "linkedin" "address" "phone"` (that order), text 12.48px.

---

## 12. Motion inventory (summary)
| What | Trigger | Spec |
|---|---|---|
| Preloader counter + exit | load | see 0.7 |
| Page transition overlay (`Transition__Wrapper`, blue02, pulse svg) | client route changes only | in: wrapper y from -100lvh, pulse drawSVG 0→100%, power3; out: y 100lvh + radius 200px 200px 0 0, power3.in |
| Hero word rotator | setInterval 3000ms | yPercent ±100, 1s power3.inOut |
| Hero illustration travellers | in view | DrawSVG dashes, linear, infinite |
| Hero mouse parallax | mousemove | ±4/8/12/16px, 1s power3.out |
| Hero fade | scroll scrub .5 | opacity 1→0 over about 400px |
| Hero dashboard zoom-pin | scroll scrub 1 | Flip fit 862→1340 wide, power2.inOut |
| Dashboard chart lines + counters | center hits center, reversible | clip-path wipe 2s; digit rolls (see 2.3) |
| Text reveals | `top 75%`, once | SplitText lines y 100%→0, stagger .25, 0.5s; or opacity fade 0.5s |
| "Keep Scrolling" marquee | in view | linear, item width per 10s, right→left |
| Focus white panel growth | scroll scrub | height 45%→100% |
| Docking Request Demo button | scroll scrub | pinned, slides to top-right (x = 100vw − w − 44, y 44), held 8 viewport heights |
| How It Works pins | scroll | per-part pins, image fade ±25vh, PseudoBox frame pinned |
| Step illustrations | `center 75%`, once | y 400→0 / opacity, then infinite float yPercent -6 4s yoyo; counter rolls |
| Pill pulse logo | always | clip-path wipe loop, 3s hold |
| WhiteGlove badge hover | hover | gray layer opacity .5s |
| Trusted logo hover | hover | ovals top 100%→58px .5s; filter to full color .5s |
| Quotes carousel | click | xPercent ±110 + opacity, 1s power3.inOut |
| Integrations illustrations | always | layer float yPercent ±4, 5s yoyo, power2.inOut |
| Buttons | hover | colour .5s; text roll translateY(-200%) .25s |
| Links | hover | colour .5s; arrow translateX(4px) .5s |
| Footer lines + white pill | mousemove / touchmove | PIXI bezier bending, elastic.out(1.5,.3) 3s |
| Footer reveal | scroll | fixed footer under content + 727px spacer |

CSS @keyframes present (full text):
```
@keyframes jBcSpD { 0% { opacity: 0; } 100% { opacity: 1; } }            /* mobile overlay open */
@keyframes jiroXv { 0% { opacity: 1; } 100% { opacity: 0; } }            /* mobile overlay close */
@keyframes bnUGOw { 0% { transform: translateY(-100lvh); } 100% { transform: translateY(0px); } }  /* mobile menu open */
@keyframes buNjwU { 0% { transform: translateY(0px); } 100% { transform: translateY(-100lvh); } }  /* mobile menu close */
@keyframes slide-down { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } } /* desktop dropdown, .15s ease-out */
```
No video, Lottie, AOS or framer-motion is used. Window globals present: `_gsap`, `gsapVersions`, and Gatsby's `___loader` and related globals. Everything else is GSAP.

## 13. Head / meta
- Title: "Impilo | Remote Patient Monitoring Devices".
- Description: "Impilo provides API infrastructure for patient monitoring and connected supplies. Our platform enables the ability to buy, distribute, support, and integrate digital health devices/supplies. Impilo handles patient monitoring operations, while you handle the clinical."
- og:image: https://impilo.health/og-image.png. Twitter card: summary_large_image.
- Viewport: `minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no`.
- Favicons are listed in ASSETS.json.

## 14. Things that could not be measured or are approximate
- Text inside the dashboard and step illustrations is SVG artwork. Use the saved SVGs rather than rebuilding it as HTML.
- The footer line canvas is procedural (PIXI WebGL). Pixel output cannot be read; this spec describes its algorithm from the shipped JS.
- Random values (line traveller lengths, speeds and delays) differ on every load by design.
- Full-page screenshots cannot represent scroll-pinned states in one image; use the per-scroll frames in `recon/screens/frames-1440/`.
