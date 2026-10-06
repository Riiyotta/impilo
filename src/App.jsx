import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import { routes } from './routes'

/*
 * Router: every route in src/routes.jsx renders inside the shared Layout.
 * A data router (not <BrowserRouter>) so the page transition can hold browser back/forward
 * (useBlocker) until the overlay covers the old page. v7 future flags opt in early and
 * silence the deprecation warnings.
 */
const router = createBrowserRouter([{ element: <Layout />, children: routes }], {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
})

export default function App() {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />
}
