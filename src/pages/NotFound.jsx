import { useLayoutEffect, useRef } from 'react'
import PagePill from '../components/shared/PagePill'
import PrimaryAction from '../components/shared/PrimaryAction'
import { runPage } from '../animations/pages/runner'
import '../styles/pages.css'

/* COMPANY_PAGES_SPEC E: 404 ("404: Not Found"). Motion: Pill loop + button hover only. */
export default function NotFound() {
  const root = useRef(null)
  useLayoutEffect(() => {
    document.title = '404: Not Found'
    return runPage(root.current)
  }, [])
  return (
    <div ref={root} className="pg-404">
      <div className="u-h-[48] mob:h-0" />
      <section
        className="nf-wrapper grid w-full place-content-center place-items-center bg-silver04 text-center type-h2 text-blue02 u-p-[100] u-rounded-[24] mob:type-h3 mob:u-px-[0] mob:u-py-[80]"
        data-anim="nf-wrapper"
      >
        <PagePill />
        <h1 className="u-max-w-[722] u-mb-[56] u-mt-[16]">
          Oops, sorry!
          <br />
          The page you requested does not exist here.
        </h1>
        <PrimaryAction to="/">Take You Back Home</PrimaryAction>
      </section>
    </div>
  )
}
