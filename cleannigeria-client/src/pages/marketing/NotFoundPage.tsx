import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Home, ArrowLeft, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/routes'

export default function NotFoundPage() {
  return (
    <>
      <Helmet><title>404 — Page Not Found | CleanNigeria</title></Helmet>
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center px-4">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-50 animate-bounce-slow">
          <Truck className="h-12 w-12 text-brand-600" />
        </div>
        <div className="space-y-2">
          <p className="text-6xl font-bold text-brand-600">404</p>
          <h1 className="text-2xl font-bold">Page Not Found</h1>
          <p className="text-muted-foreground max-w-sm">
            Looks like this page got picked up with the wrong bin. Let's get you back on track.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Button>
          <Button asChild className="bg-brand-600 hover:bg-brand-700 text-white gap-2">
            <Link to={ROUTES.HOME}><Home className="h-4 w-4" /> Home</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
