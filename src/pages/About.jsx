import { useLayoutEffect, useRef } from 'react'
import AboutHero from '../components/about/AboutHero'
import Founded from '../components/about/Founded'
import Anywhere from '../components/about/Anywhere'
import Leadership from '../components/about/Leadership'
import Careers from '../components/about/Careers'
import { initAbout } from '../animations/pages/about'
import '../styles/pages.css'

/* COMPANY_PAGES_SPEC A: /about/ ("Impilo | About Us") */
export default function About() {
  const root = useRef(null)
  useLayoutEffect(() => {
    document.title = 'Impilo | About Us'
    return initAbout(root.current)
  }, [])
  return (
    <div ref={root} className="pg-about">
      <AboutHero />
      <Founded />
      <Anywhere />
      <Leadership />
      <Careers />
    </div>
  )
}
