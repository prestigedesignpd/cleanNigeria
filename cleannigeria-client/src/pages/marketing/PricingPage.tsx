import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { subscriptionService } from '@/services/subscription.service'
import { ROUTES } from '@/lib/routes'
import { buildSeoMeta } from '@/lib/seo'
import { cn } from '@/lib/utils'

export default function PricingPage() {
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly')
  const seo = buildSeoMeta({ title: 'Pricing', description: 'Simple, transparent pricing for estates and businesses. No hidden fees.' })

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['publicPlans'],
    queryFn: () => subscriptionService.getPlans()
  })

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      {/* Hero */}
      <section className="gradient-mesh py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center space-y-4">
          <Badge className="bg-brand-50 text-brand-700 border-brand-200">Pricing</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground">No hidden fees. Cancel anytime. First month free for new estates.</p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 rounded-xl border border-border bg-background p-1.5 mt-6">
            <button
              onClick={() => setCycle('monthly')}
              className={cn('rounded-lg px-5 py-2 text-sm font-medium transition-all', cycle === 'monthly' ? 'bg-brand-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground')}
            >
              Monthly
            </button>
            <button
              onClick={() => setCycle('yearly')}
              className={cn('flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-all', cycle === 'yearly' ? 'bg-brand-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground')}
            >
              Yearly
              <Badge className="bg-green-100 text-green-700 border-0 text-[10px] py-0 px-1.5">Save 20%</Badge>
            </button>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-brand-600 mb-4" />
                <p className="text-muted-foreground font-medium">Loading pricing plans...</p>
              </div>
            ) : plans.map((plan: any, i: number) => {
              const monthlyPrice = plan.pricing?.monthly || 0
              const yearlyPrice = plan.pricing?.yearly || 0
              const price = cycle === 'monthly' ? monthlyPrice : yearlyPrice / 12
              const isEnterprise = plan.slug === 'enterprise' || plan.name.toLowerCase().includes('enterprise')
              const isPopular = plan.isFeatured

              return (
                <motion.div
                  key={plan._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={isPopular ? 'lg:scale-105 lg:z-10' : ''}
                >
                  <Card className={`h-full flex flex-col ${isPopular ? 'border-brand-500 shadow-brand-lg' : 'hover:shadow-card-hover'} transition-all`}>
                    {isPopular && (
                      <div className="rounded-t-lg bg-brand-600 py-2 text-center text-xs font-semibold text-white">
                        ⭐ Most Popular
                      </div>
                    )}
                    <CardContent className="flex flex-col flex-1 p-6 space-y-5">
                      <div>
                        <h2 className="font-bold text-xl">{plan.name}</h2>
                        <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                      </div>
                      <div>
                        {isEnterprise ? (
                          <p className="text-2xl font-bold">Custom</p>
                        ) : (
                          <div>
                            <span className="text-3xl font-bold">₦{(price / 100000).toFixed(0)}k</span>
                            <span className="text-muted-foreground text-sm">/month</span>
                            {cycle === 'yearly' && (
                              <p className="text-xs text-brand-600 mt-1">Billed ₦{(yearlyPrice / 100000).toFixed(0)}k/year</p>
                            )}
                          </div>
                        )}
                      </div>
                      <ul className="space-y-2 flex-1">
                        {plan.features?.map((f: any, idx: number) => (
                          <li key={idx} className={cn("flex items-start gap-2 text-sm", !f.included && "opacity-50 line-through")}>
                            <CheckCircle2 className={cn("h-4 w-4 shrink-0 mt-0.5", f.included ? "text-brand-600" : "text-muted-foreground")} />
                            <span className="text-muted-foreground">{f.text || f}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        asChild
                        variant={isPopular ? 'default' : 'outline'}
                        className={isPopular ? 'bg-brand-600 hover:bg-brand-700 text-white w-full' : 'w-full'}
                      >
                        <Link to={isEnterprise ? ROUTES.CONTACT : ROUTES.REGISTER}>
                          {isEnterprise ? 'Contact Sales' : 'Get Started'}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Guarantee */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 px-6 py-4">
              <CheckCircle2 className="h-6 w-6 text-brand-600" />
              <div className="text-left">
                <p className="font-semibold text-brand-800">30-Day Money Back Guarantee</p>
                <p className="text-sm text-brand-700">Not satisfied? We'll refund you. No questions asked.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
