import React, { useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Sparkles,
  CalendarCheck,
  Users,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAdmin } from '@/hooks/useAdmin'
import logoSvg from '@/assets/TaYoga_Logo.svg'

const AdminLayout: React.FC = () => {
  const { isAuthenticated, isLoading, signOut, user } = useAdmin()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin')
    }
  }, [isAuthenticated, isLoading, navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin')
  }

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Přehled' },
    { to: '/admin/classes', icon: BookOpen, label: 'Lekce' },
    { to: '/admin/one-time', icon: CalendarCheck, label: 'Jednorázové' },
    { to: '/admin/workshops', icon: Sparkles, label: 'Workshopy' },
    { to: '/admin/calendar', icon: Calendar, label: 'Kalendář' },
    { to: '/admin/visitors', icon: Users, label: 'Návštěvníci' },
    { to: '/admin/messages', icon: MessageSquare, label: 'Zprávy' },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Načítám...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border hidden lg:flex flex-col z-40">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <img src={logoSvg} alt="TaYoga" className="h-8 w-auto" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Zobrazit web
          </a>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Odhlásit se
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img src={logoSvg} alt="TaYoga" className="h-7 w-auto" />
            <span className="text-sm font-semibold">Admin</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg"
          >
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
              <hr className="my-2 border-border" />
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Odhlásit se
              </Button>
            </nav>
          </motion.div>
        )}
      </header>

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
