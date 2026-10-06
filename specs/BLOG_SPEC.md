Source: https://impilo.health/blog/

# Impilo Blog: Clone Spec (routes `/blog/` and `/blog/:slug/`)

Measured live on 2026-10-06 with an isolated headless Chromium (Playwright) at 1440x900, 768x1024 and 390x844, always with `?noSmooth`.

The production bundles ship **public source maps**. The original TSX for every blog component was recovered from them: `BlogLayout`, `LargeCard`, `SmallCard`, `VirtualCardList`, `SearchBar`, `EmailInput`, `Categories`, `PostContent`, `RichComponents`, `Share`, `FileDownload`, the page files, `smoothPin` and `Transition`. Every value below was either read from that source and confirmed against computed styles, or measured directly. Where the two disagree, the computed (measured) value is given and the reason is explained.

**Reuse `CLONE_SPEC.md` section 0 unchanged.** That covers the fluid `--u` model, Gilroy, type and color tokens, Primary button, Link, Pill, header, footer, preloader and page skeleton. Nothing in this file changes them. All sizes here are **design px**: write them as `calc(N * var(--u))`.
- Desktop values are exact at 1440.
- Mobile values are given in 375-base design px. Measured px at 390 = N × 1.04.
- Tablet values use the 1024 base: measured px at 768 = N × 0.75. Tablet follows the fluid model plus the few explicit tablet overrides listed in this file.
- 1280 has no deviations. It is pure ×0.8889 scaling.

Reference screenshots (full page) are in `recon/screens/pages/`:
- `blog-index-1440.png`, `blog-index-768.png`, `blog-index-390.png`
- `blog-index-category-1440.png` (`?category=Partnerships`), `blog-index-search-1440.png` (query + category), `blog-index-noresults-1440.png`
- `post-placeholder-1440.png` / `-768.png` / `-390.png`. This is the Contentful "schema reference" post, which contains every rich-text element type.
- `post-enhancing-rural-healthcare-access-through-rpm-1440.png` / `-390.png`. FileDownload form, "Recent Articles" fallback.
- `post-why-amazon-style-fulfillment-fails-in-healthcare-and-what-works-instead-1440.png`. Long post with h1/h2/ul/blockquote and "Related Articles".

Note: the blog index is a virtualized list. The long full-page screenshots only show the rows that were rendered near the top, so lower rows may appear blank. That is an artifact of the screenshot, not of the design.

Blog icons (cleaned inline SVGs) are in `recon/svgs/blog/`:
- `search.svg`, `email-logo.svg`, `email-submit.svg`, `categories.svg`, `category-arrow.svg`, `text-arrow.svg`, `clear-filter.svg`
- `breadcrumb-arrow.svg`, `list-arrow.svg`
- `share-x.svg`, `share-linkedin.svg`, `share-facebook.svg`, `share-copylink.svg`, `share-bit.svg`
- `filedownload-pulse.svg`

Placeholder imagery (generated, on-brand, no original photos) is in `public/assets/blog/`:
- `cover-1.svg` … `cover-6.svg`: 1200×800, 3:2. 3:2 is the dominant ratio of the real covers.
- `inline-1.svg`: 1000×666, for the in-article image.

---

## B0. Route inventory and data model

| Route | Exists? | Notes |
|---|---|---|
| `/blog/` | yes | The single index page. No pagination: all posts are on one page in a virtualized list. |
| `/blog/:slug/` | yes, 148 posts | **One template for every post** (`component---src-pages-blog-contentful-page-blog-post-slug-tsx`, checked across all 148 page-data files). Posts differ only in which rich-text nodes they contain. |
| `/blog/page/2/` | **404** | No pagination routes. |
| `/blog/category/*`, `/blog/tag/*`, `/blog/author/*` | **404** | No taxonomy routes. Category filtering and search are **query params on `/blog/`**: `?category=<Name>` and `?query=<text>`. Both can be combined. |

The sitemap lists 148 posts. One of them is `/blog/placeholder/`, a CMS schema reference post titled "SCHEMA REFERENCE! …". It is excluded from the index and category queries by id but is reachable by URL. The index therefore shows **147 posts: 1 featured + 146 in the grid** (49 rows of 3).

Post fields used: `title`, `slug`, `createdAt`, `overwritePublishDate` (wins if set), `blogAuthorName`, `categories[]` (0–5 per post; 78 have 1, 48 have 2), `mainImage`, `articleText` (rich text), `articleTextPreview`, and `relatedArticles[]` (0–2).
- Sort order: `createdAt DESC`.
- `articleTextPreview` is **never displayed**. It is used only for search and as the post's meta description.

**Content structure stats (for the ~6 placeholder posts; do not copy real text):**
- Title: 3–17 words, median 10. On the index, the featured title wraps to 2 lines at 1440 and 2 at 390. Small-card titles are 1–3 lines and clamp at 3.
- Preview/excerpt: 13–162 words, median 45. Not rendered.
- Body: 56–1,488 words, median ~615.
- Date format: `MMMM Do, YYYY`, e.g. "September 21st, 2026" (ordinal suffix).
- Byline: `By {author}`. The author is a plain string: "Impilo" in 100 posts, "Impilo Marketing" in 41, a few named guests. There is **no author block, avatar or bio anywhere**.
- Rich-text node usage across all posts:
  - paragraph 4,291; list-item 1,806; hyperlink 632; unordered-list 455; heading-1 425; heading-2 291; ordered-list 50; blockquote 19; hr 10
  - embedded-asset (image) 8; embedded-entry (FileDownload form) 7
  - marks: bold 1,587, underline 307, italic 131, superscript 3, subscript 1, code 1
  - **No heading-3 to heading-6, no tables, no code blocks.**
- Category taxonomy, in order of first appearance (newest first), which is the order the sidebar shows:
  1. Digital Health Programs
  2. Rural Health/ FQHC
  3. Patient Devices
  4. Partnerships
  5. Company News
  6. Built on Impilo
  7. Case Studies
  8. Webinars
  9. Events
  10. White Papers

  These are UI labels and may be reused or replaced with placeholder names.
- Cover image source sizes:
  - 1200×800 (3:2): 54 posts
  - 1080×1080: 15
  - 400×400: 7
  - 1200×627: 5
  - others vary

  **Use 3:2 placeholders.**

Suggested 6 placeholder posts that together exercise everything:
1. Long: h1, h2, p with bold/italic/underline, ul, ol, internal and external links, 2 categories.
2. Blockquote + hr + inline image.
3. FileDownload embedded form.
4. sup / sub / code marks. A short 1-line title, to show the 1-line card.
5. Long 3-line title, to show the clamp. 0 categories.
6. Tests the Related versus Recent fallback: give it `relatedArticles` of 2, and give one other post none.

---

## B1. Blog index `/blog/`

### B1.1 Page skeleton
Header, footer, preloader and `main::before` (blue05) are exactly as on the homepage. The header scrolls away and `main` starts at y = 112.98 at 1440 (117.52 at 390). Everything below lives inside `main`.

```
main
 └ BlogWrapper   (flex, justify-center; padding-top 30 | mobile 0)
    └ InnerWrapper  (bg #FFF; radius 24 | mobile 16; width 1420 | tablet 1002 | mobile 345; min-height 100lvh)
       └ Columns  (grid 1fr auto; gap 30 | tablet 20; padding 40 40 60 | mobile: 1 col, padding 20 16, gap 0)
          ├ MobileOnly: SearchBar          (≤500 only)
          ├ Left  (content, see below)
          └ Right (width 390, padding-left 30 | tablet 20, border-left 1px lavender06 #F1F1FD; display:none ≤500)
               └ PinnedContainer (flex col, gap 28): SearchBar, EmailInput, Categories
```

Measured at 1440:
- InnerWrapper: x 10, y 142.97, w 1420.
- Columns: `grid-template-columns: 920px 390px`.
- Left: x 50, w 920.
- Right: x 1000, w 390. Content starts at x 1031 (359 wide).
- Document height 18,314. At 768 it is 18,948; at 390 it is 49,012.

Tablet (768): InnerWrapper 751.5 wide at x 8.25, radius 18. Columns padding 30/30/45, gap 15, columns 384 | 292.5. Right padding-left 15.

Mobile (390): InnerWrapper 358.8 wide at x 15.6, radius 16.64. Columns padding 20.8/16.64. Content width 325.5.

### B1.2 Left column, default state (no query, no category)
Order:
1. LargeCard (featured = newest post)
2. MobileOnly block: EmailInput + Categories (≤500 only)
3. Header "Previous Articles"
4. Card grid of all remaining posts

**LargeCard** (`LargeCard__Wrapper`, div):
- `padding-bottom: 28; border-bottom: 1px solid lavender05 #E6E4FB; margin-bottom: 40`
- Mobile: no border, padding 0, margin-bottom 44
- The **whole card is clickable**: `onClick` navigates with the slide page transition.
- Contents:
  - Image: `border-radius: 16; overflow: clip; isolation: isolate; aspect-ratio: 920/440` (tablet 520/440, mobile 313/210); `object-fit: cover`.
    - **Measured quirk:** the Gatsby "constrained" wrapper is `inline-block` with an intrinsic sizer, so the box is **max(aspect-ratio height, natural-image height)**.
    - With 3:2 images this gives 1440 **920×613.34** (natural 3:2 wins), tablet 384×325 (520/440 wins), mobile 325.5×218.4 (313/210).
    - Build it as `aspect-ratio: 3/2` desktop, `520/440` tablet, `313/210` mobile.
  - Details row: bodyXS 12/600/92%/-0.48, color silver01 #9494A7, `display:flex; gap:8; margin-top:24` (mobile 12).
    - Content: `{date}` `|` `By {author}`, rendered as three flex items: date div, a "|" text node, author div. Height 11.03.
  - Title `h1`: h3 46/600/92%/-1.84, color **blue02 #232265**, `margin: 8 0 24`. At 1440 it is 2 lines, 84.6 tall.
    - Mobile: h4 24/500/92%/-0.96, `margin: 10 0 12` (24.96px measured).
  - "Read Article" **TextArrowButton**, described next.

**TextArrowButton** (new shared component, also reused as the category pill shape):
- `display:flex; align-items:center; gap:8; width:fit-content; padding: 11 22; border-radius: 99vw`
- bodyM 14/600/144%/-0.56, color blue02
- `box-shadow: 0 -1px 1px 1px #FBFAFF inset, 0 2px 5px 0 rgba(212,209,242,.68), 0 0 0 1px rgba(133,143,172,.25)`
- `transition: color .5s`. Arrow `text-arrow.svg`: 13 wide, `transition: transform .5s`; path `transition: stroke .5s`, stroke and fill blue02.
- 1440 size: 137.3×42.16.
- Mobile: `padding: 0 14; height: 29` (126.1×30.16 at 390).
- **Hover (measured):** text and arrow path stroke/fill become brightGreen #5CFFB1, and the arrow moves `translateX(4px)`. No background change, so the text turns light green on white. This is faithful to the original.

**Header "Previous Articles"** (`blog__Header`):
- h4 24/500/92%/-0.96, color blue01
- `display:flex; align-items:center; justify-content:space-between; gap:14; margin-bottom:22` (tablet 28, mobile 44 with `display:grid; gap:16`)

**Card grid** (`VirtualCardList`):
- Rows of N cards; N = 3 desktop, 2 tablet, 1 mobile.
- Row group: `display:grid; grid-template-columns: repeat(3,1fr); gap: 44 25`
  - Tablet: 2 cols, gap 35 25
  - Mobile: 1 col, gap 36
- Gap **between rows** (virtualizer): 44 desktop/tablet, 28 mobile.
- At 1440 the columns are 290.02 wide; a row is 299.75 tall.
- The original virtualizes with `@tanstack/react-virtual` (overscan 3, estimate 300). That is only a performance detail. **The clone can simply render every card**: with 6 placeholder posts this means 1 featured + 5 cards (2 rows).

**SmallCard** (`SmallCard__Wrapper`, an `<a>` to `/blog/{slug}`):
- `display:flex; flex-direction:column; gap:12; max-height:300` (tablet 290, mobile 300)
- Image: `aspect-ratio: 290/210` (tablet 246/196, mobile 313/210); `border-radius:16`; cover. Measured 290×210 at 1440, 182.7×145.5 at 768, 325.5×218.4 at 390.
- Title: bodyR 18/500/144%/-0.72, color blue02.
  - `padding: 4px 0; margin: -4px 0; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden`
- **No hover state at all.** Measured: no color, transform, shadow, opacity or underline change on card, image or title.
- No date, category or excerpt on small cards.

### B1.3 Right column (desktop/tablet), pinned
`PinnedContainer`: flex column, gap 28, width 359 at 1440. Contents: SearchBar, EmailInput, Categories. Total height 613.8.

**SearchBar** (`SearchBar__Row` → icon + input):
- Row: `display:flex; align-items:center; position:relative; flex-grow:1`. Mobile adds `margin-bottom:12`.
- Icon `search.svg`: 18×18, `position:absolute; left:16`, stroke lavender03 #876EEC.
- Input:
  - bodyM 14/600, color blue01, background lavender06 #F1F1FD, `border: 1px solid lavender04 #B1A6F6`
  - `border-radius:12; height:52; padding:16 16 16 48; width:100%`
  - Placeholder "Search the Blog..." in lavender03. Focus: `outline:none` with no other change.
  - Measured 359×51.98.

**EmailInput** (newsletter form; Radix Form):
- Wrapper: `display:flex; flex-direction:column; align-items:start; padding:30 24; gap:16; border-radius:15; background: blue02 #232265`. Mobile: gap 20, radius 14.
- Measured 359×232.17 at 1440.
- Logo `email-logo.svg`: 69 wide (40.4 tall), fill silver04 #F4F4FB.
- Title: bodyR, color #FFF, width 228.
  - Text: "Get Impilo News and Updates right to your inbox."
  - Wraps 2 lines and sits inside an AutoAnimate grid, so the text cross-fades when the state changes.
- Row (`display:flex; gap:16; width:100%; position:relative`) → Field (`display:flex; align-items:center; border-radius:6; background:#FFF; width:100%`):
  - Input: bodyM 14/600, color blue01, placeholder "Your Email" in silver01, `height:48; padding:15 13; border-radius:6`.
  - Submit button, inside the field: 44×44, padding 12, `email-submit.svg` 20×20 (stroke blue06 #2F6BEE), aria-label "submit email". No hover style.
  - Invalid state: `[data-invalid]{outline:1px solid #F76161}`. Message "Invalid Email" in bodyXS #F76161, `position:absolute; top:calc(100% + 3px); left:-8px; margin:6 0 0 16`.
- States:
  - Loading: the input is disabled.
  - Success: the title becomes "Thanks for subscribing" and the submit button is replaced by a check-circle icon (stroke brightBlue, 18×18, margin 13).
  - Error: the title becomes "Something went wrong. Check your connection, and contact us if the issue persists."
- The original posts to HubSpot Forms. **The clone should only fake the submission**, with a client-side success state.

**Categories**:
- Header row:
  - kickerR 15/500/144%/+0.3 uppercase, color blue03 #4846BF
  - `display:flex; align-items:center; gap:10; margin:24 0; padding-bottom:18; border-bottom:1px solid lavender05`
  - Mobile `margin-top:52`.
  - Icon `categories.svg` 18×14. Label "Categories".
- List: `display:flex; flex-wrap:wrap; gap:10`. Mobile adds `padding-bottom:22; margin-bottom:24; border-bottom:1px solid lavender05` (measured on the mobile instance).
- Category pill (`<button>` on the index, `<a href="/blog?category=…">` on posts):
  - bodyXS 12/600/92%/-0.48, color lavender02 #6563DA
  - `display:flex; align-items:center; gap:8; padding:9 14; border-radius:99vw`, with the same 3-layer box-shadow as TextArrowButton
  - Arrow `category-arrow.svg`: 18 wide (tablet 14), stroke lavender02. Height 29.03 at 1440.
  - **No hover state** (measured).
  - Click: sets `?category=<name>` via `history.replaceState`, with no navigation.

### B1.4 Mobile (≤500) order, measured at 390
- y 138: SearchBar (325.5×54.1, +12 margin)
- y 205: LargeCard (image 218.4, title 2 lines at 24.96px, button 30.2 tall)
- y 592: EmailInput (325.5×249.8)
- y 842: Categories (header margin-top 52)
- y 1245: "Previous Articles" (h4, margin-bottom 44)
- y 1314: one card per row, 28 apart. Card image 325.5×218.4.

The Right column is `display:none`.

### B1.5 Filtered states (`?query=` and/or `?category=`)
When either param is set, the featured card and "Previous Articles" are replaced. The Left column renders:
1. A header row (`blog__Header` style, h4, flex space-between) containing the text and a **Clear button** on the right:
   - category only: "Categories / {Category}". This uses SmallerMobileHeader, which drops to bodyR on mobile.
   - query only: "Search results for “{q}”". This uses LightHeader, color blue01, bodyR on mobile.
   - both: "Search results for “{q}” in {Category}"
   - Clear button: bodyM 14/600, color blue02, `display:flex; align-items:center; gap:10; white-space:nowrap`.
     - Icon `clear-filter.svg` 18×18 (stroke blue02), followed by "Clear Search", "Clear Category" or "Clear Search / Category".
     - Clicking it removes both params. No hover state.
2. The card grid of matches (same SmallCard rows), or the plain text "No Results Found" in bodyR.
3. MobileOnly: a `30lvh` spacer, then EmailInput and Categories.

Search behavior:
- MiniSearch over title, author, slug and preview, with `prefix:true, fuzzy:0.2`.
- Results are in relevance order and update on every keystroke with no debounce.
- The category filter is an exact match on the `categories[]` array.
- Both search inputs (mobile and desktop) and all category buttons share state through the URL.
- On a param change, the page jumps to scrollTop 0 with no animation, and ScrollTrigger is refreshed.

Measured at 1440:
- `?category=Partnerships`: 18 cards in 6 rows; docH 3,246.
- `?query=zzzzqqq`: "No Results Found"; docH 1,770, because of the InnerWrapper `min-height: 100lvh`.

---

## B2. Blog post `/blog/:slug/`

### B2.1 Skeleton
```
main
 ├ TopSpacer (height 30)
 └ Wrapper  (bg #FFF; radius 16; margin 0 10 | mobile 0 15; padding 40 0 100 | mobile 20 16 85)
    ├ Heading / breadcrumb   (width 680, centered; hidden ≤500)
    ├ Content  (grid: 1fr 680 1fr; gap 36; margin-bottom 44 | mobile: 1 col, gap 0, mb 24)
    │   ├ <div/> (empty left gutter)
    │   ├ PostContent (680)
    │   └ <div> └ Socials (pinned share column)
    └ Related   (grid 2 cols; width 680 centered; gap 26 40 | mobile 1 col, gap 44)
```

Measured at 1440:
- Wrapper: x 9.98, y 142.97, w 1420.
- Content columns: 334 | 680 | 334. The article column is at x 380, the share column at x 1096.
- docH: 4,563 for the placeholder post; 3,573 for enhancing-rural (FileDownload only); 8,270 for why-amazon (long).

Measured at 768: Wrapper 753 wide, radius 12, padding 30/0/75. Columns 94 | 510 | 95, gap 27.

Measured at 390: Wrapper 358.8 at x 15.6, padding 20.8/16.64/88.4; single column 325.5.

### B2.2 Breadcrumb (`Heading`)
- h5 (= bodyM 14/600/144%/-0.56)
- `display:flex; align-items:center; gap:6; padding-bottom:16; width:680; margin:0 auto`
- Content: "Blog" link (to `/blog`, color blue06 #2F6BEE), then `breadcrumb-arrow.svg` 13 wide (8.66 tall), then "Article" (color blue01, `margin-right:auto`).
- No hover style. Height 36.14.
- **Hidden on mobile.**

### B2.3 PostContent (article column, 680)
In order:
1. Hero image:
   - `aspect-ratio: 680/440; border-radius:16; overflow:clip; isolation:isolate`; cover.
   - Same inline-block quirk as LargeCard: with 3:2 images it renders **680×453** at 1440 and 325.5×216.9 at 390, because the natural ratio wins. Build it as `aspect-ratio: 3/2` with min 680/440.
2. Date row (`PublishDate`):
   - bodyXS 12/600, color silver01, `display:flex; gap:8; margin-top:28` (mobile 12)
   - Content: `{date}` `|` `By {author}`, as 3 divs. It **is** visible on mobile.
3. Title `h1`:
   - h3 46/600/92%/-1.84, **color blue01** (the LargeCard uses blue02), `margin-top:8`
   - 2–3 lines at 1440: 84.6 or 126.9 tall
   - Mobile: h4 24/500 (24.96px at 390)
4. Category pills:
   - Row: `display:flex; flex-wrap:wrap; gap:12; margin:28 0 36` (mobile `12 0 20`)
   - Each pill is a link to `/blog?category={name}`, styled as in B1.3. Nothing renders if there are no categories.
5. RichText body (B2.4).

Wrapper: `border-bottom:1px solid lavender05; padding-bottom:24`. Mobile: no border, padding-bottom 20.

### B2.4 Rich-text styles (each element measured at 1440 on `/blog/placeholder/`)
Wrapper: `display:grid; gap:28` (mobile 24). All blocks are direct grid children, so **vertical rhythm comes only from the gap; blocks have no margins**.

Trailing empty paragraphs are common in the CMS. They render as 0-height `<p>` but still add one gap.

| Element | Output | Style |
|---|---|---|
| Paragraph | `p` | bodyR 18/500/25.92/-0.72, color blue01 |
| heading-1 | `h1` | h4: 24/500/92% (22.08)/-0.96, blue01. Authors usually wrap the text in bold, so it renders at 600. |
| heading-2 | `h2` | **Unstyled.** The global reset makes it inherit bodyR 18/500/25.92. It is usually bold-marked, so it reads as 18/600. Measured height 26.92. Keep this. |
| bold | `strong` | `font-weight:600` (inherits size) |
| italic | `em` | `font-style:italic` |
| underline | `u` | `text-decoration:underline` |
| code | `span` | `display:inline-block; margin:0`; bodyR, but `font-family: monospace` (18px) |
| superscript / subscript | `sup` / `sub` | `vertical-align: super` / `sub`. **Font size is not reduced** (stays 18px). |
| hyperlink | `a` | color blue06 #2F6BEE, `text-decoration: underline`; no hover change. Internal URIs (starting with `/`) navigate with the slide transition. Anything else opens with `window.open(uri,'_blank')`. |
| blockquote | `div.Quote` > `p` | Container: h4 typography, `display:block; padding: 8 0 8 20; border-left: 3px solid blue05 #3F3CCD`. Computed is 2px at DPR 1 because the scaled 2.9995px is floored; build 3px. The inner `p` re-applies bodyR, so the **quote text renders at 18/500** with the bar. 41.9 tall for 1 line. |
| unordered-list | `ul` | `display:grid; gap:4; padding-inline-start:50; list-style:none` |
| list-item (ul) | `li` (`position:relative`) > `svg` + `p` | Marker is `list-arrow.svg`: 13 wide (8.66 tall), stroke blue02, `position:absolute; top:9; right:calc(100% + 18)` (so left = -31). Text is bodyR. |
| ordered-list | `ol` | Same grid/gap/padding as `ul`. `list-style-type: numeric` is an unknown counter style, so it falls back to **decimal**. Native outside markers "1." in bodyR, blue01. No arrow (the svg is `display:none` in `ol`). |
| hr | `hr` | `border-bottom: 1px solid lavender05 #E6E4FB`; height 1 |
| embedded image | Gatsby image | `border-radius:16`, full column width (680×452.9 for a 1000×666 asset), `max-width` = asset width (max 1000) centered. No caption. |
| embedded entry | FileDownload form | See B2.5 |
| tables, h3–h6, code blocks | — | **Not used anywhere and not styled.** If the clone wants table support, it is not part of the original. |

Mobile (390): every type token scales by 1.04. Values: p 18.72/26.96; h1 24.96; ul/ol padding 52 and gap 4.16; arrow `top 9.36; left -32.2`.

### B2.5 FileDownload (embedded gated-download form; 7 posts)
- Wrapper `<form>`: background blue01 #161658, color #FFF, `width:680; min-height:881; padding:60; border-radius:24`.
  - Mobile: width 313, padding 24. Measured 680×889.6 at 1440 and 325.5×916.2 at 390.
- Pulse logo `filedownload-pulse.svg`: 160 wide (mobile 82).
- Title `h1` (call-to-action text): h3 46/600/92%/-1.84. `margin:24 0 40; padding-bottom:40; border-bottom:1px solid blue02`. h3 stays h3 on mobile (47.84px).
- Inner: flex column, gap 20, `transition: opacity .5s cubic-bezier(.645,.045,.355,1)`. Opacity is .5 while submitting.
- Fields (Radix Form Field):
  - Field box: `width:550; height:66; border-radius:12; border:1px solid blue03 #4846BF; background: blue02; display:flex; align-items:center; gap:8; transition: border-color .2s`
  - Hover: border blue04 #524FD9. Invalid: border brightTurquoise.
  - Input: h4 24/500 (mobile bodyR), color #FFF, `padding:0 21`, placeholder blue07 #B1C3FC.
  - Fields in order: "Full Name", "Email Address" (type email), "Name of Company".
  - Textarea "Anything else you want us to know?": field height 176; control bodyM 14/600, padding 22.
  - Messages: kickerS, brightTurquoise, "Required" / "Invalid".
  - Tablet: field width 560. Mobile: field width 265 (297 for the base input).
- Then an empty div, then the **Primary button** "Download" (section 0.5; full width and centered text on mobile).
- Success state: AutoAnimate crossfade (opacity only) to:
  - a laptop illustration: 458 wide, `margin: 83 50 56`; mobile 250, `83 7 56`. Not captured; it only renders after a real submit. Use any simple line-art laptop.
  - "Success, download will begin shortly!" in h4, centered
  - a link "Click here if the download does not begin automatically": h5, blue03, fades in after a 3s delay (`fadeIn .5s cubic-bezier(.645,.045,.355,1)`)
- Error state: a message in brightTurquoise above the fields.
- **Clone:** fake the submit. Do not post to HubSpot.

### B2.6 Share column (`Socials`)
- Desktop/tablet: `display:grid; gap:18` in the right gutter. 4 round buttons stacked; the column is 198 tall.
- Mobile: it sits **after the article**: `display:flex; gap:18; padding-bottom:12; border-bottom:1px solid lavender05`, at y ≈ 3165 on the placeholder post.
- Button: 36×36 `<a>`, `position:relative`; svg 36×36.
  - Every icon is a blue05 #3F3CCD filled circle with a white glyph.
  - Order: X (`share-x.svg`), LinkedIn, Facebook, Copy Link.
- Hover hint (`Share__HoverHint`):
  - bodyXS 12/600, color #FFF, background blue05
  - `height:30; padding:0 10; border-radius:6; white-space:nowrap`
  - `position:absolute; top:50%; left:calc(100% + 10px); translate:0 -50%`
  - `opacity:0 → 1` on button hover, `transition: opacity .1s cubic-bezier(.645,.045,.355,1)` (measured)
  - `::before` is the pointer `share-bit.svg`: 12×12, `left:-7; top:50%; translate:0 -50%`
  - Labels: "Share on X", "Share on LinkedIn", "Share on Facebook", "Copy Link". After a click, "Copy Link" becomes "Link Copied!" and resets 100ms after mouseleave.
- Hrefs (opened via `window.open(..., "_blank")`):
  - X: `https://twitter.com/intent/tweet?url={encodeURIComponent(location.href)}&title={title}`. The title is **not** encoded in the original.
  - LinkedIn: `https://www.linkedin.com/shareArticle?mini=true&url={enc}&title={title}`
  - Facebook: `https://www.facebook.com/sharer/sharer.php?u={enc}`
  - Copy Link: a `<button>` that runs `navigator.clipboard.writeText(location.href)`

### B2.7 Related / Recent articles
- Heading: h4 24/500, blue01, `grid-column: span 2` (mobile span 1).
  - Text is "Related Articles" if the post has `relatedArticles`, which 89/148 posts do (83 have 2, 6 have 1). Otherwise it is "**Recent Articles**", which shows the 2 newest other posts.
- Grid: `grid-template-columns:1fr 1fr; width:680; margin:0 auto; gap:26 40`. Mobile: 1 col, gap 44.
- Cards are the **same SmallCard** as on the index: 320 wide at 1440 (image 320×231.7 from 290/210); 240×173 at 768; 325.5×218.4 at 390.
- When there is only 1 related article, a single card sits in the left column.

---

## B3. Motion

The blog uses **no entrance or scroll-reveal animations**: no TextAnimation, SplitText or fades on cards, titles or body. `window.gsap` is not exposed, so the parameters below come from the recovered source.

1. **Page transition "slide"** is the default for every internal link (UniversalLink): header nav, cards, LargeCard click, breadcrumb, category pills on posts, internal rich-text links.

   The overlay is `Transition__Wrapper`: fixed full-screen, blue02, z 100, a centered pulse svg 168 wide, and a duration constant of 0.5s.
   - **In** (covers the old page):
     - `set autoAlpha 1`
     - wrapper `fromTo {y:"100lvh", borderRadius:"200px 200px 0 0"} → {y:"0lvh", borderRadius:"0px 0px 0 0"}`, 0.5s, power3.out
     - svg `fromTo {y:"-100lvh"} → {y:"0lvh"}`, 0.5s, power3.out
     - `.animate` path drawSVG `"0% 0%" → "0% 100%"`, delay 0.25, duration 0.45, power3.inOut
   - **Out** (after the new page mounts):
     - wrapper `to {y:"100lvh", borderRadius:"200px 200px 0 0"}`, 0.5s, power3.in
     - svg `to {y:"-100lvh"}`, 0.5s, power3.in
     - `set autoAlpha 0` at 0.5s

   This refines the one-line summary in CLONE_SPEC §12.
2. **Index sidebar pin** (desktop and tablet only; skipped on mobile):
   - `ScrollTrigger.create({ trigger: PinnedContainer, pin: true, pinSpacing: false, start: () => "top " + ci(40) + "px", end: () => "+=" + (parent.offsetHeight - pin.offsetHeight) })`
   - The sidebar sticks 40 design px below the viewport top for the whole length of the column.
   - CSS equivalent that is good enough: `position: sticky; top: calc(40 * var(--u))` on the PinnedContainer inside a full-height Right column.
   - When ScrollSmoother is active (pinType "transform"), `createSmoothPin` adds a "goop" with smoothLevel = ci(50):
     - The pin's parent tweens `y: 0 → smoothLevel/4` (power1.in, scrub) over the 50px of scroll before the pin starts, then back to 0 (power1.out) over the 50px after it.
     - It does the mirror (`-smoothLevel/4`) around the pin end.

     With native scroll (pinType "fixed") the goop is skipped. The homepage clone already runs native scroll, so **skip the goop**.
   - Refresh the pin whenever the list height changes (filters, resize).
3. **Post share-column pin** (desktop and tablet only): the same createSmoothPin with `start: "top top+=" + ci(120)`, `end: "+=" + (parent.offsetHeight - pin.offsetHeight)`, smoothLevel 50. Equivalent CSS: `position: sticky; top: calc(120 * var(--u))`.
4. **Image load fade** (gatsby-plugin-image, applies to every cover and inline image):
   - The blurred 20px placeholder sits underneath with `transition: opacity 500ms linear`.
   - The main `<img>` fades `opacity 0 → 1` with `transition: opacity 250ms linear` when it loads.
   - Optional in the clone: use `opacity 0 → 1, 250ms linear` on `onLoad`.
5. **Hover transitions:**
   - TextArrowButton: color .5s, arrow transform .5s, path stroke .5s.
   - Share hint: opacity .1s.
   - FileDownload field: border-color .2s.
   - Primary "Download": as in §0.5. Measured: wrapper → lavender03, inner → lavender05, spans translateY(-34px).

   Nothing else in the blog has hover states: cards, category pills, breadcrumb, rich links and the clear button do not change.
6. EmailInput title text and FileDownload states crossfade through AutoAnimate (opacity only).

---

## B4. External links on blog pages (not impilo.health)

Header and footer (already in CLONE_SPEC):
- header + footer "Docs" → https://docs.impiloplatform.com
- footer "Careers" → https://careers.impilo.health. This is a subdomain, so treat it as external.
- footer "Linkedin" → https://www.linkedin.com/company/impilo-inc/
- footer "Contact Us" → mailto:sales@impilo.health
- footer "(202) 838-5839" → tel:+12028385839

Blog post share buttons (every post):
- "Share on X" → `https://twitter.com/intent/tweet?url=<encoded page url>&title=<post title>`
- "Share on LinkedIn" → `https://www.linkedin.com/shareArticle?mini=true&url=<encoded>&title=<post title>`
- "Share on Facebook" → `https://www.facebook.com/sharer/sharer.php?u=<encoded>`
- "Copy Link" is a button (clipboard), not a link.

Inside article bodies (content-specific; 632 hyperlinks across all posts, 435 external): placeholder posts should include 1 external link (e.g. `https://example.com`) to exercise the external `window.open` path.
- Observed on the measured pages:
  - placeholder: "link to external sites" → https://www.google.com
  - enhancing-rural: "sales@impilo.health" → mailto:sales@impilo.health
  - enhancing-rural: "www.impilo.health" → `www.impilo.health` (protocol-less, so a broken relative URL)
  - why-amazon: "Request a Demo" → `www.impilo.health/request-demo` (same problem)

The blog index itself has no external links in `main`. The newsletter form posts to HubSpot (`api.hsforms.com`); it is a fetch, not a link, and **must not be cloned**.

---

## B5. Head / meta
- Index:
  - `<title>Impilo | Blog</title>`
  - description "Impilo Blog."
  - og:url `https://impilo.health/blog`
  - og:image `/og-image.png`
- Post:
  - `<title>` = the raw post title, with no "Impilo |" prefix
  - description = `articleTextPreview`
  - og:image = cover image URL
  - og:url `https://impilo.health/blog/{slug}`
  - twitter:card `summary_large_image`

## B6. Not measurable / approximations
- The FileDownload success-state laptop illustration and the EmailInput success/error states only appear after a real HubSpot submission. They were taken from source, not rendered.
- Small-card and hero heights for non-3:2 covers follow the max(aspect, natural) quirk described in B1.2 and B2.3. With 3:2 placeholders, the measured values above are exact.
- The ScrollSmoother goop offsets (B3.2) were not observed live, because measurements ran with `?noSmooth`. Their parameters come from source.
- Article cover photos were deliberately not downloaded; the CDN is images.ctfassets.net, served as webp, `?w=1200&h=800&q=90`.
