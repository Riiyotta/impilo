/*
 * Small MiniSearch-style full-text search (BLOG_SPEC B1.5: MiniSearch over title, author, slug and
 * preview with `prefix: true, fuzzy: 0.2`, results in relevance order, OR-combined terms).
 * Implemented locally to avoid adding a dependency. Matching per query term:
 *   exact term     weight 1
 *   prefix match   weight 0.375 (MiniSearch default prefix weight), scaled by length ratio
 *   fuzzy match    weight 0.45 (MiniSearch default fuzzy weight), max edit distance
 *                  round(0.2 * term length)
 * Scores are summed with a simple tf-idf factor so rarer terms rank higher.
 */
const FIELDS = ['title', 'blogAuthorName', 'slug', 'articleTextPreview']
const tokenize = (s) =>
  String(s || '')
    .toLowerCase()
    .split(/[\s\-_.,:;!?'"“”‘’()/|]+/u)
    .filter(Boolean)

function levenshtein(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]
    let rowMin = i
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
      rowMin = Math.min(rowMin, cur[j])
    }
    if (rowMin > max) return max + 1
    prev = cur
  }
  return prev[b.length]
}

export function createSearch(docs) {
  const index = docs.map((doc) => ({ doc, terms: FIELDS.flatMap((f) => tokenize(doc[f])) }))
  const df = new Map()
  index.forEach(({ terms }) => new Set(terms).forEach((t) => df.set(t, (df.get(t) || 0) + 1)))
  const N = docs.length

  return function search(query) {
    const qTerms = tokenize(query)
    if (!qTerms.length) return []
    const results = []
    index.forEach(({ doc, terms }) => {
      let score = 0
      qTerms.forEach((q) => {
        const maxDist = Math.round(0.2 * q.length)
        let best = 0
        let bestTerm = null
        terms.forEach((t) => {
          let w = 0
          if (t === q) w = 1
          else if (t.startsWith(q)) w = 0.375 * (q.length / t.length)
          else if (maxDist > 0) {
            const d = levenshtein(q, t, maxDist)
            if (d <= maxDist) w = 0.45 * (q.length / (q.length + d))
          }
          if (w > best) {
            best = w
            bestTerm = t
          }
        })
        if (best > 0) {
          const tf = terms.filter((t) => t === bestTerm).length
          const idf = Math.log(1 + (N - (df.get(bestTerm) || 0) + 0.5) / ((df.get(bestTerm) || 0) + 0.5))
          score += best * (1 + Math.log(tf)) * idf
        }
      })
      if (score > 0) results.push({ doc, score })
    })
    return results.sort((x, y) => y.score - x.score).map((r) => r.doc)
  }
}
