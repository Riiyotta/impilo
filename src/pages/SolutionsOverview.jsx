import { useLayoutEffect, useRef } from 'react'
import SolutionsHero from '../components/solutions/SolutionsHero'
import Explore from '../components/solutions/Explore'
import Support from '../components/solutions/Support'
import Platform from '../components/solutions/Platform'
import ApiPlatform from '../components/solutions/ApiPlatform'
import { initSolutions } from '../animations/pages/solutions'
import '../styles/solutions.css'

/* Template A: /solutions/ (specs/SOLUTIONS_USECASES_SPEC.md section 1). Main content only. */
export default function SolutionsOverview() {
  const root = useRef(null)
  useLayoutEffect(() => {
    document.title = 'Impilo | Solutions'
    return initSolutions(root.current)
  }, [])
  return (
    <div ref={root} data-page="solutions">
      <SolutionsHero />
      <Explore />
      <Support />
      <Platform />
      <ApiPlatform />
    </div>
  )
}
