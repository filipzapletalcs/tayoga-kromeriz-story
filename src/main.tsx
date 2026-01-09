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
      // Lazy loaded pages inside Layout (need QueryClientProvider)
      {
        path: 'rezervace',
        lazy: () => import('./pages/Rezervace'),
      },
      {
        path: 'cookies',
        lazy: () => import('./pages/Cookies'),
      },
    ],
  },
  {
    path: '/admin/*',
    lazy: () => import('./pages/admin/AdminRoutes'),
  },
  // Explicit 404 route for SSG to generate 404.html (Vercel will serve this with HTTP 404)
  // Head component in NotFound handles SEO meta tags
  {
    path: '/404',
    element: <NotFound />,
  },
  // Catch-all for client-side navigation to non-existent routes
  {
    path: '*',
    element: <NotFound />,
  },
]

export const createRoot = ViteReactSSG(
  { routes, basename: import.meta.env.BASE_URL },
  ({ isClient }) => {
    if (isClient) {
      // Handle chunk loading failures after new deployments
      // When a new version is deployed, old cached JS tries to load non-existent chunks
      // This causes "Failed to fetch dynamically imported module" errors
      window.addEventListener('error', (event) => {
        const isChunkError =
          event.message?.includes('Failed to fetch dynamically imported module') ||
          event.message?.includes('Loading chunk') ||
          event.message?.includes('Loading CSS chunk');

        if (isChunkError) {
          // Prevent infinite reload loop using sessionStorage
          const reloadKey = 'chunk_reload_' + window.location.pathname;
          const lastReload = sessionStorage.getItem(reloadKey);
          const now = Date.now();

          // Only reload if we haven't reloaded in the last 10 seconds
          if (!lastReload || (now - parseInt(lastReload)) > 10000) {
            sessionStorage.setItem(reloadKey, now.toString());
            console.log('[TaYoga] New version detected, reloading...');
            window.location.reload();
          }
        }
      });

      // Also handle unhandled promise rejections (dynamic imports)
      window.addEventListener('unhandledrejection', (event) => {
        const reason = event.reason?.message || String(event.reason);
        const isChunkError =
          reason.includes('Failed to fetch dynamically imported module') ||
          reason.includes('Loading chunk') ||
          reason.includes('MIME type');

        if (isChunkError) {
          const reloadKey = 'chunk_reload_' + window.location.pathname;
          const lastReload = sessionStorage.getItem(reloadKey);
          const now = Date.now();

          if (!lastReload || (now - parseInt(lastReload)) > 10000) {
            sessionStorage.setItem(reloadKey, now.toString());
            console.log('[TaYoga] New version detected, reloading...');
            window.location.reload();
          }
        }
      });
    }
  }
)
