import Home from './pages/Home'
import BlogIndex from './pages/blog/BlogIndex'
import BlogPost from './pages/blog/BlogPost'
import Developers from './pages/Developers'
import Careers from './pages/Careers'
import NotFound from './pages/NotFound'
import About from './pages/About'
import IntegrationsPage from './pages/IntegrationsPage'
import RequestDemo from './pages/RequestDemo'
import Legal from './pages/Legal'
import SolutionsOverview from './pages/SolutionsOverview'
import ContentPage from './pages/ContentPage'
import { contentPageRoutes } from './data/contentPages'

/*
 * Route table. Every entry renders inside the shared Layout (Preloader, Header, <main>, footer,
 * page transition). To add a page: import it and append { path, element } ABOVE the catch-all.
 * Paths are written without a trailing slash; react-router also matches "/path/".
 */
export const routes = [
  { path: '/', element: <Home /> },
  { path: '/blog', element: <BlogIndex /> },
  { path: '/blog/:slug', element: <BlogPost /> },
  { path: '/developers', element: <Developers /> },
  { path: '/careers', element: <Careers /> },
  { path: '/about', element: <About /> },
  { path: '/integrations', element: <IntegrationsPage /> },
  { path: '/request-demo', element: <RequestDemo /> },
  { path: '/terms', element: <Legal page="terms" /> },
  { path: '/privacy', element: <Legal page="privacy" /> },
  { path: '/app-privacy', element: <Legal page="app-privacy" /> },
  { path: '/solutions', element: <SolutionsOverview /> },
  ...contentPageRoutes.map(({ path, key }) => ({ path, element: <ContentPage pageKey={key} /> })),
  // ...append new pages here...

  // Catch-all 404: keep LAST.
  { path: '*', element: <NotFound /> },
]
