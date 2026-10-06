Source: https://impilo.health/

# Impilo company and utility page templates: Clone Spec

Routes: `/about/`, `/integrations/`, `/request-demo/`, `/terms/`, `/privacy/`, `/app-privacy/`, and the 404 page.

I measured these live on 2026-10-06 with an isolated headless Chromium (Playwright 1.63) at 1440x900, 390x844 and 768x1024, using `?noSmooth`. I also read the shipped page chunks, `component---src-pages-*.js`, to get the authored design-px values and the GSAP parameters.

**Read `CLONE_SPEC.md` §0 first.** Everything below reuses that document's pieces without restating them:
- the fluid `--u` model
- Gilroy
- the type tokens (h1…kickerS) and color tokens
- Primary button, Link, Pill and TextAnimation
- header, footer and preloader

All px values below are **design px**: they equal the rendered px at 1440, and you write them as `calc(N * var(--u))`. Unless noted otherwise, "mobile" values are authored against 375 (`--u = 100vw/375`) and "tablet" values against 1024.

Breakpoint override sources from the chunks: `f()` = all breakpoints (fluid), `$E()` = tablet only (501–1024), `Sq()` = mobile only (≤500).

Reference screenshots are in `recon/screens/pages/`:
- `about-1440.png`, `about-390.png`
- `integrations-1440.png`, `integrations-390.png`
- `request-demo-1440.png`, `request-demo-390.png`, `request-demo-focus-{1440,390}.png`, `request-demo-error-{1440,390}.png`, `request-demo-dropdown-{1440,390}.png`
- `terms-*`, `privacy-*`, `app-privacy-*`, `404-*` (each at 1440 and 390)

Full-page captures were taken with `?noSmooth`. Pinned sections appear in their unpinned state in those captures.

**Content rule:** body copy is not transcribed. Headings and paragraphs are given as role, word count (w), line count at 1440 (L) and a neutral topic. Short UI labels, card titles of 5 words or fewer, and button and field labels are verbatim. Team members are placeholders.

---

## 0. Cross-page findings (what is shared and what is new)

### 0.1 Header, footer and page chrome
- **Header:** identical on all 7 pages (§1 of CLONE_SPEC): same blue05 background, same white links, not sticky. There is no dark or light theme variant.
  - **The only difference is on `/request-demo/`**: the header's "Request Demo" CTA is not rendered.
  - Because of that, desktop header height there is **97.48px** at 1440 instead of 112.98, because the 63px button no longer drives the row height.
  - At 768 the header there is 84.7 (unchanged); at 390 it is 117.5 (unchanged, since mobile has no CTA in the bar).
- **Footer:** identical fixed-reveal footer plus a 727px `Footer__Spacer` on every page. There is no footer variant.
- **Preloader:** the same preloader runs on first load of any route. Page transitions use the same `Transition__Wrapper`.
- **Page background:** `html` and the `Layout__Main::before` are blue05 (#3F3CCD) everywhere. Content panels are rounded cards that sit on top of it.
- **Event hook:** entrance animations on these pages wait for the global `"anyEnd"` event, which fires when the preloader or page transition finishes. The clone already fires this, or should fire an equivalent, after preloader exit.

### 0.2 New shared components and variants
| Component | Used on | Notes |
|---|---|---|
| **Pill, white variant** (`<Pill white>`) | about ×2 | `background:#fff; path{fill: blue01}`. Size is the same as the default (64×28, logo 38w; mobile 17.067vw × 7.467vw). The same clip-path pulse loop applies. |
| **LineFillText** (SplitText lines + scrubbed gradient text fill) | about hero, about "Anywhere" paragraph | See A.1 and A.3. Each line is a `div.give-me-clipping-please`: `-webkit-text-fill-color: transparent; background-clip: text; margin-bottom: -.1em; padding-bottom: .1em`. The background tweens from `linear-gradient(to right, FILL 0%, FILL 0%, BASE 0%, BASE 100%)` to `linear-gradient(to right, FILL 0%, FILL 100%, BASE 100%, BASE 100%)`. With N lines, the per-line stagger is `.8/N` and the duration is `.8/N`, linear, scrubbed. |
| **PinHelper** (`pinSection`) | about hero, integrations hero, integrations cards | Wraps `ScrollTrigger.create({pin:true, ...})`. With ScrollSmoother off (pinType "fixed"), the extra "smoothing" tweens are skipped. You can implement it as a plain ScrollTrigger pin. |
| **ParallaxOut** (`k.a(el)`) | integrations hero | `gsap.to(el.children, {y: -40vh, ease: "linear", scrollTrigger: {trigger: el, start: "bottom bottom", end: "bottom top", scrub: true}})`. |
| **AutoAnimate** (cross-fade swapper) | integrations laptop carousel, request-demo form, success and error swap | On key change, the outgoing node goes to `opacity 0` and the incoming node comes from `opacity 0`, both 1s `power3.inOut`. The wrapper tweens its width and height to the new child size, same duration and ease. On request-demo the wrapper has `padding: 1em; margin: -1em` (18px at 1440). |
| **Laptop showcase** | integrations | See I.4. The SVGs already exist from the solutions recon: `solutions-laptop-*.svg`. |
| **Form controls** (Input, TextArea, Select) | request-demo | See R.2. These are new. |
| **Legal template** (`Legal__Wrapper` / `Legal__Content`) | terms, privacy, app-privacy | **Confirmed shared.** All three use the same styled component (`sc-125ezfu`). See L. |

---

## A. `/about/`  (title "Impilo | About Us")

Document height is 6468 at 1440x900 and 6200 at 390. Section order, all inside `main` on the blue05 page:

1. Hero: pinned, with a scroll text-fill
2. Founded: white panel with a marquee
3. Anywhere: on blue
4. Leadership: on blue
5. Careers: white card
6. Footer spacer

### A.1 Hero (`sc-01-Hero__Wrapper`)
**Layout (1440):**
- Wrapper:
  - `background: blue05; padding-top: 44; padding-bottom: 94; gap: 94`, flex column
  - `min-height: calc(100svh - 113px); margin-bottom: 35vh` (315px at 900 tall); `will-change: transform`
- Height-based overrides:
  - `@media (height < 900px)`: gap 24, padding-bottom 24
  - `@media (height < 750px)`: `transform: scale(.9)`, origin center top
- Measured: wrapper y 112.5, 1440×972.
- **Box** (`h1.sc-01-Hero__Box`):
  - Type h2 (92/600/92%/-3.68). Color blue04 (#524FD9) is the "unfilled" text color.
  - `background: blue02; padding: 56; width: 1341; height: 640; margin: 0 auto; border-radius: 24; text-align: center`, flex column with justify center
  - `opacity: 0` initially; GSAP sets it to 1
  - Measured at x 49.5, y 156.5, 1341×640.
- Copy: one headline, 15w, 4 lines at 1440 (lines 93.8 tall incl. padding). Topic: "team enabling home care via devices".
- **Logos row** (`Hero__Logos`): flex, center, `gap: 86`, flex-shrink 0. Five `<img>` at 100×100:
  - ISO, HIPAA, HQAA, SOC2, FDA (in that order)
  - These are dark (blue01) badge SVGs
  - Measured y 890.5; x positions 298, 484, 670, 856, 1042
- Assets: `about-cert-iso.svg`, `about-cert-hipaa.svg`, `about-cert-hqaa.svg`, `about-cert-soc2.svg`, `about-cert-fda.svg`.

**Tablet:**
- Box 925×895.
- Wrapper `gap 61; padding-bottom 61`. `@media (height<1048px)`: gap 24, padding-bottom 24. `@media (height<1000px)`: scale .9.
- At 768: box 693.7×671.2, radius 18; logos 75px with gap 64.5.

**Mobile:**
- Wrapper: `gap 30; padding 36 0 30; height auto; margin-bottom 0; scale: 1 !important`. No pin.
- Box: h3 (46 → 47.84px at 390), 345×486, `padding: 21`; measured 358.8×505.4 at 390, 9 lines.
- Logos: `flex-wrap: wrap; gap: 22` (2 rows; row block 230.9 tall at 390).

**Motion:**
1. **Entrance**, paused until `anyEnd`, `delay .1`:
   - `set(box, {opacity: 1})`
   - `from(wrapper, {scale: .5, duration: 1, ease: "power1.out"}, 0)`
   - `from(box, {y: "200lvh", duration: 1, ease: "power3.out"}, 0)`
   - `from(logos, {opacity: 0, duration: .001}, .3)`
   - `from(lines, {yPercent: 100, clipPath: "inset(0 0 100% 0)", duration: 1, stagger: .2, ease: "power2.out"}, .3)`
   - Lines come from `SplitText(box, {type: "lines", linesClass: "give-me-clipping-please"})`.
2. **Text fill (LineFillText):**
   - FILL = silver05 (#fff), BASE = blue04.
   - `scrollTrigger: {start: 0, end: 35vh, scrub: true}`, stagger and duration `.8/N`, linear.
   - Measured: line 1 fully white by scrollY 150; all 4 lines white by scrollY 315 (35vh).
3. **Pin** (desktop, full-width and tablet only; not mobile):
   - trigger = wrapper; `start: 1` (scroll px), `end: 135vh`, `pin: true, pinSpacing: false, scrub: .1`
   - Timeline: `to(wrapper, {yPercent: -50, ease: "linear"})`
   - Measured transforms: translateY -59.6 at scroll 150, -239.8 at 600, -359.9 at 900; unpins at 1215 (=135vh).
   - The Founded panel (z 2) slides up over the pinned hero.
   - On mobile: `gsap.set(wrapper, {marginBottom: 0})`.

### A.2 Founded (`sc-02-Founded__Wrapper`)
- Wrapper:
  - `position: relative; background: #fff; border-radius: 24; z-index: 2; padding-bottom: 147`
  - Measured at y 1400 (after the 315 hero margin), 1440×1173.8
- Content: `width: 1440; margin: 0 auto; position: relative; display: grid`. Mobile width 345.
- **Glucose meter illustration** (`about-glucose-meter.svg`, viewBox 321×844):
  - `width: 320; position: absolute; top: 155; left: -80; transform: rotate(14.221deg)`
  - White fills, lavender04 (#B1A6F6) 1px strokes. It is partly off-canvas left.
  - Measured bbox x -178, y 1528.6, 517×894.
  - **Hidden on mobile.**
- **Copy** block: `margin: 278 auto 90 345; width: 540`. Mobile: `margin: 60 0 52` with 345 width.
  - Title `h1`: h3 token, blue01. Verbatim UI label "Founded in 2020" (3w). Mobile h4.
  - Location row:
    - h4 token, color blue05, `display: flex; gap: 10; margin-top: 18; margin-bottom: 25; align-items: center`
    - Pin icon `about-location-pin.svg`, 18×22 (mobile 16×20, mobile text h5 = 14/600)
    - Label "Philadelphia, PA"
  - Description `p`: bodyR, blue01. 66w, 7 lines at 1440 (10 at 390). Topic: "company mission and patient focus".
- **Photo marquee** (`Founded__Marquee`):
  - `display: flex`. Each copy group is `div{display: flex; flex-shrink: 0}`.
  - The group holds 3 team photos, each 548×370, `margin-right: 16; border-radius: 24; overflow: hidden`, object-fit cover.
  - **The images are people photos.** Use placeholders with the same box: desktop 548×370; mobile 345×233.
  - Copies: `ceil(innerWidth / ((548+16)*3)) + 1` (2 at 1440). Measured row y 2056.8, height 370.
  - Motion:
    - `set(marquee, {x: ci(345)})`. Mobile: x 0.
    - Timeline, delay 1:
      - `to(marquee, {x: -N, duration: (N + M) / 548 * 3.5, ease: "linear"})`
        - N = marquee parent's left offset: 0 at ≤1440, (vw-1440)/2 above that.
        - M = ci(345).
      - then `to(groups, {xPercent: -100, duration: 3.5 * 3, repeat: -1, ease: "linear"})`
    - The timeline starts at `timeScale(0)` and ramps up with `gsap.to(tl, {timeScale: 1, scrollTrigger: {trigger: marquee, start: "top bottom", end: "bottom bottom", scrub: 4}})`. It accelerates from stopped to full speed as it scrolls into view.
- Mobile: wrapper `padding-bottom: 95; border-radius: 0`.

### A.3 Anywhere (`sc-03-Anywhere__Wrapper`)
- Wrapper:
  - `position: relative; width: 1076; margin: 0 auto; padding: 200 0 400; display: grid; place-items: center; text-align: center; background: blue05`
  - Measured x 182, y 2573.8, 1076×1304.5
  - Tablet width 925; mobile width 345, `padding: 77 0 227`
- Content:
  - **Pill, white variant** (64×28).
  - Title `h1`: h2 token, silver05, margin-top 24. Multi-line TextAnimation (see CLONE_SPEC 0.5). 4w, 2 lines (878×187). Topic: "care from anywhere". Mobile h3.
  - Description `p`, wrapped in a TextAnimation fade:
    - bodyXL (42/500/130%/-1.68), base color lavender04, margin-top 83. 48w, 7 lines (1074 wide, 58.8px line boxes). Topic: "plug-and-play devices, logistics, APIs".
    - Mobile: h4 (24.96px at 390), margin-top 43, 13 lines.
    - **LineFillText**: FILL silver05, BASE lavender04; `scrollTrigger: {trigger: p, start: "top center", end: "bottom center", scrub: true}`.
- **Stethoscope** (`about-stethoscope.svg`, viewBox 854×477, blue05 fill and lavender04 stroke, fades out left via a gradient rect):
  - Wrapper `width: 853; position: absolute; right: 405; top: 859`; the svg is 100% wide
  - Tablet right 171; mobile `width: 333; right: 16; top: 543`
  - Float: `fromTo(wrap, {yPercent: -6}, {yPercent: 6, duration: 7, ease: "power2.inOut", repeat: -1, yoyo: true})`

### A.4 Leadership (`sc-04-Leadership__Wrapper`)
- Wrapper: `display: grid; place-items: center; padding-top: 111` (mobile 0). Measured y 3878, height 1062.
- Pill (white variant), then Title: h2 token silver05, margin-top 24, centered, multi-line TextAnimation. 3w, 1 line. Topic: "leadership team". Mobile h3.
- **People** row: `display: flex; gap: 60; margin-top: 78`. 3 cards, x 48 / 516 / 984.
- **Team grid: 3 people.** Use placeholders, not the real names or photos.
- Each **Person** card:
  - `width: 408; padding: 16; border-radius: 24; border: 1px solid lavender02 (#6563DA)`; transparent background (sits on blue05). Measured height 603.8.
  - Photo: `border-radius: 18; overflow: clip; isolation: isolate`; `img{object-position: center left}`; fills 374 wide. The photo heights in the source data are 360–374 (aspect of source image); use **374×374**.
  - NameRow: `display: flex; justify-content: space-between; align-items: center; margin-top: 16; margin-bottom: 20`
    - Name: h4 token, silver05
    - Role title: bodyL (17/600), silver05, margin-top 6. Role titles are "CEO", "COO", "CTO".
    - LinkedIn icon link: `about-linkedin.svg`, 36×36, white circle with blue05 glyph. It is an external link per person; point placeholders at `#`.
  - Description: h5/bodyM (14/600/144%/-0.56), color blue07 (#B1C3FC), padding-bottom 14. 24w/5L, 26w/4L and 33w/6L. Topic: "prior experience bio".
- **Tablet:**
  - People column, gap 51.
  - Person `display: flex; width: 925; gap: 48; align-items: center; padding-right: 150`; Photo 332×382.
  - At 768: 693.7 wide cards, 312.5 tall.
- **Mobile:**
  - People column, `gap: 40; margin-top: 38`; Person width 344; Photo 312×329; NameRow margin-top 48 (as authored).
  - At 390 the cards are 357.8 wide and about 579 tall.
- Details paragraph: margin-top 46, `width: 638`, bodyR silver05, centered, TextAnimation fade. 34w, 3L (mobile 7L, width 344). Topic: "team expertise and history".
- **Motion:** `gsap.from(people.children, {yPercent: 40, opacity: 0, duration: 1, ease: "power3.out", stagger: .1, scrollTrigger: {trigger: people, start: "top 75%"}})`. Plays once.

### A.5 Careers (`sc-05-Careers__Wrapper`)
- Wrapper:
  - `margin: 140 auto 14; width: 1340` (measured x 50, y 5080.5)
  - Tablet `margin: 205 auto 0; width: 924`; mobile `width: 344; margin: 65 auto 0`
- Card: `background: silver05 (#fff); padding: 100 0; display: grid; place-items: center; border-radius: 24`. Mobile padding 60 0. Measured 1340×646.3.
- Children:
  - **Large pulse** `about-large-pulse.svg` (viewBox 333×126; stroke lavender03 #876EEC, width 3, round caps), `width: 330` (mobile 260).
    - Motion: `timeline({repeat: -1}).fromTo("path", {drawSVG: "0 0"}, {drawSVG: "0 100%", ease: "linear", duration: .5}).to("path", {drawSVG: "100% 100%", ease: "linear", duration: .5}, 3.5)`
    - The line draws in left to right, holds about 3s, then erases from the left.
  - Title: h2 token, blue01, margin-top 40, multi-line TextAnimation. 3w, 1L. Topic: "careers heading". Mobile h4.
  - Description: bodyR, blue01, `margin-top: 27; width: 674; margin-bottom: 46; text-align: center`, TextAnimation fade. 18w, 2L. Topic: "diverse team, at-home care". Mobile `width: 270`, bodyM.
  - Primary button **"See Open Positions"** (218.2×63) → external `https://careers.impilo.health`.

### A.6 About at 1280 and 768
- 1280: purely fluid, no deviations.
- 768: tablet overrides as listed above. The hero pin is still active at 768x1024 (pin-spacer measured, 939 tall).

---

## I. `/integrations/`  (title "Impilo | integrations")

Document height is 8997 at 1440x900 and 8959 at 390. The sections stack with overlap:
- Hero: blue05, pinned.
- SDK: white panel, z 1, slides over the hero.
- Devices: blue02 panel, z 1, overlaps the SDK panel's last 100lvh.

### I.1 Hero (`section.sc-01-Hero__Wrapper`)
- Wrapper:
  - `width: 100%; min-height: 100vh; display: grid; place-items: center; padding-bottom: 200` (mobile 100)
  - Transparent, so the blue05 page shows through
- Inner: `max-width: 1440; padding: 50 50 0; text-align: center`, flex column with align center. Tablet max-width 1024; mobile max-width 500 with `padding: 0 23`.
- Title `h1`:
  - h1 token (124/600/92%/-4.96), silver05, `width: 1094; padding: 8; margin-bottom: 42`
  - 8w, 3 lines (1094×358). Topic: "transform RPM with SDK/API".
  - Tablet h2, width 924; mobile h3, width 329, margin-bottom 35 (5 lines at 390).
- ContentWrapper: flex column, align center, `margin-top: 53; gap: 20`. Tablet margin-top 62; mobile `margin-top: -15; gap: 28`.
  - Paragraph (TextAnimation fade): bodyR, silver05, `width: 710; padding: 8`. 39w, 4L. Topic: "simplifying RPM logistics for providers". Mobile width 329, padding 0, 7L.
  - Primary **"API Documentation"** → `https://docs.impiloplatform.com` (219.4×63), stacked above
  - Primary **"Request Demo"** → `/request-demo/` (184.6×63)
- **Motion:**
  - The pin helper pins the hero wrapper: `trigger: wrapper, start: "bottom bottom", end: "bottom top", pinSpacing: false`.
  - ParallaxOut moves `wrapper.children` (the Inner) to `y: -40vh`, linear, scrubbed over the same range.
  - Measured Inner translateY: -129.6 at scrollY 500 and -360 (= -40vh at 900) from about 1100 onward.
  - The heading itself has no SplitText.
- Note: the chunk defines unused hero-illustration and widget styled components. **They are not rendered**, so do not build them.

### I.2 SDK (`sc-03-Sdk__Wrapper`)
- Wrapper:
  - `background: silver05; border-radius: 24; padding-top: 232; padding-bottom: calc(100lvh + 250px); margin-bottom: -100lvh`
  - `text-align: center; display: grid; place-items: center; position: relative; z-index: 1`
  - `&::before{content: ""; position: absolute; top: 100%; left: 0; width: 100%; height: 24px; background: silver05}`
  - Measured y 1076, height 4496.2 at 1440x900
  - Tablet padding-top 151; mobile `padding-top: 100; padding-bottom: 180; margin-bottom: 0; border-radius: 24 24 0 0`
- Content:
  - **Pill** (default blue01).
  - Title: h2 token blue01, `margin-top: 16; max-width: 1111`. 4w, 1L. Topic: "why choose SDK/API". Mobile h3 (2L).
  - Description: bodyR blue01, `margin-top: 32; max-width: 576`. 38w, 4L. Topic: "API + mobile SDK device integration".
- **Cards** (`Sdk__Card` ×4):
  - `width: 860; min-height: 548; margin-top: 150; padding: 66 0 100; background: silver04 (#F4F4FB); border: 1px solid lavender04; border-radius: 24`
  - Flex column, center; `z-index: 1; position: relative; scroll-snap-stop: always`
  - Icon box 80×80. The source `<img>` is rendered at width 320, `margin: -120`, `scale: .25`. Use the existing icons at 80×80:
    - `solutions-support-heart.svg`
    - `solutions-support-lightbulb.svg`
    - `solutions-support-chat.svg`
    - `solutions-support-document.svg`
  - Card title: h3 token blue01, `margin-top: 35; max-width: 400` (2 lines). Titles, verbatim:
    1. "Quick & Easy Integration"
    2. "Real-Time Monitoring & Alerts"
    3. "Comprehensive Data Handling"
    4. "Customizable to Your Workflow"
  - Card description: bodyR blue01, `margin-top: 52; max-width: 461`. 28w/3L, 22w/3L, 21w/3L, 31w/4L. Topics: "reduce integration complexity", "real-time alerts", "secure compliant data", "tailor APIs to workflow".
- Closing line under the cards: bodyR, margin-top 32. 10w, 1L. Topic: "catalog of hundreds of devices".
- **Thermometer** (`solutions-support-thermo.svg`, 388×817):
  - `position: absolute; top: 1745; right: calc(50vw + 245px); width: 388; z-index: -1`; hidden on mobile
  - It is a ScrollSmoother `data-speed=".5"` element, so it moves at half the scroll speed.
  - Measured at 1440x900: `translateY = clamp(-858.5, 0.5*(scrollY - 1921), +858.5)`. The values were -858.5 at 0, -460 at 1000, +39 at 2000, +539 at 3000, and clamped at +858.5 by 4500.
  - Implement it as a scrubbed `y` tween with that range.
- **Card stack motion** (desktop and tablet, `"pin"` mode). Let `n = 4` and `m` = the 1-based index of each card.
  - Pin each card with `trigger: card, start: "center center", endTrigger: lastCard, end: "center center-=100vh", pinSpacing: false`.
  - For each card except the last: `to(card, {scale: 1 - .1*(n-m), yPercent: -11*(n-m), ease: "power1.inOut", scrollTrigger: {trigger: card, start: "center center", endTrigger: lastCard, end: "center center", scrub: true}})`.
  - Final measured states:

    | Card | scale | yPercent |
    |---|---|---|
    | 1 | .7 | -33 |
    | 2 | .8 | -22 |
    | 3 | .9 | -11 |

  - Native scroll (pinType "fixed") also applies, to every card: `to(card, {y: -40vh, ease: "linear", scrollTrigger: {trigger: lastCard, start: "center center", end: "center -50%", scrub: true}})`. At scrollY 4500, the cards are at y offsets of about -345 to -525.
- **Mobile:**
  - On touch devices, `(hover: none)` selects `"scroll"` mode:
    - The Cards container becomes a horizontal snap carousel: `width: 100vw; padding: 0 100vw; margin: 0 -100vw; display: flex; overflow: scroll; scroll-snap-type: x mandatory; gap: 10; align-items: stretch`, with the scrollbar hidden.
    - Cards: `width: 310; padding: 42 22.5 66; margin-top: 42; scroll-snap-align: center; flex-shrink: 0`. Title margin-top 26.
    - Per-card horizontal ScrollTriggers (scroller = the container):
      - `fromTo(card, {scale: .9, x: -ci(10)}, {scale: 1, x: 0, ease: "power3.inOut"})` from `"left right"` to `"center center"`
      - then `scale 1→.9, x 0→ci(10)` from `"center center"` to `"right left"`
    - "Nudge" hint: `timeline({scrollTrigger: {trigger: cards, start: "top center"}}).to(cards, {xPercent: -3, scale: .98, ease: "power3.out", duration: .2}).to(cards, {xPercent: 0, scale: 1, ease: "bounce.out", duration: .5})`. It restarts every 3s until the user has scrolled the first card off the left edge.
  - With hover-capable mobile width, the cards stack in a centered column instead (`flex-direction: column`). This is what the 390 capture shows.
  - In both mobile modes, the SDK section is not pinned. Instead the SDK wrapper is pinned `start: "bottom bottom", end: "bottom top", pinSpacing: false`, with ParallaxOut on its children.

### I.3 Devices (`sc-04-Devices__Wrapper`)
- Wrapper:
  - `background: blue02; color: silver05; text-align: center; display: grid; place-items: center; padding: 232 0 200; border-radius: 24; position: relative; z-index: 1; min-height: 100lvh`
  - Measured y 4672, height 3597.5
  - Tablet: flex column, align center, padding-bottom 148. Mobile: flex column, `padding: 100 0`.
- Content, top to bottom:
  1. Logo `logo-header.svg` (same impilo wordmark, silver04), `width: 70`.
  2. Title: h2, margin-top 16. 6w, 2L. Topic: "which devices integrate". Mobile h3.
  3. Description: bodyR, `width: 436; margin-top: 32; margin-bottom: 50`. 40w, 4L. Topic: "wide device range, request catalog". Mobile width 329.
  4. **Snippets** grid:
     - `grid-template-columns: repeat(2, 1fr); gap: 60 140; margin-top: 115`. Each column 290 wide (mobile 289); x 360 and 790.
     - Mobile: flex column, `gap: 28; margin-top: 60`.
     - Snippet title: bodyR, brightTurquoise (#72E6FF), padding-bottom 20. Titles "Bluetooth Devices" and "LTE Devices".
     - Snippet list: plain `ul` of bodyR silver05 `li`. Each line is 25.92 tall; no bullets, centered.
     - The left list has **31 device-brand names** (849.5 tall column) and the right list **9**. Use placeholder brand names with the same counts.
  5. **Laptop showcase** (I.4).
  6. Title3: h3, `margin-top: 16; padding-top: 16`. 6w, 1L. Topic: "how to use mobile SDK". Mobile h4.
  7. Description list: a 2-item `ul`, bodyR, width 436, margin 32 0 50. 6w and 6w. Topic: "embed in own app / use integration hub".
  8. Call: h2, `max-width: 1165; margin-top: 250; margin-bottom: 26`. 4w, 1L. Topic: "ready to start". Tablet margin 187 / 58; mobile h3, width 345, margin-top 94.
  9. Primary **"Request Demo"** → `/request-demo/`
  10. Description: bodyR, width 436, margin 32 0 50. 24w, 4L. Topic: "explore SDK documentation".
  11. Primary **"SDK & API Documentation"** → `https://docs.impiloplatform.com` (268.4×63)

### I.4 Laptop showcase (`Laptop__*`, desktop and tablet only)
- Wrapper: flex column, align center, `perspective: 3000px`. Measured x 165, 1110 wide.
- **LaptopTop**:
  - `display: grid; place-items: start center; transform-origin: bottom center; will-change: transform`; children stacked in `grid-area: 1/1`
  - Lid `solutions-laptop-top.svg` (viewBox 878×553), `width: 875`
  - Inside the lid: the screen AutoAnimate, `svg{margin-top: 27; width: 822; height: 482; border-radius: 7}`
  - Motion: `gsap.from(top, {rotateX: -80, ease: "linear", scrollTrigger: {trigger: wrapper, start: "top bottom", end: "center center", scrub: 3}})`. The lid opens from nearly closed.
- **LaptopBottom**: `solutions-laptop-bottom.svg`, `width: 1110; margin-top: -2`.
- **Panel**:
  - `margin-top: -173; width: 712; min-height: 320; padding: 0 22; background: blue02; border: 1px solid blue03; border-radius: 11; position: relative; z-index: 1`
  - Flex column, center, `gap: 17`
  - PanelTitle: bodyXL (42/500/130%), `white-space: nowrap`
  - PanelText: bodyM (14/600/144%), blue07, `width: 398`
  - Both are inside a "WideAutoAnimate" (`margin: -50vw; padding: 50vw; pointer-events: none`) so their cross-fades are not clipped.
- **Arrows**:
  - `margin-top: 18; gap: 18`, flex
  - Two 39×39 buttons using `solutions-laptop-arrow.svg`; Previous has `scale: -1`
  - They cycle through 3 slides; index wraps.
- **Slides** (screen SVG / title / text):
  1. `solutions-laptop-screen-readings.svg` / "Healthcare Providers" / 21w, 3L. Topic: "EHR-integrated RPM".
  2. `solutions-laptop-screen-details.svg` / "Medical Device Manufactures" (sic) / 14w. Topic: "build devices, we handle app".
  3. `solutions-laptop-screen-dashboard.svg` / "Health Tech Startups" / 45w. Topic: "scale with SDK, portal if no EHR".
- Cross-fade: AutoAnimate with `{opacity: 0, yPercent: undefined}`, 1s `power3.inOut`. The screen, title and text all swap together.
- **Mobile:**
  - No laptop or arrows. Render 3 stacked `Laptop__Panel`s: no border, `margin-bottom: 90` except the last.
  - Each panel has PanelImage `svg{width: 345; height: 202; border-radius: 10}`, then PanelTitle (h4, `margin: 6 0 17`, width 345), then PanelText (bodyM, width 340, blue07).

### I.5 Integrations at 1280 and 768
- 1280: fluid.
- 768:
  - Hero title is h2 (69px at 768); SDK title 69px.
  - Cards 645×411 and still pinned.
  - Snippets grid is 2×217.5 with gap 45/105.
  - Laptop still shown (lid 656 wide).

---

## R. `/request-demo/`  (title "Impilo | Request a Demo")

**Form provider:** not an embedded HubSpot form. It is a custom React form built with Radix `@radix-ui/react-form` and `@radix-ui/react-select`.
- The original posts JSON to the site's own `/api/submission` with a Google reCAPTCHA Enterprise token and the `hubspotutk` cookie. Its data attributes are `data-portal-id="41362896"` and `data-form-id="4e914cca-..."`.
- **The clone must render a static look-alike:**
  - no reCAPTCHA
  - no HubSpot scripts
  - no fetch
  - `onSubmit` = `preventDefault()`
- You may show the local success state for demo purposes.
- During my measurement, invalid submits produced no network POST.

Document height is 1769 at 1440, 2156 at 390.

### R.1 Panel layout (`request-demo__Wrapper`)
- `width: 1340; min-height: 760; margin: 25 auto 0; padding: 60 60 78; background: blue01 (#161658); border-radius: 24; color: silver05`
- `display: flex; justify-content: space-between`
- Measured x 50, y 122.5 (header is 97.5), 1340×919.9.
- **Left column** (`request-demo__Left`): flex column, `align-items: start`, 500 wide, fills the height.
  - Pulse mark `<img>`, `height: 78; width: auto` (159×78). It is the white impilo pulse; reuse `pill-logo.svg`.
  - Title `h1`:
    - h1 token (124/600/92%/-4.96), silver05
    - `margin-top: 24; padding-bottom: 32; margin-bottom: 26; max-width: 500; border-bottom: 1px solid blue02`
    - Label "Schedule a Demo", 2 lines, 500×261
  - Subtitle `p`: h4 token (24/500/92%/-0.96), blue07, max-width 500. 14w, 2L. Topic: "basic info then calendar".
  - **Legal note** (desktop only in this column):
    - bodyXS (12/600/92%/-0.48), color blue03 (#4846BF), `margin-top: auto` (sits at the bottom, measured y 953)
    - `justify-self: end`; links `text-decoration: underline`
    - Structure: "This site is protected by reCAPTCHA and the Google [Privacy Policy] and [Terms of Service] apply."
    - This is boilerplate. The links point to policies.google.com (see External links). In the clone, either drop the note or keep it as non-functional text, since there is no reCAPTCHA.
- **Right column:** AutoAnimate wrapper (`padding: 1em; margin: -1em`), then the form.

### R.2 Form (`request-demo__FormWrapper`)
- `display: grid; gap: 20; width: 550` (x 780, y 182.5); `transition: opacity .2s ease`. While submitting, `opacity: .5`.
- Field order:

  | # | Control | Name | Placeholder |
  |---|---|---|---|
  | 1 | Input | name | "Full Name*" |
  | 2 | Input | phone | "Phone Number*" |
  | 3 | Input, `type=email` | email | "Email Address*" |
  | 4 | Input | company | "Name of Company*" |
  | 5 | Select | referral | "How did you hear about us?*" |
  | 6 | TextArea | comments | "Anything else you want us to know?" (optional) |
  | 7 | empty `<div>` | | (acts as a spacer row, 0 tall plus gap) |
  | 8 | SubmitRow | | |

  - Rows 1–5 are required; the `*` is appended to the placeholder.
  - Conditional rows inserted right after the Select:
    - value "conference" adds a required Input `conference`, placeholder "Which conference?*"
    - value "other" adds an optional Input `other`, placeholder "How did you hear about us?"
- **Input__Field** (wrapper):
  - `display: flex; align-items: center; gap: 8; width: 550; height: 66; padding: 0; border-radius: 12; border: 1px solid blue03; background: blue02 (#232265); transition: border-color .2s ease`
  - Tablet width 100%; mobile width 297 (308.9×68.6 at 390)
- **Input__Control:**
  - h4 token (24/500/92%/-0.96; mobile bodyR 18/500/144%)
  - `display: block; height: 100%; width: 100%; padding: 0 21; color: silver05; border-radius: 12; background: transparent`
  - `::placeholder{color: blue07}`; `:focus{outline: none}`
  - `:autofill` (and 1Password-filled): `color: blue01; background: blue07`
- **States:**
  - Default: border blue03.
  - **Hover:** border blue04 (#524FD9). Measured.
  - **Focus:** no outline or ring. The field keeps its hover border while the pointer is over it, the caret and text are silver05, and nothing else changes. There is no focus-within style.
  - **Error** (`[data-invalid]` on the field after a submit attempt): border brightTurquoise (#72E6FF).
    - A message element appears **inside the field, right-aligned after the input**: kickerS (13/600/144%/+0.26, uppercase), brightTurquoise, `padding: 0 21 0 10`. Measured 94×18.7, right edge at the field's inner right.
    - Text "Required" (`valueMissing`) or "Invalid" (`typeMismatch`, or an email without `@…`).
- **Select trigger** (`ReferralDropdown__Trigger`, Radix Select):
  - Same box as Input__Field (550×66, radius 12, 1px blue03, blue02 background), `padding: 0 20`, h4 type, `cursor: pointer`, flex with gap 8
  - The value or placeholder has `margin-right: auto`. While showing the placeholder (`[data-placeholder]`), color is blue07; after a choice, silver05.
  - Chevron: `icon-chevron-down.svg` (viewBox 18×11), `width: 18` (mobile 16), `transition: scale .2s ease`, `scale: 1 -1` while open.
  - Hover: border blue04. Invalid: border brightTurquoise, and the "REQUIRED" message sits between the label and the chevron (padding `0 18 0 10`).
- **Select content** (popper):
  - `position: popper; side: bottom; sideOffset: ci(8)`; `width: var(--radix-select-trigger-width)`; `z-index: 2`
  - `border-radius: 12; background: blue02; color: silver05; border: 1px solid blue03; overflow: clip`
  - Measured 550×295.5 at 1440, opening 8px below the trigger.
  - Items:
    - Labels: "LinkedIn", "Conference", "Word of Mouth/Referral", "Google", "Impilo Employee", "Other"
    - bodyR 18/500/144%, silver05, `padding: 11 22`; first item padding-top 14, last item padding-bottom 14 (heights 50.9 / 47.9 / … / 50.9)
    - `cursor: pointer; transition: background .2s ease`
    - Hover/highlight: `background: #16165855` (blue01 at 33% alpha; measured rgba(22,22,88,.333)); no outline
  - There is no open/close animation beyond the Radix default (none).
- **TextArea__Field:** same as Input__Field but `height: 249`. Control: bodyM (14/600/144%/-0.56), `padding: 22`, silver05, placeholder blue07, `word-wrap: break-word`, outline none.
- **SubmitRow:** `display: flex; justify-content: space-between; align-items: center; width: 100%`.
  - The Primary button is rendered as a `<button type="submit">`: "Submit Information", 216.9×63 at x 780. Hover is the standard Primary roll.
- **Success state** (AutoAnimate swap of the form):
  - SuccessMessage: h4 token, silver05, flex column, align center, `white-space: nowrap`
  - Image `request-demo-form-plane.webp` (paper plane; 627×629 asset), `313×313; margin: 44 0 48`
  - Then a one-line confirmation (11w; topic "message sent, will be in touch")
  - Tablet: width 852, plane margin 94 0 33. Mobile: wraps and centers; plane `width: 280; margin: 30 15 10 0`.
- **Error state:** ErrorMessage above the form: h4 token, brightTurquoise, `width: 400; line-height: 1.2; margin-bottom: 20`. 21w with an "email us." mailto link (underlined). Topic: "something went wrong, retry".

### R.3 Tablet and mobile
- **Tablet (768):**
  - Wrapper `width: 924; display: block; padding: 60 36 78; min-height: 1074`
  - Title h2 with no border, `padding-bottom: 0; margin-bottom: 24; max-width: unset`
  - Subtitle `border-bottom: 1px solid blue02; padding-bottom: 32; margin-bottom: 27; height: 76`
  - Form `width: 852`; last child (SubmitRow) `place-self: end`
  - The legal note moves **into the SubmitRow** (left, `margin-top: unset`), with the button on the right.
  - Measured at 768: panel 693×924.9, title 69px on 1 line.
- **Mobile (390):**
  - Wrapper `width: 345; display: block; padding: 36 24 60` (358.8 wide at 390, y 143.5)
  - Title h3, no border, margin-bottom 24 (2 lines)
  - Subtitle bodyL (17/600/100%), height 83 (5 lines)
  - Form width 297
  - SubmitRow `flex-direction: column-reverse; gap: 32; text-align: center; button{width: 100%}`, so the legal note is below a full-width button
- **Motion:** nothing scroll-driven on this page. Only AutoAnimate swaps and the hover and border transitions.

---

## L. Legal template: `/terms/`, `/privacy/`, `/app-privacy/`
Confirmed: one shared template, `Legal__Wrapper` plus `Legal__Content`, identical styles in all three chunks. There is no motion.

### L.1 Template
- `Legal__Wrapper`:
  - `background: silver05 (#fff); padding: 96 0; border-radius: 24; margin-top: 50`
  - Measured y 163 = header 113 + 50; full width
  - Mobile `margin-top: 0`, padding 96 → 99.84 at 390
- `Legal__Content`:
  - `width: 1114; margin: 0 auto; color: blue01`; bodyR (18/500/144%/-0.72) for everything except h1
  - Tablet width 697 (522.7 at 768); mobile width 344
- Rich-text rules:
  - `a{text-decoration: underline; color: blue06 (#2F6BEE)}`
  - `h1{` h3 token (46/600/92%/-1.84) `; margin-bottom: 35}`. It stays 46 design on mobile (47.84 at 390).
  - `h2{margin-top: 33}` in body type (bodyR, not bold). This is the company address block: 3 lines separated by `<br>`.
  - `p{margin: 28 0}`
  - `li{list-style-type: decimal; padding-left: 5; margin-left: 20}`
  - `ol > ol > li{list-style-type: lower-alpha; margin-left: 50}`
  - Nested `ul > li` also inherit `decimal` (app-privacy uses them).
- Page bottom: the white card ends and the footer spacer follows. The card has full radius 24 on all corners.

### L.2 Content outlines (placeholder copy should match these sizes)
**Terms** ("Impilo | Terms of Service"; doc height 2876 / 5724 at 390):
- h1: 3w (page title "Terms of Service" is a UI label).
- h2: address block, 11w, 3L.
- p: 42w/2L and 33w/2L. Topics: "agreement scope" and "acceptance by use".
- `ol` with 13 numbered sections. Each has a 1–6w title li and a nested `ol` (lower-alpha) of 1–4 items. Item sizes (w/L):
  1. 2 items (10/1, 11/1). One link is `https://www.impilo.health`.
  2. 3 items (29/2, 16/1, 37/2)
  3. 2 items (34/2, 45/3)
  4. 4 items (19/1, 46/3, 19/1, 22/2)
  5. 1 item (45/3)
  6. 2 items (44/2, 35/2)
  7. 2 items (41/2, 45/2)
  8. 1 item (55/3)
  9. 1 item (29/2)
  10. 1 item (30/2)
  11. 1 item (39/2)
  12. 3 items (28/2, 15/1 with `mailto:support@impilo.health`, 26/2)

  At 1440 each item line is 25.92 tall with no extra spacing between list items.

**Privacy** ("Impilo | Privacy Policy"; 2304 / 4105):
- h1 2w; h2 address 15w/3L; p 30w/2L.
- 8 sections:
  1. 2 items (32/2, 27/2)
  2. 2 items (52/3, 25/2)
  3. 3 items (58/3, 30/2, 32/2)
  4. 1 item (39/2)
  5. 1 item (47/3)
  6. 1 item (50/3)
  7. 1 item (44/2)
  8. 2 items (19/1 with a mailto, 24/2)

**App privacy** (also titled "Impilo | Privacy Policy"; 2356 / 3465):
- h1 5w ("…Patient App Privacy Policy"); h2 address 11w/3L followed by an extra `<br>`; p 26w/2L.
- 9 numbered items, flatter than the other two pages:
  1. 2 sub-items, the first with a 2-item `ul` (1w, 2w)
  2. 31w with a 3-item list
  3. 43w
  4. 35w
  5. 58w with a 3-item `ul`
  6. 15w
  7. 36w
  8. 16w
  9. 23w
- No links in the body.

---

## E. 404 page (any unknown route; title "404: Not Found")
- The server returns HTTP 404 with the Gatsby 404 page. Document height is 1627 at 1440x900.
- `sc-404__Spacer`: `height: 48` (mobile 0). Then:
- `sc-404__Wrapper`:
  - h2 token, color blue02, `background: silver04 (#F4F4FB); width: 100%; text-align: center; display: grid; place-content: center; place-items: center`
  - `min-height: calc(100lvh - 161px); border-radius: 24; padding: 100`
  - Measured y 161, 1440×739
  - Mobile: `padding: 80 0`, h3 token, `min-height: calc(100lvh - 113px)` (726.5 tall at 390)
- Children:
  - **Pill** (default blue01)
  - `h1`: h2 type, `max-width: 722; margin-top: 16; margin-bottom: 56`. 10w in 4 lines (722×338.6), with a forced `<br>` after the first 2 words. Topic: "404 error, page does not exist". Mobile h3 (47.84px), 4 lines.
  - Primary **"Take You Back Home"** → `/` (229.5×63)
- No motion other than the Pill loop and the button hover.

---

## X. External links (href not on impilo.health)
Global header and footer links (Docs, Careers, Contact Us, phone, Linkedin) appear on every page and are already in CLONE_SPEC §1 and §11:
- "Docs" → https://docs.impiloplatform.com
- "Careers" → https://careers.impilo.health
- "Contact Us" → mailto:sales@impilo.health
- "(202) 838-5839" → tel:+12028385839
- "Linkedin" → https://www.linkedin.com/company/impilo-inc/

Page-body external links:

| Page | Label | href |
|---|---|---|
| /about/ | "See Open Positions" (button) | https://careers.impilo.health |
| /about/ | LinkedIn icon (×3, aria "LinkedIn of <name>") | linkedin.com/in/… (per person; use `#` for placeholders) |
| /integrations/ | "API Documentation" (hero button) | https://docs.impiloplatform.com |
| /integrations/ | "SDK & API Documentation" (button) | https://docs.impiloplatform.com |
| /request-demo/ | "Privacy Policy" (reCAPTCHA note) | https://policies.google.com/privacy |
| /request-demo/ | "Terms of Service" (reCAPTCHA note) | https://policies.google.com/terms |
| /request-demo/ | "email us." (error state only) | mailto:sales@impilo.health (`routes.contact`) |
| /terms/, /privacy/ | "www.impilo.health" | https://www.impilo.health (www subdomain, same site) |
| /terms/, /privacy/ | "support@impilo.health" | mailto:support@impilo.health |
| /404 | none | |

Third-party scripts seen on these pages, which the clone must **not** include:
- HubSpot: `js.hs-scripts.com/41362896.js`, web-interactives, collected-forms
- Google reCAPTCHA Enterprise
- Bing UET
- ZoomInfo (`zi-tag.js`)
- Clickagy

---

## M. Assets for these pages
New files downloaded to `public/assets/`:

| File | Use | Source |
|---|---|---|
| `svg/about-cert-iso.svg` | about hero badge, 100×100 | https://impilo.health/static/ISO.ebb86f9c.svg |
| `svg/about-cert-hipaa.svg` | " | /static/HIPAA.231d5bf8.svg |
| `svg/about-cert-hqaa.svg` | " | /static/HQAA.c446e179.svg |
| `svg/about-cert-soc2.svg` | " | /static/SOC.3bcc531e.svg |
| `svg/about-cert-fda.svg` | " (blue01 fill) | inline data-URI in about chunk |
| `svg/about-glucose-meter.svg` | Founded illustration (321×844 vb) | inline React SVG |
| `svg/about-stethoscope.svg` | Anywhere illustration (854×477 vb) | inline React SVG |
| `svg/about-location-pin.svg` | Founded location icon 18×22 | inline |
| `svg/about-linkedin.svg` | leader LinkedIn icon 36×36 | inline |
| `svg/about-large-pulse.svg` | Careers pulse line (333×126 vb, lavender03 stroke 3) | inline |
| `images/request-demo-form-plane.webp` | success-state paper plane, 627×629 | /static/0f5f…/abc99/FormPlane.webp |

Existing files to reuse. I checked these byte-for-byte or after normalizing; no new download was needed:
- `solutions-laptop-top.svg`, `solutions-laptop-bottom.svg`, `solutions-laptop-arrow.svg`
- `solutions-laptop-screen-readings.svg` (slide 1), `solutions-laptop-screen-details.svg` (slide 2), `solutions-laptop-screen-dashboard.svg` (slide 3)
- `solutions-support-thermo.svg` (integrations thermometer)
- `solutions-support-{heart,lightbulb,chat,document}.svg` (SDK card icons)
- `logo-header.svg` (integrations Devices logo, 70w)
- `pill-logo.svg` (request-demo pulse mark, white, 78 tall)
- `icon-chevron-down.svg` (select chevron)

Not downloaded, on purpose:
- 3 team photos in the about marquee (`1. Impilo team…webp` etc., 1439×972 sources)
- 3 leadership headshots (`josh.webp`, `pat.webp`, `david.webp`)

Use placeholders for these at the boxes given in A.2 and A.4.

## N. What could not be measured or is approximated
- **Thermometer parallax** on integrations: this is a ScrollSmoother `data-speed` effect. The formula in I.2 is fitted from 9 scroll samples at 1440x900 (slope exactly 0.5, clamp ±858.5). At other viewport sizes, scale the clamp with the section geometry.
- **Card nudge loop and horizontal carousel** on integrations mobile only run on `(hover: none)` touch devices. They were read from source, not observed; my headless captures were hover-capable, so they show the stacked column.
- **reCAPTCHA, HubSpot submission and the success/error states** were read from source; I did not trigger them, to avoid submitting data. The default, hover, focus, error (validation) and dropdown-open states were all measured and screenshotted.
- The about leadership photo heights vary with the source image (360 vs 374). Use 374×374 placeholders.
