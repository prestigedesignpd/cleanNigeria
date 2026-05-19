import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppLogo } from '@/components/common/AppLogo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/routes'
import { useAuthStore } from '@/store/authStore'

const navLinks = [
  { label: 'Services', href: ROUTES.SERVICES },
  { label: 'Pricing', href: ROUTES.PRICING },
  { label: 'Coverage', href: ROUTES.COVERAGE },
  { label: 'About', href: ROUTES.ABOUT },
  { label: 'Blog', href: ROUTES.BLOG },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-border'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <AppLogo />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Button asChild className="bg-brand-600 hover:bg-brand-700 text-white shadow-brand">
              <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to={ROUTES.LOGIN}>Log In</Link>
              </Button>
              <Button asChild className="bg-brand-600 hover:bg-brand-700 text-white shadow-brand">
                <Link to={ROUTES.REGISTER}>Get Started Free</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden rounded-lg p-2 hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-white overflow-hidden"
          >
            <nav className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      isActive ? 'text-brand-600 bg-brand-50' : 'text-foreground hover:bg-muted'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="outline" asChild className="w-full">
                  <Link to={ROUTES.LOGIN} onClick={() => setMobileOpen(false)}>Log In</Link>
                </Button>
                <Button asChild className="w-full bg-brand-600 hover:bg-brand-700 text-white">
                  <Link to={ROUTES.REGISTER} onClick={() => setMobileOpen(false)}>Get Started Free</Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
