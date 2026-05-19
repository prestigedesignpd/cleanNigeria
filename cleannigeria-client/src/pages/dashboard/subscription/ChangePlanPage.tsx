import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowRight, ChevronLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { subscriptionService } from '@/services/subscription.service'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function ChangePlanPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [isConfirming, setIsConfirming] = useState(false)

  const { data: plans = [] } = useQuery({
    queryKey: ['publicPlans'],
    queryFn: () => subscriptionService.getPlans()
  })

  const { data: subscriptions = [] } = useQuery({
    queryKey: ['mySubscriptions'],
    queryFn: () => subscriptionService.getMySubscriptions()
  })

  const currentSubscription = subscriptions[0] || null

  const changePlanMutation = useMutation({
    mutationFn: (payload: { planId: string, billingCycle: 'monthly' | 'yearly' }) => subscriptionService.changePlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySubscriptions'] })
      toast.success('Subscription updated successfully!', {
        description: `You are now on the new plan.`,
      })
      setIsConfirming(false)
      navigate(ROUTES.SUBSCRIPTION)
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update subscription')
    }
  })

  const handleSelectPlan = (plan: any) => {
    if (plan._id === currentSubscription?.planId?._id) return
    setSelectedPlan(plan)
    setIsConfirming(true)
  }

  const handleConfirmChange = () => {
    if (!selectedPlan) return
    changePlanMutation.mutate({ planId: selectedPlan._id, billingCycle: cycle })
  }

  return (
    <>
      <Helmet><title>Change Plan | CleanNigeria</title></Helmet>
      
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link to={ROUTES.SUBSCRIPTION} className="text-xs text-muted-foreground hover:text-brand-600 flex items-center gap-1 mb-2 transition-colors">
              <ChevronLeft className="h-3 w-3" />
              Back to Subscription
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Change Plan</h1>
            <p className="text-muted-foreground text-sm">Select a new plan. Upgrades are prorated and charged today.</p>
          </div>

          {/* Cycle Toggle */}
          <div className="inline-flex items-center gap-3 rounded-xl border border-border bg-white p-1 shadow-sm self-start md:self-center">
            <button
              onClick={() => setCycle('monthly')}
              className={cn(
                'rounded-lg px-4 py-1.5 text-xs font-medium transition-all',
                cycle === 'monthly' ? 'bg-brand-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setCycle('yearly')}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-medium transition-all',
                cycle === 'yearly' ? 'bg-brand-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Yearly
              <Badge className="bg-green-100 text-green-700 border-0 text-[10px] py-0 px-1.5 h-4">Save 20%</Badge>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {plans.filter((p: any) => p.slug !== 'enterprise' && !p.name.toLowerCase().includes('enterprise')).map((plan: any, i: number) => {
            const monthlyPrice = plan.pricing?.monthly || 0
            const yearlyPrice = plan.pricing?.yearly || 0
            const price = cycle === 'monthly' ? monthlyPrice : yearlyPrice / 12
            const isCurrent = plan._id === currentSubscription?.planId?._id
            
            return (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={cn(
                  'h-full flex flex-col relative transition-all border-slate-200',
                  isCurrent ? 'ring-2 ring-brand-500 shadow-brand-sm' : 'hover:shadow-md hover:border-brand-200'
                )}>
                  {isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Current Plan
                    </div>
                  )}
                  <CardContent className="flex flex-col flex-1 p-5 space-y-4">
                    <div>
                      <h2 className="font-bold text-lg text-slate-900">{plan.name}</h2>
                      <p className="text-xs text-muted-foreground mt-1 min-h-[32px]">{plan.description}</p>
                    </div>

                    <div className="py-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-slate-900">₦{(price / 100000).toFixed(0)}k</span>
                        <span className="text-muted-foreground text-xs">/month</span>
                      </div>
                      {cycle === 'yearly' && (
                        <p className="text-[10px] text-brand-600 font-medium mt-0.5">Billed ₦{(yearlyPrice / 100000).toFixed(0)}k/year</p>
                      )}
                    </div>

                    <ul className="space-y-2 flex-1 pt-2">
                      {plan.features?.slice(0, 5).map((f: any, idx: number) => (
                        <li key={idx} className={cn("flex items-start gap-2 text-xs", !f.included && "opacity-50 line-through")}>
                          <CheckCircle2 className={cn("h-3.5 w-3.5 shrink-0 mt-0.5", f.included ? "text-brand-600" : "text-muted-foreground")} />
                          <span className={cn(f.included ? "text-slate-600" : "text-slate-400")}>{f.text || f}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={isCurrent}
                      variant={isCurrent ? 'secondary' : 'default'}
                      className={cn(
                        'w-full text-xs h-9 transition-all',
                        isCurrent 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                          : 'bg-brand-600 hover:bg-brand-700 text-white'
                      )}
                    >
                      {isCurrent ? 'Current Plan' : 'Select Plan'}
                      {!isCurrent && <ArrowRight className="h-3.5 w-3.5 ml-2" />}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Enterprise Notice */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-slate-900">Need more for your business?</h3>
            <p className="text-sm text-muted-foreground">Custom enterprise solutions with dedicated support and SLA guarantees.</p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <Link to={ROUTES.SUPPORT}>Contact Sales</Link>
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to switch to the <strong>{selectedPlan?.name}</strong> plan. 
              The change will take effect immediately. Any price difference will be charged or credited to your next invoice.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmChange} disabled={changePlanMutation.isPending} className="bg-brand-600 hover:bg-brand-700 text-white border-0">
              {changePlanMutation.isPending ? 'Updating...' : 'Confirm Change'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

