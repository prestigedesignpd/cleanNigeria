import { Helmet } from 'react-helmet-async'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { StatusBadge } from '@/components/common/StatusBadge'
import { formatDate, formatCurrency } from '@/lib/formatters'
import { ROUTES } from '@/lib/routes'
import { useSubscriptionStore } from '@/store/subscriptionStore'
import { subscriptionService } from '@/services/subscription.service'
import { useState, useEffect } from 'react'
import { AppLoader } from '@/components/common/AppLoader'

export default function SubscriptionPage() {
  const { subscription, setSubscription } = useSubscriptionStore()
  const [isLoading, setIsLoading] = useState(!subscription)

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!subscription) setIsLoading(true)
      try {
        const subs = await subscriptionService.getMySubscriptions()
        setSubscription(subs[0] || null)
      } catch (error) {
        console.error('Failed to fetch subscription:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscription()
  }, [setSubscription, subscription])

  const sub = subscription

  if (isLoading) {
    return <AppLoader />
  }

  if (!sub) {
    return (
      <>
        <Helmet><title>Subscription | CleanNigeria</title></Helmet>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">My Subscription</h1>
            <p className="text-muted-foreground text-sm">Manage your plan and billing</p>
          </div>
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <p className="text-muted-foreground">You do not have an active subscription.</p>
              <Button asChild className="bg-brand-600 hover:bg-brand-700 text-white">
                <Link to={ROUTES.PRICING || '/pricing'}>View Plans</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet><title>Subscription | CleanNigeria</title></Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Subscription</h1>
          <p className="text-muted-foreground text-sm">Manage your plan and billing</p>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{sub.plan.name} Plan</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{sub.plan.description}</p>
              </div>
              <StatusBadge status={sub.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Price', value: formatCurrency(sub.plan.monthlyPrice) + '/mo' },
                { label: 'Billing Cycle', value: sub.billingCycle },
                { label: 'Period Start', value: formatDate(sub.currentPeriodStart) },
                { label: 'Renews', value: formatDate(sub.currentPeriodEnd) },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-semibold mt-1 capitalize">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Collections Used</p>
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-brand-600 rounded-full" style={{ width: `${(sub.collectionsUsed / sub.collectionsIncluded) * 100}%` }} />
                </div>
                <span className="text-sm text-muted-foreground shrink-0">{sub.collectionsUsed}/{sub.collectionsIncluded}</span>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button asChild className="bg-brand-600 hover:bg-brand-700 text-white">
                <Link to={ROUTES.CHANGE_PLAN}>Change Plan</Link>
              </Button>
              <Button asChild variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                <Link to={ROUTES.CANCEL_SUBSCRIPTION}>Cancel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
