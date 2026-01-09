import { ViteReactSSG } from 'vite-react-ssg'
import type { RouteRecord } from 'vite-react-ssg'
import './index.css'

// Import components directly for SSG
import Layout from './components/Layout'
import Index from './pages/Index'
import NotFound from './pages/NotFound'

// Routes configuration for SSG
export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Index /> },
      { path: 'o-studiu', element: <Index /> },
      { path: 'lektorka', element: <Index /> },
      { path: 'lekce', element: <Index /> },
      { path: 'unikatnost', element: <Index /> },
      { path: 'rozvrh', element: <Index /> },
      { path: 'kontakt', element: <Index /> },
    ],
  },
  {
    path: '/rezervace',
    lazy: () => import('./pages/Rezervace'),
  },
  {
    path: '/cookies',
    lazy: () => import('./pages/Cookies'),
  },
  {
    path: '/admin/*',
    lazy: () => import('./pages/admin/AdminRoutes'),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]

export const createRoot = ViteReactSSG(
  { routes, basename: import.meta.env.BASE_URL },
  ({ isClient }) => {
    // Client-only initialization
    if (isClient) {
      // GTM and analytics are already deferred in index.html
    }
  }
)
