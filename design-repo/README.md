# Impilo clone design-repo

An AI-ready, machine-validated description of the impilo.health clone: tokens, primitives,
components, section contracts, templates, a compatibility graph and a draft-07 PageSpec schema with
a semantic validator. A generator composes pages as **PageSpecs** (`schema/pagespec.schema.json`);
`schema/semantic_validate.py` decides whether a composition is legal.

Status: **design-review-pending**, `productionApproved: false` (see `registry.manifest.json`).

## Counts (recomputed from disk by `extraction/verify_all.py`)

<!-- counts:start -->
| item | count |
|---|---|
| tokens | 196 |
| primitives | 13 |
| components | 31 |
| sections | 33 |
| templates | 11 |
| routes | 25 |
| assetRoles | 12 |
| assetFiles | 157 |
| motionPatterns | 35 |
| graphRules | 26 |
<!-- counts:end -->

Routes are route patterns from `src/routes.jsx`: 12 non-content entries (incl. `/blog/:slug/`),
12 data-driven `/solutions/*` + `/use-cases/*` content routes and the `*` catch-all (404) = 25.
The 6 blog post slugs are instances of `/blog/:slug/` listed in `data/blog-posts.json`.

## Layout

```
tokens/00-foundation   colour (21 palette + literals), typography, fluid unit (--u), breakpoints,
                       radius + spacing (promoted from extraction/histograms.json), fixed-px
                       exceptions, elevation, z-index, icon sizes, motion + motion-patterns
tokens/10-semantic     colour + typography roles      tokens/20-component  component tokens
tokens/30-layout       containers, section paddings    tokens/themes        light (only theme)
tokens/llm             component-allowlist, token-catalog, token-policy
primitives/ components/ sections/   one JSON contract each (sections carry the content contracts)
templates/             templates.json (11 page shapes, structured nodes) + routes.json (25)
compatibility/graph.json   rules with severity error|warn, all implemented in the validator
assets/                closed assetRole enum with AI-generation + licensing guidance; file registry
data/blog-posts.json   blog IA (slugs, categories, related) - no post copy
schema/                pagespec.schema.json (generated), example, semantic_validate.py, tests/
extraction/            measured-values.json (citation ledger), deviations.json, histograms.json,
                       route-render-check.json, real-route-conformance.json,
                       verify_all.py, prove_drift.py
```

## How the pieces relate

* **Fluid unit.** Every length is authored in design px and rendered as `calc(var(--u) * N)`;
  `--u` = 1px above 1440, 100vw/1440 (1025-1440), 100vw/1024 (501-1024), 100vw/375 (<=500).
  `tokens/00-foundation/fixed-px.json` lists the values the original deliberately keeps in raw px
  (nav chevron 13px / gap 8px, hero word-box radius 16px, step bar padding 24px, Read Full Article
  radius 8px, outcomes bullet indent 24px, template-B tablet title margins). Never convert those.
* **Sections are the retrieval unit.** Each contract has `purpose`, `templates`, `constraints`,
  `content.schema` (`additionalProperties:false`), `content.maxWords` (copy budgets with the spec
  line they were measured from), allowed `assets` roles, `motion.allowedPatterns` +
  a const-locked `reducedMotionFallback`, structured `responsive` changes and token refs.
* **Templates** list structured nodes (`required`, `repeatable`, `min`/`max`, `variants`). The
  validator cross-references the PageSpec's declared `template` against that template's real node
  list (rule `TEMPLATE_NODE_SEQUENCE`) and the route binding (`ROUTE_TEMPLATE_BINDING`).
* **Content blocks** of `content.section` are a `oneOf` of fully independent block schemas
  (borderedCards, iconCards, textItems, twoColumn, outcomes, carousel, cta, callToAction). Their
  shape mirrors the clone's own data model: all 12 real template-B routes, converted 1:1 into
  PageSpecs, validate with 0 errors / 0 warnings (`extraction/real-route-conformance.json`).

## Copy rule

No page copy is stored here. Copy budgets are word counts measured from the specs/clone data
(`content.maxWords`, ledger in `extraction/measured-values.json#copyBudgets`); `verify_all.py`
scans the repo for verbatim homepage copy. The example PageSpec uses original placeholder text.
Short UI labels (nav items, button labels, stat labels) may appear verbatim.

## Structurally unusual - read before generating (details: `extraction/deviations.json`)

1. **No outbound links.** Only internal routes, `mailto:` and `tel:`. Docs -> `/developers/`,
   Careers -> `/careers/`, partner logos are not links, LinkedIn removed, blog share buttons are
   non-navigating (Copy Link works). Forms (request-demo, newsletter, blog download) fake
   submission locally - no network requests. Enforced by the schema `href` pattern, rules
   `NO_OUTBOUND_LINKS` / `FORMS_LOCAL_ONLY`, and verified on the running clone (0 external hrefs,
   0 external requests on 30 probed URLs: `extraction/route-render-check.json`).
2. **Clone-only routes** `/developers/` and `/careers/` (template `info-page`, origin `clone-only`)
   do not exist on the original.
3. **Deliberate scope reduction:** 6 placeholder blog posts (original 148) and 7 categories
   (original 10). Do not recreate the full set.
4. **Real company / licensing.** Gilroy is a commercial font licensed to Impilo. Homepage copy,
   illustrations, logos (incl. partner logos and HIPAA/SOC2/ISO/HQAA/FDA badges), staff photos of
   real people and blog cover photos (stock/news imagery) are third-party; non-homepage body copy
   is original placeholder text. `assets/asset-roles.json` pins the policies: `photo.person` and
   `photo.editorial-cover` are placeholder-only, `partner.logo` is restricted to `home.trusted`,
   `compliance.badge` must never be fabricated, `product.ui-mock` must never be regenerated with
   PHI-like data. `verify_all.py` fails if any pinned policy changes, even to another valid value.
5. **Intentional deviation:** dark-section titles on `/solutions/digital-health-logistics/` and
   `/solutions/clinic-rpm/` are white (the original renders an invisible blue-on-blue title).
6. **Two laptop components** (`laptop-showcase` for /integrations/, `solutions-laptop` for
   /solutions/) are kept separate on purpose.
7. **Native scroll.** The original uses ScrollSmoother; the clone uses native scroll with
   soft-pin drift and CSS sticky. Reduced motion: the clone has no `prefers-reduced-motion`
   handling, so every node's `reducedMotionFallback` is a design-repo requirement for generated
   pages, not observed behaviour.

## Verify

```bash
pip install "jsonschema>=4"
python3 extraction/verify_all.py          # all checks + adversarial suite
python3 schema/semantic_validate.py schema/example.pagespec.json
python3 schema/tests/adversarial_test.py  # controls (example + every route) and mutations
python3 extraction/prove_drift.py         # proves each drift check fails on injected drift
python3 schema/build_schema.py            # regenerate the schema after editing a contract
```

Standalone use (only `design-repo/` present) works: citation resolution, asset coverage and the
copy-leak scan degrade to warnings. Citations are `path:line` relative to the project root that
contains `design-repo/`, each with an `anchor` substring that must appear on the cited line.

The `design-repo.zip` next to this folder is a build artifact: regenerate it after every change
and never commit it to version control.
