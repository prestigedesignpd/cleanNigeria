import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/lib/routes'
import { ChevronLeft, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

const REASONS = [
  { id: 'too-expensive', label: 'It is too expensive' },
  { id: 'missing-features', label: 'Missing features I need' },
  { id: 'not-using', label: "I'm not using it enough" },
  { id: 'found-better', label: 'Found a better alternative' },
  { id: 'other', label: 'Other' },
]

export default function CancelSubscriptionPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [reason, setReason] = useState('')

  const handleCancel = () => {
    toast.error('Subscription cancelled', {
      description: 'Your subscription will remain active until the end of the current period.',
    })
    navigate(ROUTES.SUBSCRIPTION)
  }

  return (
    <>
      <Helmet><title>Cancel Subscription | CleanNigeria</title></Helmet>
      
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-1">
          <Link to={ROUTES.SUBSCRIPTION} className="text-xs text-muted-foreground hover:text-brand-600 flex items-center gap-1 mb-2 transition-colors">
            <ChevronLeft className="h-3 w-3" />
            Back to Subscription
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Cancel Subscription</h1>
          <p className="text-muted-foreground text-sm">We're sorry to see you go. Help us improve by telling us why.</p>
        </div>

        <Card className="border-slate-200 overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <CardHeader>
                  <CardTitle>Why are you cancelling?</CardTitle>
                  <CardDescription>Select the primary reason for leaving.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={reason} onValueChange={setReason} className="space-y-3">
                    {REASONS.map((r) => (
                      <div key={r.id} className="flex items-center space-x-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                        <RadioGroupItem value={r.id} id={r.id} />
                        <Label htmlFor={r.id} className="flex-1 cursor-pointer font-medium">{r.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button variant="ghost" asChild>
                      <Link to={ROUTES.SUBSCRIPTION}>Keep My Plan</Link>
                    </Button>
                    <Button 
                      disabled={!reason}
                      onClick={() => setStep(2)}
                      className="bg-brand-600 hover:bg-brand-700 text-white"
                    >
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-brand-50 flex items-center justify-center mb-4 text-brand-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <CardTitle>Wait! Before you go...</CardTitle>
                  <CardDescription>Did you know you can pause your subscription for up to 3 months?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-brand-100 bg-brand-50/50 space-y-2">
                      <p className="font-bold text-brand-900">Pause Subscription</p>
                      <p className="text-xs text-brand-700">Keep your data and settings. Resume anytime.</p>
                      <Button variant="outline" className="w-full mt-2 text-brand-700 border-brand-200 bg-white hover:bg-brand-50">Pause Instead</Button>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                      <p className="font-bold text-slate-900">Downgrade Plan</p>
                      <p className="text-xs text-slate-600">Switch to our Basic plan starting at just ₦5k.</p>
                      <Button asChild variant="outline" className="w-full mt-2">
                        <Link to={ROUTES.CHANGE_PLAN}>View Plans</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <Button variant="ghost" onClick={() => setStep(1)} className="text-xs">
                      <ChevronLeft className="h-3 w-3 mr-1" />
                      Back
                    </Button>
                    <Button 
                      variant="ghost"
                      onClick={() => setStep(3)}
                      className="text-destructive hover:bg-destructive/10 text-xs"
                    >
                      No thanks, continue to cancel
                    </Button>
                  </div>
                </CardContent>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <CardHeader className="bg-destructive/5 border-b border-destructive/10">
                  <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4 text-destructive">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-destructive">Confirm Cancellation</CardTitle>
                  <CardDescription className="text-destructive/80 font-medium">This is permanent. You will lose access to premium features.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-slate-900 uppercase tracking-wider">What you'll lose:</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Priority collection scheduling',
                        'Live waste collector tracking',
                        'Advanced analytics & reporting',
                        'Unlimited support tickets',
                        'Complaint management tools',
                        'Referral bonus payouts',
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Your plan will remain active until <strong>June 30, 2026</strong>. After that, you will be moved to the free tier and your data will be archived.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    <Button 
                      onClick={handleCancel}
                      variant="destructive"
                      className="w-full"
                    >
                      Confirm Cancellation
                    </Button>
                    <Button variant="ghost" asChild className="w-full">
                      <Link to={ROUTES.SUBSCRIPTION}>I've changed my mind, keep my plan</Link>
                    </Button>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </>
  )
}

