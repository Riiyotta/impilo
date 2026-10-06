import { useState } from 'react'

/*
 * Mirrors the original gatsby-image (constrained) markup used on /about/: the wrapper is the sized,
 * rounded, clipped box; the image is absolutely positioned, object-fit cover, lazy + async decoded,
 * and fades in on load (opacity 0 -> 1, 0.25s linear).
 */
export default function FadeImage({ src, alt, className = '', imgClassName = '' }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        ref={(el) => el && el.complete && el.naturalWidth && !loaded && setLoaded(true)}
        className={`absolute inset-0 block h-full w-full object-cover ${imgClassName}`}
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 250ms linear' }}
      />
    </div>
  )
}
