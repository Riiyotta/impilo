import { useEffect } from 'react'

/* Per-route <title> / meta description (CLONE_SPEC 13, BLOG_SPEC B5). */
export function useDocumentMeta({ title, description }) {
  useEffect(() => {
    if (title) document.title = title
    if (description !== undefined) {
      let el = document.querySelector('meta[name="description"]')
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('name', 'description')
        document.head.append(el)
      }
      el.setAttribute('content', description)
    }
  }, [title, description])
}
