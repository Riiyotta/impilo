import { useMemo } from 'react'

/*
 * Renders a raw SVG string as a real <svg> element so its internal hook classes
 * (.animate, .scale, .layer-1, ...) are reachable by GSAP.
 * `idPrefix` namespaces internal ids (several source SVGs reuse ids like "a", "b").
 */
const ROOT_ATTRS = new Set(['xmlns', 'fill', 'viewBox', 'width', 'height', 'preserveAspectRatio'])

function parse(raw, idPrefix) {
  let src = raw.trim()
  if (idPrefix) {
    src = src
      .replace(/\bid="([^"]+)"/g, `id="${idPrefix}-$1"`)
      .replace(/url\(#([^)]+)\)/g, `url(#${idPrefix}-$1)`)
      .replace(/href="#([^"]+)"/g, `href="#${idPrefix}-$1"`)
  }
  const match = src.match(/^<svg([^>]*)>([\s\S]*)<\/svg>$/)
  if (!match) throw new Error('InlineSvg: invalid svg source')
  const attrs = {}
  for (const [, name, value] of match[1].matchAll(/([\w:-]+)="([^"]*)"/g)) {
    if (ROOT_ATTRS.has(name)) attrs[name] = value
  }
  return { attrs, inner: match[2] }
}

export default function InlineSvg({ svg, idPrefix, ...rest }) {
  const { attrs, inner } = useMemo(() => parse(svg, idPrefix), [svg, idPrefix])
  return <svg {...attrs} {...rest} dangerouslySetInnerHTML={{ __html: inner }} />
}
