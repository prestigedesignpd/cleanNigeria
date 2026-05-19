import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { AnimatePresence, motion } from 'framer-motion'
import { Building2, Briefcase, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppLogo } from '@/components/common/AppLogo'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { subscriptionService } from '@/services/subscription.service'
import { ROUTES } from '@/lib/routes'

const slideVariants = {
  enter: { x: 60, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -60, opacity: 0 },
}

type AccountType = 'estate' | 'business' | null

export default function OnboardingWizard() {
  const [step, setStep] = useState(1)
  const [accountType, setAccountType] = useState<AccountType>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const navigate = useNavigate()
  const totalSteps = 5

  const { data: plans = [] } = useQuery({
    queryKey: ['publicPlans', accountType],
    queryFn: () => subscriptionService.getPlans(accountType?.toUpperCase() || undefined),
    enabled: step >= 3,
  })

  const goNext = () => setStep((s) => Math.min(s + 1, totalSteps))
  const goBack = () => setStep((s) => Math.max(s - 1, 1))

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">What describes you best?</h2>
              <p className="text-muted-foreground">We'll customise your experience based on your selection</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { type: 'estate' as const, icon: Building2, title: 'I manage / live in an Estate', desc: 'Estate managers or unit residents' },
                { type: 'business' as const, icon: Briefcase, title: 'I own / manage a Business', desc: 'Shops, supermarkets, schools, hospitals, etc.' },
              ].map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => setAccountType(opt.type)}
                  className={cn(
                    'relative flex flex-col items-center gap-4 rounded-2xl border-2 p-6 text-center transition-all hover:shadow-card-hover',
                    accountType === opt.type ? 'border-brand-600 bg-brand-50' : 'border-border hover:border-brand-300'
                  )}
                >
                  {accountType === opt.type && (
                    <span className="absolute right-3 top-3">
                      <CheckCircle2 className="h-5 w-5 text-brand-600" />
                    </span>
                  )}
                  <div className={cn('flex h-14 w-14 items-center justify-center rounded-xl', accountType === opt.type ? 'bg-brand-600' : 'bg-muted')}>
                    <opt.icon className={cn('h-7 w-7', accountType === opt.type ? 'text-white' : 'text-muted-foreground')} />
                  </div>
                  <div>
                    <p className="font-semibold">{opt.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{accountType === 'estate' ? 'Estate Details' : 'Business Details'}</h2>
              <p className="text-muted-foreground">Tell us about your {accountType}</p>
            </div>
            <div className="space-y-4">
              {accountType === 'estate' ? (
                <>
                  <div className="space-y-2"><label className="text-sm font-medium">Estate Name</label><input placeholder="Green Court Estate" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div>
                  <div className="space-y-2"><label className="text-sm font-medium">Estate Address</label><input placeholder="12 Admiralty Way, Lekki" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><label className="text-sm font-medium">State</label><input placeholder="Lagos" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div>
                    <div className="space-y-2"><label className="text-sm font-medium">LGA</label><input placeholder="Eti-Osa" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div>
                  </div>
                  <div className="space-y-2"><label className="text-sm font-medium">Number of Units / Homes</label><input type="number" placeholder="120" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div>
                </>
              ) : (
                <>
                  <div className="space-y-2"><label className="text-sm font-medium">Business Name</label><input placeholder="Folake's Supermarket" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div>
                  <div className="space-y-2"><label className="text-sm font-medium">Business Type</label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <option>Supermarket</option><option>School</option><option>Hospital</option><option>Shop</option><option>Restaurant</option><option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-2"><label className="text-sm font-medium">Address</label><input placeholder="Business address" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div>
                </>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Your Collection Zone</h2>
              <p className="text-muted-foreground">We detected your zone based on the address you provided</p>
            </div>
            <div className="rounded-xl border-2 border-brand-300 bg-brand-50 p-6 space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-brand-600" />
                <div>
                  <p className="font-semibold text-brand-800">Zone: Lekki Phase 1</p>
                  <p className="text-sm text-brand-700">Collections in your area happen on: <strong>Monday & Thursday</strong></p>
                </div>
              </div>
              <p className="text-xs text-brand-600">Time window: 8:00 AM – 12:00 PM</p>
            </div>
            <div className="h-48 rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-sm">
              📍 Interactive map loads here (Leaflet)
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Choose Your Plan</h2>
              <p className="text-muted-foreground">Select the plan that fits your needs. You can change later.</p>
            </div>
            <div className="space-y-3">
              {plans.slice(0, 3).map((plan: any) => (
                <button
                  key={plan._id}
                  onClick={() => setSelectedPlan(plan._id)}
                  className={cn(
                    'w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all',
                    selectedPlan === plan._id ? 'border-brand-600 bg-brand-50' : 'border-border hover:border-brand-300'
                  )}
                >
                  {selectedPlan === plan._id && <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0" />}
                  {selectedPlan !== plan._id && <div className="h-5 w-5 rounded-full border-2 border-border shrink-0" />}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{plan.name}</span>
                      {plan.isFeatured && <span className="text-xs bg-brand-600 text-white px-2 py-0.5 rounded-full">Popular</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">{plan.description}</p>
                  </div>
                  <span className="font-bold text-brand-600 shrink-0">₦{((plan.pricing?.monthly || 0) / 100000).toFixed(0)}k/mo</span>
                </button>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Complete Payment</h2>
              <p className="text-muted-foreground">Start your subscription with a 30-day money-back guarantee</p>
            </div>
            <div className="rounded-xl border border-border p-5 space-y-3">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Plan</span><span className="font-medium">Standard Plan</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Billing</span><span className="font-medium">Monthly</span></div>
              <div className="h-px bg-border" />
              <div className="flex justify-between font-bold"><span>Total Today</span><span className="text-brand-600">₦12,000</span></div>
            </div>
            <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white h-12 text-base" onClick={() => navigate(ROUTES.ONBOARDING_SUCCESS)}>
              Pay ₦12,000 with Paystack
            </Button>
            <button onClick={() => navigate(ROUTES.ONBOARDING_SUCCESS)} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">
              Pay later (start 7-day free trial)
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      <Helmet><title>Setup Your Account | CleanNigeria</title></Helmet>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-border px-4 py-4">
          <div className="mx-auto max-w-2xl flex items-center justify-between">
            <AppLogo />
            <span className="text-sm text-muted-foreground">Step {step} of {totalSteps}</span>
          </div>
        </header>

        {/* Progress */}
        <div className="h-1 bg-muted">
          <div className="h-full bg-brand-600 transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%` }} />
        </div>

        {/* Content */}
        <main className="flex flex-1 items-start justify-center px-4 py-10">
          <div className="w-full max-w-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Button variant="ghost" onClick={goBack} disabled={step === 1} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              {step < totalSteps && (
                <Button
                  onClick={goNext}
                  disabled={step === 1 && !accountType}
                  className="gap-2 bg-brand-600 hover:bg-brand-700 text-white"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
