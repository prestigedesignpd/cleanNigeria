import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import { AppLogo } from '@/components/common/AppLogo'
import { ROUTES } from '@/lib/routes'
import { APP_CONFIG } from '@/config/app.config'

// ─── Inline SVG brand icons (lucide-react does not include brand/social logos) ─
function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L2.25 2.25h6.962l4.265 5.638 4.767-5.638Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  )
}

// ─── Data ──────────────────────────────────────────────────────────────────────
const footerLinks = {
  Services: [
    { label: 'Estate Collection', href: ROUTES.SERVICES },
    { label: 'Business Pickup', href: ROUTES.SERVICES },
    { label: 'Extra Pickups', href: ROUTES.SERVICES },
    { label: 'Coverage Areas', href: ROUTES.COVERAGE },
  ],
  Company: [
    { label: 'About Us', href: ROUTES.ABOUT },
    { label: 'Pricing', href: ROUTES.PRICING },
    { label: 'Blog', href: ROUTES.BLOG },
    { label: 'FAQ', href: ROUTES.FAQ },
    { label: 'Contact', href: ROUTES.CONTACT },
  ],
  Legal: [
    { label: 'Privacy Policy', href: ROUTES.PRIVACY },
    { label: 'Terms of Service', href: ROUTES.TERMS },
  ],
}

const socials = [
  { Icon: IconX, href: APP_CONFIG.social.twitter, label: 'X (Twitter)' },
  { Icon: IconInstagram, href: APP_CONFIG.social.instagram, label: 'Instagram' },
  { Icon: IconFacebook, href: APP_CONFIG.social.facebook, label: 'Facebook' },
  { Icon: IconLinkedIn, href: APP_CONFIG.social.linkedin, label: 'LinkedIn' },
]

// ─── Component ─────────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">

          {/* Brand column */}
          <div className="lg:col-span-2 space-y-4">
            <AppLogo />
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Nigeria's most reliable waste collection subscription service for estates, businesses, and institutions.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50 transition-all"
                >
                  <s.Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} className="space-y-3">
              <h3 className="font-semibold text-sm text-foreground">{heading}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-brand-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-foreground">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-brand-600" />
                <span>{APP_CONFIG.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-brand-600" />
                <a href={`tel:${APP_CONFIG.phone}`} className="hover:text-brand-600 transition-colors">
                  {APP_CONFIG.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-brand-600" />
                <a href={`mailto:${APP_CONFIG.email}`} className="hover:text-brand-600 transition-colors">
                  {APP_CONFIG.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} CleanNigeria Ltd. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to={ROUTES.PRIVACY} className="hover:text-brand-600 transition-colors">Privacy</Link>
            <Link to={ROUTES.TERMS} className="hover:text-brand-600 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
