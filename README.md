# impilo.health clone: information architecture

`ia.json` is the only IA file to edit by hand. `IA.md` and `matrix.csv` are
generated from it and will be overwritten.

```bash
node validate.mjs   # hard invariants + reuse / scope notes
node build.mjs      # regenerates IA.md and matrix.csv
```

Run both after adding a route to `src/routes.jsx`, adding a page to
`src/data/contentPages.js` or `src/data/posts.js`, or changing which
components a page renders.

## What the data shows

- **30 routes, 17 templates, 51 sections.** 15 sections are shared across
  templates and 36 are page-local. The 4 shell sections (preloader, page
  transition, header, footer) sit on every route through the shared `Layout`.
  `/request-demo/` is the only route with different chrome: its header hides
  the Request Demo button.
- **The 12 solution and use-case detail pages are one component
  (`ContentPage.jsx`) but 7 distinct layouts.** The data in
  `src/data/contentPages.js` combines a shared kit of sections in different
  orders. `hero.content` covers all 12 pages and `proof.hero-stats` covers 9.
  The 5 use-case pages share one exact layout. OEMs drops the
  problem/solution block, and the solution pages vary page by page. Light and
  dark versions of the same grid are separate sections, because they render
  differently.
- **The heavy build work is in the single-route templates.** Blog post, Use
  case and Legal account for 14 of the 30 routes (47%). Home, `/solutions/`,
  `/about/` and `/integrations/` are one route each, but between them they
  carry 20 of the 36 page-local sections, nearly all of the scroll-pinned and
  GSAP-driven motion. Their sections should stay page-local until a second
  page needs them.
- **Some sections exist only in the clone.** `/developers/` and `/careers/`
  (`template.info-page`) replace links that pointed to other domains on the
  original. They reuse the homepage `conversion.cta-band` section, which is
  why it counts as shared.

## Notes on `validate.mjs` output

All hard invariants pass. The four "scope mentions N, computed M" notes are
correct as written, because the scope text quotes a larger set or a label, not
the route count. For example, `proof.hero-stats` is "9 of the 12 detail
pages", and `content.not-found` mentions "404" as a name, not a number. Don't
edit the scope text to silence them.

`template.not-found` counts the catch-all `*` route as 1 route.
`template.blog-post` lists the 6 placeholder posts; the original site has
149, and the clone carries only 6 on purpose.
