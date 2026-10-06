# Changelog

## 1.0.0 - 2026-10-06 - initial build (Situation A: from scratch)

Built bottom-up from the clone source (audited, wins over specs), CLONE_SPEC.md and the three page
specs: tokens -> primitives -> components -> sections -> templates -> compatibility graph ->
schema -> example -> semantic validator -> adversarial tests -> manifest/allowlist/docs.
Counts are in README.md (block recomputed and checked by `extraction/verify_all.py`).

### Evidence decisions
- Spacing and radius tokens promoted from usage histograms over `src/**` (`extraction/histograms.json`);
  all 21 palette colours have recorded usage; type scale = the 12 `.type-*` classes.
- Fixed-px exceptions captured separately (`tokens/00-foundation/fixed-px.json`).
- Copy budgets measured from spec word counts / quoted strings and, for blog bodies, from the
  clone's placeholder data; no page copy stored.
- Routes rendered headless against the running clone; 0 external hrefs / requests / page errors.

### Audited corrections (source wins over the specs / brief) - `extraction/deviations.json#auditedCorrections`
- Blog card-row gap is 28 design px at every breakpoint (spec: 44 desktop/tablet).
- Blog FileDownload fields are not required; 'Invalid' (malformed email only) sits inside the field.
- Related-article cards keep 290/210 at tablet.
- impilo-platform: 24/16 below every section title; last CTA flush (no top margin).
- DHL hero title stays h2 size on mobile.
- Route-page headings use `page-text-lines` with the same per-line padding as homepage `text-lines`.
- Stack: gsap is ^3.15.0 (installed 3.15.0), not 3.13; route count is 24 patterns + catch-all, not 23.

### Findings recorded (not normalised away)
- `public/assets/blog/` placeholder covers named by BLOG_SPEC no longer exist in the source (removed
  while this repo was built); posts use cover photos copied from the original (third-party).
- Leadership renders real names and headshots although COMPANY_PAGES_SPEC A.4 asks for placeholders;
  generated pages must use placeholders (`photo.person` placeholder-only).
- One placeholder post title is 21 words (deliberate clamp test) vs the original's measured 3-17.
