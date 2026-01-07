import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AdminProvider } from "@/hooks/useAdmin";

// Lazy-loaded admin pages
const AdminLogin = lazy(() => import("./AdminLogin"));
const AdminLayout = lazy(() => import("./AdminLayout"));
const AdminDashboard = lazy(() => import("./AdminDashboard"));
const AdminClasses = lazy(() => import("./AdminClasses"));
const AdminOneTimeClasses = lazy(() => import("./AdminOneTimeClasses"));
const AdminWorkshops = lazy(() => import("./AdminWorkshops"));
const AdminCalendar = lazy(() => import("./AdminCalendar"));
const AdminVisitors = lazy(() => import("./AdminVisitors"));
const AdminMessages = lazy(() => import("./AdminMessages"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-muted-foreground">Načítání...</div>
  </div>
);

// AdminRoutes wraps all admin routes with AdminProvider
// This ensures Supabase is only loaded when accessing admin pages
const AdminRoutes = () => (
  <AdminProvider>
    <Routes>
      <Route index element={
        <Suspense fallback={<LoadingFallback />}>
          <AdminLogin />
        </Suspense>
      } />
      <Route element={
        <Suspense fallback={<LoadingFallback />}>
          <AdminLayout />
        </Suspense>
      }>
        <Route path="dashboard" element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminDashboard />
          </Suspense>
        } />
        <Route path="classes" element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminClasses />
          </Suspense>
        } />
        <Route path="one-time" element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminOneTimeClasses />
          </Suspense>
        } />
        <Route path="workshops" element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminWorkshops />
          </Suspense>
        } />
        <Route path="calendar" element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminCalendar />
          </Suspense>
        } />
        <Route path="visitors" element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminVisitors />
          </Suspense>
        } />
        <Route path="messages" element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminMessages />
          </Suspense>
        } />
      </Route>
    </Routes>
  </AdminProvider>
);

export default AdminRoutes;
