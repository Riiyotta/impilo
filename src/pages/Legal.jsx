import { Fragment, useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { LEGAL } from '../data/legal'
import { runPage } from '../animations/pages/runner'
import '../styles/pages.css'

/* Inline parts: plain strings, the site-home link (internal) or the support mailto. */
function Parts({ item }) {
  if (typeof item === 'string') return item
  return item.parts.map((p, i) => {
    if (typeof p === 'string') return <Fragment key={i}>{p}</Fragment>
    if (p.link === 'home')
      return (
        <Link key={i} to="/">
          {p.label}
        </Link>
      )
    return (
      <a key={i} href={`mailto:${p.label}`}>
        {p.label}
      </a>
    )
  })
}

/*
 * COMPANY_PAGES_SPEC L: shared Legal__Wrapper / Legal__Content template for
 * /terms/, /privacy/ and /app-privacy/. No motion. Usage: <Legal page="terms" />.
 */
export default function Legal({ page = 'terms' }) {
  const doc = LEGAL[page]
  const root = useRef(null)
  useLayoutEffect(() => {
    document.title = doc.docTitle
    return runPage(root.current)
  }, [doc])

  return (
    <div ref={root} className="pg-legal">
      <section className="bg-silver05 u-mt-[50] u-py-[96] u-rounded-[24] mob:mt-0">
        <div className="legal-content mx-auto type-body-r text-blue01 u-w-[1114] tab:u-w-[697] mob:u-w-[344]">
          <h1>{doc.title}</h1>
          <p>
            <strong>{doc.notice}</strong>
          </p>
          <h2>
            {doc.address.map((line, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
            {doc.addressExtraBreak && <br />}
          </h2>
          {doc.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {doc.sections && (
            <ol>
              {doc.sections.map((s) => (
                <Fragment key={s.title}>
                  <li>{s.title}</li>
                  <ol>
                    {s.items.map((it, i) => (
                      <li key={i}>
                        <Parts item={it} />
                      </li>
                    ))}
                  </ol>
                </Fragment>
              ))}
            </ol>
          )}
          {doc.items && (
            <ol>
              {doc.items.map((it, i) => (
                <li key={i}>
                  {it.text}
                  {it.sub && (
                    <ol>
                      {it.sub.map((s, j) => (
                        <li key={j}>
                          {s}
                          {j === 0 && it.subList && (
                            <ul>
                              {it.subList.map((x) => (
                                <li key={x}>{x}</li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ol>
                  )}
                  {it.list && (
                    <ul>
                      {it.list.map((x, j) => (
                        <li key={j}>{x}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </div>
  )
}
