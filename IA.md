# impilo.health clone (React + Vite) at /, mirroring https://impilo.health/ plus 2 clone-only pages

Source: impilo.health clone (React + Vite) at /, mirroring https://impilo.health/ plus 2 clone-only pages
Status: **measured-from-codebase**
30 routes · 17 templates · 51 unique sections

> Generated from `ia.json` by `build.mjs`. Edit the JSON, not this file.

## Shape of the site

The largest 3 templates (Blog post, Use case, Legal document) account for 14 of 30 routes (47%). The remaining 16 routes span 14 templates.

| template | routes | share |
|---|---:|---:|
| Blog post | 6 | 20% |
| Use case | 5 | 17% |
| Legal document | 3 | 10% |
| Solution detail: short service page | 2 | 7% |
| Info page (clone-only) | 2 | 7% |
| Home | 1 | 3% |
| Solutions overview | 1 | 3% |
| Solution detail: platform | 1 | 3% |
| Solution detail: service page with stats | 1 | 3% |
| Solution detail: long service page | 1 | 3% |
| Solution detail: direct-to-patient | 1 | 3% |
| Use case: OEMs | 1 | 3% |
| About | 1 | 3% |
| Integrations | 1 | 3% |
| Request a demo | 1 | 3% |
| Blog index | 1 | 3% |
| 404 | 1 | 3% |

## Page chrome

**29 routes carry chrome = `full`** — Home, Solutions overview, Solution detail: platform, Solution detail: short service page, Solution detail: service page with stats, Solution detail: long service page, Solution detail: direct-to-patient, Use case, Use case: OEMs, About, Integrations, Legal document, Blog index, Blog post, Info page (clone-only), 404.

**1 routes carry chrome = `full, header CTA hidden`** — Request a demo.

## Sections by reuse

How widely a section is shared determines whether it belongs in a shared
component library or stays local to its page.

| section | category | templates | routes | implementation | scope |
|---|---|---:|---:|---|---|
| `shell.preloader` | SHELL | 17 | 30 | `src/components/Preloader.jsx` | Mounted in the shared Layout on all 30 routes; only visible on the first page load of a session. |
| `shell.header` | SHELL | 17 | 30 | `src/components/Header.jsx` | Every route; on /request-demo/ the desktop Request Demo button is hidden via a CSS rule. |
| `shell.page-transition` | SHELL | 17 | 30 | `src/components/PageTransition.jsx` | Mounted in the shared Layout on all 30 routes. |
| `shell.footer` | SHELL | 17 | 30 | `src/components/Footer.jsx` | Every route, via the shared Layout and FooterSpacer. |
| `hero.content` | HERO | 7 | 12 | `src/components/content/ContentHero.jsx` | All 12 solution and use-case detail pages. |
| `proof.hero-stats` | PROOF | 5 | 9 | `src/components/content/StatsRow.jsx` | 9 of the 12 detail pages (absent on digital-health-logistics, clinic-rpm, support-crm). |
| `conversion.cta-row-dark` | CONVERSION | 3 | 7 | `src/components/content/CtaRow.jsx` | impilo-platform plus all 6 use-case pages, 7 routes in total. |
| `content.capabilities-carousel-dark` | CONTENT | 2 | 6 | `src/components/content/CapabilitiesCarousel.jsx` | All 6 use-case pages. |
| `content.outcomes-light` | CONTENT | 2 | 6 | `src/components/content/Grids.jsx > OutcomesList + src/components/content/CtaRow.jsx` | All 6 use-case pages. |
| `editorial.post-header` | EDITORIAL | 1 | 6 | `src/pages/blog/BlogPost.jsx + src/components/blog/PostMeta.jsx` | Every blog post route. |
| `editorial.post-body` | EDITORIAL | 1 | 6 | `src/components/blog/RichText.jsx + src/components/blog/FileDownload.jsx` | Every blog post route. |
| `editorial.post-share` | EDITORIAL | 1 | 6 | `src/components/blog/Share.jsx` | Every blog post route. |
| `editorial.post-related` | EDITORIAL | 1 | 6 | `src/components/blog/SmallCard.jsx` | Every blog post route. |
| `content.problem-solution-light` | CONTENT | 1 | 5 | `src/components/content/Grids.jsx > TextItemGrid + src/components/content/CtaRow.jsx` | The 5 use-case pages other than OEMs. |
| `content.text-items-light` | CONTENT | 4 | 4 | `src/components/content/Grids.jsx > TextItemGrid` | 4 solution pages: impilo-platform, tech-enabled-services, direct-to-patient, support-crm. |
| `content.icon-cards-light` | CONTENT | 3 | 4 | `src/components/content/Grids.jsx > IconCardGrid` | 4 solution pages: digital-health-logistics, tech-enabled-services, clinic-rpm, support-crm. |
| `content.text-items-dark` | CONTENT | 3 | 4 | `src/components/content/Grids.jsx > TextItemGrid` | 4 solution pages: digital-health-logistics, tech-enabled-services, clinic-rpm, support-crm. |
| `conversion.closing-cta-dark` | CONVERSION | 3 | 3 | `src/components/content/CallToAction.jsx` | tech-enabled-services, direct-to-patient and support-crm. |
| `conversion.cta-band` | CONVERSION | 2 | 3 | `src/components/Cta.jsx` | Homepage plus the 2 clone-only info pages, 3 routes in total. |
| `content.legal-document` | CONTENT | 1 | 3 | `src/pages/Legal.jsx` | The 3 legal routes. |
| `content.bordered-cards-light` | CONTENT | 2 | 2 | `src/components/content/Grids.jsx > BorderedCardGrid` | impilo-platform and direct-to-patient. |
| `conversion.closing-cta-light` | CONVERSION | 1 | 2 | `src/components/content/CallToAction.jsx` | digital-health-logistics and clinic-rpm. |
| `hero.info` | HERO | 1 | 2 | `src/pages/InfoPage.jsx` | The 2 clone-only info pages. |
| `content.info-cards` | CONTENT | 1 | 2 | `src/pages/InfoPage.jsx > Card` | The 2 clone-only info pages. |
| `hero.home` | HERO | 1 | 1 | `src/components/Hero.jsx` | Homepage only. |
| `features.home-focus` | FEATURES | 1 | 1 | `src/components/Focus.jsx` | Homepage only. |
| `features.home-how-it-works` | FEATURES | 1 | 1 | `src/components/HowItWorks.jsx` | Homepage only. |
| `proof.compliance-badges` | PROOF | 1 | 1 | `src/components/WhiteGlove.jsx` | Homepage only. |
| `proof.partner-logos` | PROOF | 1 | 1 | `src/components/Trusted.jsx` | Homepage only. |
| `proof.article-carousel` | PROOF | 1 | 1 | `src/components/Articles.jsx` | Homepage only. |
| `features.home-integrations` | FEATURES | 1 | 1 | `src/components/Integrations.jsx` | Homepage only. |
| `hero.solutions` | HERO | 1 | 1 | `src/components/solutions/SolutionsHero.jsx` | /solutions/ only. |
| `features.solutions-explore` | FEATURES | 1 | 1 | `src/components/solutions/Explore.jsx` | /solutions/ only. |
| `features.solutions-support` | FEATURES | 1 | 1 | `src/components/solutions/Support.jsx` | /solutions/ only. |
| `features.solutions-platform` | FEATURES | 1 | 1 | `src/components/solutions/Platform.jsx > SolutionsLaptop` | /solutions/ only. |
| `features.solutions-api` | FEATURES | 1 | 1 | `src/components/solutions/ApiPlatform.jsx` | /solutions/ only. |
| `content.bordered-cards-dark` | CONTENT | 1 | 1 | `src/components/content/Grids.jsx > BorderedCardGrid` | direct-to-patient only. |
| `content.two-column-dark` | CONTENT | 1 | 1 | `src/components/content/Grids.jsx > TwoColumnGrid` | impilo-platform only. |
| `hero.about` | HERO | 1 | 1 | `src/components/about/AboutHero.jsx` | /about/ only. |
| `content.about-founded` | CONTENT | 1 | 1 | `src/components/about/Founded.jsx` | /about/ only. |
| `content.about-anywhere` | CONTENT | 1 | 1 | `src/components/about/Anywhere.jsx` | /about/ only. |
| `proof.leadership` | PROOF | 1 | 1 | `src/components/about/Leadership.jsx` | /about/ only. |
| `conversion.about-careers` | CONVERSION | 1 | 1 | `src/components/about/Careers.jsx` | /about/ only. |
| `hero.integrations` | HERO | 1 | 1 | `src/components/integrations/IntegrationsHero.jsx` | /integrations/ only. |
| `features.integrations-sdk` | FEATURES | 1 | 1 | `src/components/integrations/Sdk.jsx` | /integrations/ only. |
| `features.integrations-devices` | FEATURES | 1 | 1 | `src/components/integrations/Devices.jsx > shared/LaptopShowcase` | /integrations/ only. |
| `conversion.demo-form` | CONVERSION | 1 | 1 | `src/components/requestDemo/DemoForm.jsx` | /request-demo/ only. |
| `editorial.blog-featured` | EDITORIAL | 1 | 1 | `src/components/blog/LargeCard.jsx` | Blog index only. |
| `editorial.blog-grid` | EDITORIAL | 1 | 1 | `src/components/blog/CardGrid.jsx + src/components/blog/SmallCard.jsx` | Blog index only. |
| `editorial.blog-sidebar` | EDITORIAL | 1 | 1 | `src/components/blog/SearchBar.jsx + src/components/blog/EmailInput.jsx + src/components/blog/Categories.jsx` | Blog index only. |
| `content.not-found` | CONTENT | 1 | 1 | `src/pages/NotFound.jsx` | Catch-all 404 for any unknown path. |

**15 shared sections** appear in more than one template and belong in a component library.

**36 single-use sections** appear in exactly one template. Building these
as "reusable" components up front would be speculative — keep them page-local
until a second caller actually appears.

## Templates

### Home — `template.home`

1 route · `/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.preloader` | shared ×17 |
| 2 | SHELL | `shell.page-transition` | shared ×17 |
| 3 | SHELL | `shell.header` | shared ×17 |
| 4 | HERO | `hero.home` | page-local |
| 5 | FEATURES | `features.home-focus` | page-local |
| 6 | FEATURES | `features.home-how-it-works` | page-local |
| 7 | PROOF | `proof.compliance-badges` | page-local |
| 8 | PROOF | `proof.partner-logos` | page-local |
| 9 | PROOF | `proof.article-carousel` | page-local |
| 10 | FEATURES | `features.home-integrations` | page-local |
| 11 | CONVERSION | `conversion.cta-band` | shared ×2 |
| 12 | SHELL | `shell.footer` | shared ×17 |

### Solutions overview — `template.solutions-overview`

1 route · `/solutions/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.preloader` | shared ×17 |
| 2 | SHELL | `shell.page-transition` | shared ×17 |
| 3 | SHELL | `shell.header` | shared ×17 |
| 4 | HERO | `hero.solutions` | page-local |
| 5 | FEATURES | `features.solutions-explore` | page-local |
| 6 | FEATURES | `features.solutions-support` | page-local |
| 7 | FEATURES | `features.solutions-platform` | page-local |
| 8 | FEATURES | `features.solutions-api` | page-local |
| 9 | SHELL | `shell.footer` | shared ×17 |

### Solution detail: platform — `template.solution-platform`

1 route · `/solutions/impilo-platform/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.preloader` | shared ×17 |
| 2 | SHELL | `shell.page-transition` | shared ×17 |
| 3 | SHELL | `shell.header` | shared ×17 |
| 4 | HERO | `hero.content` | shared ×7 |
| 5 | PROOF | `proof.hero-stats` | shared ×5 |
| 6 | CONTENT | `content.bordered-cards-light` | shared ×2 |
| 7 | CONTENT | `content.two-column-dark` | page-local |
| 8 | CONTENT | `content.text-items-light` | shared ×4 |
| 9 | CONVERSION | `conversion.cta-row-dark` | shared ×3 |
| 10 | SHELL | `shell.footer` | shared ×17 |

### Solution detail: short service page — `template.solution-service-short`

2 routes · `/solutions/digital-health-logistics/`, `/solutions/clinic-rpm/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.preloader` | shared ×17 |
| 2 | SHELL | `shell.page-transition` | shared ×17 |
| 3 | SHELL | `shell.header` | shared ×17 |
| 4 | HERO | `hero.content` | shared ×7 |
| 5 | CONTENT | `content.icon-cards-light` | shared ×3 |
| 6 | CONTENT | `content.text-items-dark` | shared ×3 |
| 7 | CONVERSION | `conversion.closing-cta-light` | page-local |
| 8 | SHELL | `shell.footer` | shared ×17 |

### Solution detail: service page with stats — `template.solution-service-stats`

1 route · `/solutions/tech-enabled-services/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.preloader` | shared ×17 |
| 2 | SHELL | `shell.page-transition` | shared ×17 |
| 3 | SHELL | `shell.header` | shared ×17 |
| 4 | HERO | `hero.content` | shared ×7 |
| 5 | PROOF | `proof.hero-stats` | shared ×5 |
| 6 | CONTENT | `content.icon-cards-light` | shared ×3 |
| 7 | CONTENT | `content.text-items-dark` | shared ×3 |
| 8 | CONTENT | `content.text-items-light` | shared ×4 |
| 9 | CONVERSION | `conversion.closing-cta-dark` | shared ×3 |
| 10 | SHELL | `shell.footer` | shared ×17 |

### Solution detail: long service page — `template.solution-service-long`

1 route · `/solutions/support-crm/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.preloader` | shared ×17 |
| 2 | SHELL | `shell.page-transition` | shared ×17 |
| 3 | SHELL | `shell.header` | shared ×17 |
| 4 | HERO | `hero.content` | shared ×7 |
| 5 | CONTENT | `content.icon-cards-light` | shared ×3 |
| 6 | CONTENT | `content.text-items-dark` | shared ×3 |
| 7 | CONTENT | `content.text-items-light` | shared ×4 |
| 8 | CONVERSION | `conversion.closing-cta-dark` | shared ×3 |
| 9 | SHELL | `shell.footer` | shared ×17 |

### Solution detail: direct-to-patient — `template.solution-direct`

1 route · `/solutions/direct-to-patient/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.preloader` | shared ×17 |
| 2 | SHELL | `shell.page-transition` | shared ×17 |
| 3 | SHELL | `shell.header` | shared ×17 |
| 4 | HERO | `hero.content` | shared ×7 |
| 5 | PROOF | `proof.hero-stats` | shared ×5 |
| 6 | CONTENT | `content.bordered-cards-light` | shared ×2 |
| 7 | CONTENT | `content.bordered-cards-dark` | page-local |
| 8 | CONTENT | `content.text-items-light` | shared ×4 |
| 9 | CONVERSION | `conversion.closing-cta-dark` | shared ×3 |
| 10 | SHELL | `shell.footer` | shared ×17 |

### Use case — `template.use-case`

5 routes · `/use-cases/virtual-care-companies/`, `/use-cases/physicians-and-provider-groups/`, `/use-cases/health-plans-and-payers/`, `/use-cases/health-systems-and-msos/`, `/use-cases/value-based-care/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.preloader` | shared ×17 |
| 2 | SHELL | `shell.page-transition` | shared ×17 |
| 3 | SHELL | `shell.header` | shared ×17 |
| 4 | HERO | `hero.content` | shared ×7 |
| 5 | PROOF | `proof.hero-stats` | shared ×5 |
| 6 | CONTENT | `content.problem-solution-light` | page-local |
| 7 | CONTENT | `content.capabilities-carousel-dark` | shared ×2 |
| 8 | CONTENT | `content.outcomes-light` | shared ×2 |
| 9 | CONVERSION | `conversion.cta-row-dark` | shared ×3 |
| 10 | SHELL | `shell.footer` | shared ×17 |

### Use case: OEMs — `template.use-case-oems`

1 route · `/use-cases/oems/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.preloader` | shared ×17 |
| 2 | SHELL | `shell.page-transition` | shared ×17 |
| 3 | SHELL | `shell.header` | shared ×17 |
| 4 | HERO | `hero.content` | shared ×7 |
| 5 | PROOF | `proof.hero-stats` | shared ×5 |
| 6 | CONTENT | `content.outcomes-light` | shared ×2 |
| 7 | CONTENT | `content.capabilities-carousel-dark` | shared ×2 |
| 8 | CONVERSION | `conversion.cta-row-dark` | shared ×3 |
| 9 | SHELL | `shell.footer` | shared ×17 |

### About — `template.about`

1 route · `/about/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.preloader` | shared ×17 |
| 2 | SHELL | `shell.page-transition` | shared ×17 |
| 3 | SHELL | `shell.header` | shared ×17 |
| 4 | HERO | `hero.about` | page-local |
| 5 | CONTENT | `content.about-founded` | page-local |
| 6 | CONTENT | `content.about-anywhere` | page-local |
| 7 | PROOF | `proof.leadership` | page-local |
| 8 | CONVERSION | `conversion.about-careers` | page-local |
| 9 | SHELL | `shell.footer` | shared ×17 |

### Integrations — `template.integrations`

1 route · `/integrations/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.preloader` | shared ×17 |
| 2 | SHELL | `shell.page-transition` | shared ×17 |
| 3 | SHELL | `shell.header` | shared ×17 |
| 4 | HERO | `hero.integrations` | page-local |
| 5 | FEATURES | `features.integrations-sdk` | page-local |
| 6 | FEATURES | `features.integrations-devices` | page-local |
| 7 | SHELL | `shell.footer` | shared ×17 |

### Request a demo — `template.request-demo`

1 route · `/request-demo/` · chrome: **full, header CTA hidden**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.preloader` | shared ×17 |
| 2 | SHELL | `shell.page-transition` | shared ×17 |
| 3 | SHELL | `shell.header` | shared ×17 |
| 4 | CONVERSION | `conversion.demo-form` | page-local |
| 5 | SHELL | `shell.footer` | shared ×17 |

### Legal document — `template.legal`

3 routes · `/terms/`, `/privacy/`, `/app-privacy/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.preloader` | shared ×17 |
| 2 | SHELL | `shell.page-transition` | shared ×17 |
| 3 | SHELL | `shell.header` | shared ×17 |
| 4 | CONTENT | `content.legal-document` | page-local |
| 5 | SHELL | `shell.footer` | shared ×17 |

### Blog index — `template.blog-index`

1 route · `/blog/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.preloader` | shared ×17 |
| 2 | SHELL | `shell.page-transition` | shared ×17 |
| 3 | SHELL | `shell.header` | shared ×17 |
| 4 | EDITORIAL | `editorial.blog-featured` | page-local |
| 5 | EDITORIAL | `editorial.blog-grid` | page-local |
| 6 | EDITORIAL | `editorial.blog-sidebar` | page-local |
| 7 | SHELL | `shell.footer` | shared ×17 |

### Blog post — `template.blog-post`

6 routes · `/blog/:slug/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.preloader` | shared ×17 |
| 2 | SHELL | `shell.page-transition` | shared ×17 |
| 3 | SHELL | `shell.header` | shared ×17 |
| 4 | EDITORIAL | `editorial.post-header` | page-local |
| 5 | EDITORIAL | `editorial.post-body` | page-local |
| 6 | EDITORIAL | `editorial.post-share` | page-local |
| 7 | EDITORIAL | `editorial.post-related` | page-local |
| 8 | SHELL | `shell.footer` | shared ×17 |

### Info page (clone-only) — `template.info-page`

2 routes · `/developers/`, `/careers/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.preloader` | shared ×17 |
| 2 | SHELL | `shell.page-transition` | shared ×17 |
| 3 | SHELL | `shell.header` | shared ×17 |
| 4 | HERO | `hero.info` | page-local |
| 5 | CONTENT | `content.info-cards` | page-local |
| 6 | CONVERSION | `conversion.cta-band` | shared ×2 |
| 7 | SHELL | `shell.footer` | shared ×17 |

### 404 — `template.not-found`

1 route · `*` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.preloader` | shared ×17 |
| 2 | SHELL | `shell.page-transition` | shared ×17 |
| 3 | SHELL | `shell.header` | shared ×17 |
| 4 | CONTENT | `content.not-found` | page-local |
| 5 | SHELL | `shell.footer` | shared ×17 |

## Section reference

### SHELL

_Chrome mounted by the shared Layout on every route: preloader, header, page transition, footer._

**`shell.preloader`** — First-load overlay: 00→99 counter over the isometric graphic, slides away when loading finishes; never shown again on client-side navigation.

· Mounted in the shared Layout on all 30 routes; only visible on the first page load of a session. · appears on 30 routes · implemented by `src/components/Preloader.jsx`

**`shell.header`** — Non-sticky top bar: logo, 'Our Solutions' and 'Who We Serve' dropdowns, four text links, Request Demo button; hamburger + full-screen dialog menu at ≤500px.

· Every route; on /request-demo/ the desktop Request Demo button is hidden via a CSS rule. · appears on 30 routes · implemented by `src/components/Header.jsx`

**`shell.page-transition`** — Fixed blue overlay with pulse line that slides up over the old page on internal navigation (link click or browser back/forward) and away from the new one.

· Mounted in the shared Layout on all 30 routes. · appears on 30 routes · implemented by `src/components/PageTransition.jsx`

**`shell.footer`** — Fixed footer revealed under the page end: large logo, link columns, mailto/tel contacts, WebGL line field bending around a cursor-following white pill (canvas hidden on mobile).

· Every route, via the shared Layout and FooterSpacer. · appears on 30 routes · implemented by `src/components/Footer.jsx`

### HERO

_Page-opening block directly under the header._

**`hero.home`** — Homepage hero: headline with rotating word, line-art illustration with mouse parallax, dashboard mock that zooms from 862 to 1340px wide on scroll with rolling counters.

· Homepage only. · appears on 1 routes · implemented by `src/components/Hero.jsx`

**`hero.solutions`** — Solutions overview hero: bobbing line-art devices, four dashboard widget cards and a rolling weight counter; pins while the next section slides over it.

· /solutions/ only. · appears on 1 routes · implemented by `src/components/solutions/SolutionsHero.jsx`

**`hero.content`** — Blue01 content-page hero: centred title, subtitle, description and a primary button.

· All 12 solution and use-case detail pages. · appears on 12 routes · implemented by `src/components/content/ContentHero.jsx`

**`hero.about`** — About hero: large headline that fills white line by line as you scroll, pinned on desktop/tablet, with certification logos.

· /about/ only. · appears on 1 routes · implemented by `src/components/about/AboutHero.jsx`

**`hero.integrations`** — Integrations hero, pinned at its bottom with content drifting up, plus a half-speed thermometer parallax.

· /integrations/ only. · appears on 1 routes · implemented by `src/components/integrations/IntegrationsHero.jsx`

**`hero.info`** — Clone-only info hero: small pill, h2 headline with line reveal and a short intro.

· The 2 clone-only info pages. · appears on 2 routes · implemented by `src/pages/InfoPage.jsx`

### FEATURES

_Product explanation modules, mostly scroll-driven or illustrated._

**`features.home-focus`** — 'Keep scrolling' marquee pill plus a white panel that grows on scroll; its Request Demo button pins and docks to the top-right through the next section.

· Homepage only. · appears on 1 routes · implemented by `src/components/Focus.jsx`

**`features.home-how-it-works`** — Four pinned steps, each with text on the left and an animated SVG illustration in a pinned rounded frame on the right.

· Homepage only. · appears on 1 routes · implemented by `src/components/HowItWorks.jsx`

**`features.home-integrations`** — Three integration cards with floating layered illustrations and an 'Explore Our Integrations' button.

· Homepage only. · appears on 1 routes · implemented by `src/components/Integrations.jsx`

**`features.solutions-explore`** — Pulse line with a travelling dash, 2×2 illustration boxes with mouse parallax, cart hover bounce and a certification logo row; pins and drifts up 40vh.

· /solutions/ only. · appears on 1 routes · implemented by `src/components/solutions/Explore.jsx`

**`features.solutions-support`** — Four support cards that pin at the viewport centre and stack, scaling down and stepping up as the next covers them; thermometer parallax decoration.

· /solutions/ only. · appears on 1 routes · implemented by `src/components/solutions/Support.jsx`

**`features.solutions-platform`** — 3D laptop whose lid opens on scroll, with a 3-slide screen/title/text panel and prev/next arrows (1100ms throttle); stacked panels on mobile.

· /solutions/ only. · appears on 1 routes · implemented by `src/components/solutions/Platform.jsx > SolutionsLaptop`

**`features.solutions-api`** — API platform block: 2×2 grid of icon feature cards with a link to the internal /developers/ page.

· /solutions/ only. · appears on 1 routes · implemented by `src/components/solutions/ApiPlatform.jsx`

**`features.integrations-sdk`** — White SDK panel with 4 cards that pin, stack and shrink on scroll; horizontal snap carousel with a nudge hint on touch phones.

· /integrations/ only. · appears on 1 routes · implemented by `src/components/integrations/Sdk.jsx`

**`features.integrations-devices`** — Dark devices panel: two device-name lists, a laptop whose lid opens on scroll, and a 3-slide crossfade carousel.

· /integrations/ only. · appears on 1 routes · implemented by `src/components/integrations/Devices.jsx > shared/LaptopShowcase`

### PROOF

_Trust signals: stats, compliance badges, partner logos, leadership, article teasers._

**`proof.compliance-badges`** — White Glove block: intro text plus HIPAA and SOC 2 badges that swap from gray to colour on hover.

· Homepage only. · appears on 1 routes · implemented by `src/components/WhiteGlove.jsx`

**`proof.partner-logos`** — Four partner logos with an oval hover effect; deliberately non-clickable (no outbound links).

· Homepage only. · appears on 1 routes · implemented by `src/components/Trusted.jsx`

**`proof.article-carousel`** — Three-article carousel with prev/next arrows and horizontal slide; links point at internal /blog/ posts.

· Homepage only. · appears on 1 routes · implemented by `src/components/Articles.jsx`

**`proof.hero-stats`** — Row of three short stat claims under the content-page hero.

· 9 of the 12 detail pages (absent on digital-health-logistics, clinic-rpm, support-crm). · appears on 9 routes · implemented by `src/components/content/StatsRow.jsx`

**`proof.leadership`** — Leadership grid of 3 cards: headshot, name, role, short bio, unlinked LinkedIn icon; staggered entrance.

· /about/ only. · appears on 1 routes · implemented by `src/components/about/Leadership.jsx`

### CONTENT

_Substantive body sections of a route._

**`content.bordered-cards-light`** — Light section with a title and a grid of bordered text cards.

· impilo-platform and direct-to-patient. · appears on 2 routes · implemented by `src/components/content/Grids.jsx > BorderedCardGrid`

**`content.bordered-cards-dark`** — Dark section with a title and a grid of bordered text cards (lavender04 border, as measured on the original).

· direct-to-patient only. · appears on 1 routes · implemented by `src/components/content/Grids.jsx > BorderedCardGrid`

**`content.icon-cards-light`** — Light section with centred cards each led by a 48px icon; tighter 14/600 type on mobile.

· 4 solution pages: digital-health-logistics, tech-enabled-services, clinic-rpm, support-crm. · appears on 4 routes · implemented by `src/components/content/Grids.jsx > IconCardGrid`

**`content.two-column-dark`** — Dark section with a two-column layout of headline columns and item lists.

· impilo-platform only. · appears on 1 routes · implemented by `src/components/content/Grids.jsx > TwoColumnGrid`

**`content.text-items-light`** — Light section with a grid of title + paragraph items (no card chrome).

· 4 solution pages: impilo-platform, tech-enabled-services, direct-to-patient, support-crm. · appears on 4 routes · implemented by `src/components/content/Grids.jsx > TextItemGrid`

**`content.text-items-dark`** — Dark section with a grid of title + paragraph items; title forced white (fixes the original's invisible blue-on-blue title on two pages).

· 4 solution pages: digital-health-logistics, tech-enabled-services, clinic-rpm, support-crm. · appears on 4 routes · implemented by `src/components/content/Grids.jsx > TextItemGrid`

**`content.problem-solution-light`** — Light use-case section: title + paragraph items followed by an inline button row.

· The 5 use-case pages other than OEMs. · appears on 5 routes · implemented by `src/components/content/Grids.jsx > TextItemGrid + src/components/content/CtaRow.jsx`

**`content.capabilities-carousel-dark`** — Dark section with a capabilities carousel: one card at a time, round white arrows and dots, 1s slide-out + fade, no autoplay.

· All 6 use-case pages. · appears on 6 routes · implemented by `src/components/content/CapabilitiesCarousel.jsx`

**`content.outcomes-light`** — Light section with a bulleted outcomes list (fixed 24px indent) followed by an inline button row.

· All 6 use-case pages. · appears on 6 routes · implemented by `src/components/content/Grids.jsx > OutcomesList + src/components/content/CtaRow.jsx`

**`content.about-founded`** — White 'Founded' panel with a horizontal office-photo marquee that speeds up as it scrolls into view.

· /about/ only. · appears on 1 routes · implemented by `src/components/about/Founded.jsx`

**`content.about-anywhere`** — Blue section with a line-fill paragraph and a floating stethoscope illustration.

· /about/ only. · appears on 1 routes · implemented by `src/components/about/Anywhere.jsx`

**`content.legal-document`** — White rounded card with a numbered legal outline (sections with lettered sub-items); placeholder text flagged at the top.

· The 3 legal routes. · appears on 3 routes · implemented by `src/pages/Legal.jsx`

**`content.info-cards`** — Clone-only numbered bordered card grid under a section title.

· The 2 clone-only info pages. · appears on 2 routes · implemented by `src/pages/InfoPage.jsx > Card`

**`content.not-found`** — Light rounded panel with the small pill, a 4-line heading and a 'Take You Back Home' button.

· Catch-all 404 for any unknown path. · appears on 1 routes · implemented by `src/pages/NotFound.jsx`

### CONVERSION

_Closing calls to action and forms._

**`conversion.cta-band`** — Centred closing band: large heading and a primary button; title/label/href are props (homepage defaults).

· Homepage plus the 2 clone-only info pages, 3 routes in total. · appears on 3 routes · implemented by `src/components/Cta.jsx`

**`conversion.cta-row-dark`** — Dark closing section: title and a button row (buttons only, no paragraph).

· impilo-platform plus all 6 use-case pages, 7 routes in total. · appears on 7 routes · implemented by `src/components/content/CtaRow.jsx`

**`conversion.closing-cta-light`** — Light closing block: title, short paragraph and a single button.

· digital-health-logistics and clinic-rpm. · appears on 2 routes · implemented by `src/components/content/CallToAction.jsx`

**`conversion.closing-cta-dark`** — Dark closing block: title, short paragraph and a single button.

· tech-enabled-services, direct-to-patient and support-crm. · appears on 3 routes · implemented by `src/components/content/CallToAction.jsx`

**`conversion.about-careers`** — White careers card with an animated pulse line and a button to the internal /careers/ page.

· /about/ only. · appears on 1 routes · implemented by `src/components/about/Careers.jsx`

**`conversion.demo-form`** — Request-demo panel with a custom form (text fields, textarea, custom dropdown with conditional fields, in-field REQUIRED/Invalid errors); submission is simulated locally, no network request.

· /request-demo/ only. · appears on 1 routes · implemented by `src/components/requestDemo/DemoForm.jsx`

### EDITORIAL

_Blog index and article blocks._

**`editorial.blog-featured`** — Featured post card: 920-wide cover, date and author line, h3 title, 'Read Article' pill.

· Blog index only. · appears on 1 routes · implemented by `src/components/blog/LargeCard.jsx`

**`editorial.blog-grid`** — 'Previous Articles' heading and a 3-column grid of 290×210 image cards with titles clamped to 3 lines; filtered and empty states.

· Blog index only. · appears on 1 routes · implemented by `src/components/blog/CardGrid.jsx + src/components/blog/SmallCard.jsx`

**`editorial.blog-sidebar`** — Sticky sidebar (40 from top): fuzzy search, newsletter signup with simulated submit, category pills driving ?category=.

· Blog index only. · appears on 1 routes · implemented by `src/components/blog/SearchBar.jsx + src/components/blog/EmailInput.jsx + src/components/blog/Categories.jsx`

**`editorial.post-header`** — Post opening: breadcrumb (desktop), 680-wide hero image, date and author line, h1 and category pills.

· Every blog post route. · appears on 6 routes · implemented by `src/pages/blog/BlogPost.jsx + src/components/blog/PostMeta.jsx`

**`editorial.post-body`** — Rich-text article body (p, h2 at body size, arrow-marker lists, blockquote bar, images, sup/sub); may embed the gated download form.

· Every blog post route. · appears on 6 routes · implemented by `src/components/blog/RichText.jsx + src/components/blog/FileDownload.jsx`

**`editorial.post-share`** — Sticky share column (120 from top): four 36px circle buttons with tooltips; X/LinkedIn/Facebook are non-navigating, Copy Link copies the URL; a row under the article on mobile.

· Every blog post route. · appears on 6 routes · implemented by `src/components/blog/Share.jsx`

**`editorial.post-related`** — Two related-article cards, or 'Recent Articles' when a post has none.

· Every blog post route. · appears on 6 routes · implemented by `src/components/blog/SmallCard.jsx`
