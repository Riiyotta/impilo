import { useEffect, useRef, useState } from 'react'

/*
 * Cover / inline image with the gatsby-plugin-image load fade (BLOG_SPEC B3.4):
 * the <img> fades opacity 0 -> 1 over 250ms linear once loaded. The wrapper carries radius,
 * clip and aspect-ratio (passed in className).
 */
export default function BlogImage({ src, alt = '', width, height, className = '', imgClassName = '', style }) {
  const ref = useRef(null)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    if (ref.current && ref.current.complete && ref.current.naturalWidth) setLoaded(true)
  }, [src])
  return (
    <div className={`overflow-clip [isolation:isolate] ${className}`} style={style}>
      <img
        ref={ref}
        src={src}
        alt={alt}
        width={width}
        height={height}
        decoding="async"
        onLoad={() => setLoaded(true)}
        data-loaded={loaded ? '' : undefined}
        className={`blog-img block h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  )
}
