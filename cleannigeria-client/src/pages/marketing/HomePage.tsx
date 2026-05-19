import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowRight, Play, CheckCircle2, Star, Building2, Briefcase, Recycle } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/lib/routes'
import { APP_CONFIG } from '@/config/app.config'
import { mockTestimonials } from '@/mock'
import { buildSeoMeta } from '@/lib/seo'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { subscriptionService } from '@/services/subscription.service'

import { cmsService } from '@/services/cms.service'

const DEFAULT_HERO = {
  title: 'A Cleaner Nigeria Starts Here',
  subtitle: 'Reliable, tech-powered waste collection for estates and businesses. Subscribe once, enjoy scheduled pickups, live tracking, and 24/7 support.',
  images: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=2070&auto=format&fit=crop'
  ]
}

// ─── Lightweight animated counter (replaces react-countup) ────────────────────
function useCountUp(end: number, duration = 2000, active = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [active, end, duration])
  return active ? count : 0
}

function StatCounter({ label, end, suffix, active }: { label: string; end: number | string; suffix: string; active: boolean }) {
  // Parse end value, stripping non-numeric characters for the counter hook
  const numericEnd = typeof end === 'string' ? parseInt(end.replace(/[^0-9]/g, ''), 10) : end
  const count = useCountUp(numericEnd || 0, 2500, active)
  
  return (
    <div className="space-y-2">
      <p className="text-4xl md:text-5xl font-bold">
        {active ? `${count.toLocaleString()}${suffix}` : '0'}
      </p>
      <p className="text-brand-200 text-sm font-medium">{label}</p>
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const slideVariants = {
  enter: {
    x: '100%',
    opacity: 0,
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    transition: {
      x: { type: 'spring', stiffness: 120, damping: 20 },
      opacity: { duration: 0.6 }
    }
  },
  exit: {
    zIndex: 0,
    x: '-100%',
    opacity: 0,
    transition: {
      x: { type: 'spring', stiffness: 120, damping: 20 },
      opacity: { duration: 0.6 }
    }
  }
}

const services = [
  { icon: Building2, title: 'Estate Full Collection', desc: 'Single billing for your entire estate. Schedule auto-set based on your zone.', price: '₦5,000/mo', tag: 'Most Popular' },
  { icon: Building2, title: 'Estate Unit Collection', desc: 'Per-unit billing. Perfect for estates with multiple independent unit holders.', price: '₦1,500/unit', tag: null },
  { icon: Briefcase, title: 'Business Pickup', desc: 'Tailored plans for shops, restaurants, schools, hospitals and supermarkets.', price: 'From ₦8,000/mo', tag: null },
  { icon: Recycle, title: 'Special Collections', desc: 'One-time bulk waste, event cleanup, construction debris and recycling.', price: 'Custom quote', tag: null },
]

const howItWorks = [
  { step: '01', title: 'Register & Choose a Plan', desc: 'Sign up in minutes. Select the plan that fits your estate or business size.' },
  { step: '02', title: 'Auto-Scheduled Pickups', desc: 'Collections are automatically set based on your zone and chosen frequency.' },
  { step: '03', title: 'Sit Back & Relax', desc: 'Our verified collectors come to you. Track them live on collection day.' },
]

export default function HomePage() {
  const seo = buildSeoMeta({ title: 'Clean Estates, Healthy Communities' })
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' })
  const [currentImage, setCurrentImage] = useState(0)
  const [heroData, setHeroData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const { data: plans = [] } = useQuery({
    queryKey: ['publicPlans'],
    queryFn: () => subscriptionService.getPlans()
  })

  useEffect(() => {
    async function fetchHero() {
      try {
        const data = await cmsService.getContent('landing-page')
        if (data) {
          setHeroData({
            title: data.mainHeadline || DEFAULT_HERO.title,
            subtitle: data.subHeadline || DEFAULT_HERO.subtitle,
            images: data.heroImages && data.heroImages.length > 0
              ? data.heroImages.map((img: any) => img.url)
              : DEFAULT_HERO.images
          })
        }
      } catch (error) {
        console.error('Failed to fetch hero content:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchHero()
  }, [])

  const activeHero = heroData || DEFAULT_HERO
  const activeImages = loading ? [] : (activeHero.images || [])

  useEffect(() => {
    if (activeImages.length === 0) return
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % activeImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [activeImages.length])

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      {/* ============ HERO ============ */}
      <section className="relative h-[80vh] min-h-[550px] w-full overflow-hidden flex items-center justify-center bg-neutral-950">
        {/* Background Carousel */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentImage}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <img 
                src={activeImages[currentImage]} 
                alt="CleanNigeria Hero" 
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center text-center max-w-3xl mx-auto gap-6"
          >
            <motion.div variants={fadeUp}>
              <Badge className="bg-brand-500/20 text-brand-100 border-brand-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                🌿 Nigeria's #1 Estate Waste Platform
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight text-balance"
            >
              {activeHero.title === 'A Cleaner Nigeria Starts Here' ? (
                <>
                  A Cleaner Nigeria{' '}
                  <span className="text-brand-400 relative">
                    Starts Here
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                      <path d="M2 10C60 4 120 2 180 4 220 6 260 8 298 6" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </span>
                </>
              ) : (
                activeHero.title
              )}
            </motion.h1>

            <motion.p variants={fadeUp} className="text-base md:text-lg text-slate-200 max-w-xl leading-relaxed font-medium">
              {activeHero.subtitle}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button size="lg" asChild className="bg-brand-600 hover:bg-brand-700 text-white shadow-xl shadow-brand-600/20 px-8 gap-2 rounded-xl text-base font-bold">
                <Link to={ROUTES.REGISTER}>
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 group border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 rounded-xl text-base font-bold" asChild>
                <a href="#how-it-works">
                  <Play className="h-4 w-4 fill-white" />
                  See How It Works
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {activeImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                currentImage === i ? "w-8 bg-brand-500" : "w-2 bg-white/30 hover:bg-white/50"
              )}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 z-10"
        >
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest vertical-rl">Scroll</span>
          <div className="h-12 w-px bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center mb-14 space-y-3">
            <Badge className="bg-brand-50 text-brand-700 border-brand-200">Simple Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">How CleanNigeria Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Set up in minutes. Collections run themselves. You just approve the plan.</p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Connecting line */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 hidden md:block w-2/3 h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200" />

            {howItWorks.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative flex flex-col items-center text-center gap-4"
              >
                <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-600 shadow-brand-lg">
                  <span className="text-2xl font-bold text-white">{step.step}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center mb-14 space-y-3">
            <Badge className="bg-brand-50 text-brand-700 border-brand-200">Our Services</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">What We Collect</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">From small unit holders to large supermarkets — we have a plan for every type of waste generator.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Card className="h-full border hover:border-brand-300 hover:shadow-card-hover transition-all duration-300">
                  <CardContent className="p-6 space-y-4">
                    {service.tag && (
                      <Badge className="bg-brand-600 text-white text-xs">{service.tag}</Badge>
                    )}
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 group-hover:bg-brand-100 transition-colors">
                      <service.icon className="h-6 w-6 text-brand-600" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">{service.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
                    </div>
                    <p className="font-bold text-brand-600">{service.price}</p>
                    <Link to={ROUTES.SERVICES} className="text-sm text-brand-600 hover:underline font-medium inline-flex items-center gap-1">
                      Learn more <ArrowRight className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STAT COUNTER ============ */}
      <section ref={statsRef} className="gradient-brand py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { label: 'Tonnes Collected', value: APP_CONFIG.stats.tonnesCollected, suffix: '+' },
              { label: 'Happy Customers', value: APP_CONFIG.stats.happyCustomers, suffix: '+' },
              { label: 'Estates Covered', value: APP_CONFIG.stats.estatesCovered, suffix: '' },
              { label: 'Cities Active', value: APP_CONFIG.stats.citiesActive, suffix: '' },
            ].map((stat) => (
              <StatCounter key={stat.label} label={stat.label} end={stat.value} suffix={stat.suffix} active={statsInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center mb-14 space-y-3">
            <Badge className="bg-brand-50 text-brand-700 border-brand-200">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">What Our Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockTestimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border hover:shadow-card-hover transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex gap-1">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground italic leading-relaxed">"{t.quote}"</p>
                    <div className="flex items-center gap-3 pt-2 border-t border-border">
                      <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full bg-brand-100" />
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role} · {t.estate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRICING PREVIEW ============ */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center mb-14 space-y-3">
            <Badge className="bg-brand-50 text-brand-700 border-brand-200">Pricing</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">No hidden fees. Cancel anytime. Start with a free month.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.slice(0, 3).map((plan: any, i: number) => {
              const isPopular = plan.isFeatured
              const monthlyPrice = plan.pricing?.monthly || 0
              
              return (
                <motion.div
                  key={plan._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={isPopular ? 'scale-105 z-10' : ''}
                >
                  <Card className={`h-full ${isPopular ? 'border-brand-500 shadow-brand-lg' : 'border hover:shadow-card-hover'} transition-all`}>
                    {isPopular && (
                      <div className="text-center py-2 bg-brand-600 text-white text-xs font-semibold rounded-t-lg">
                        ⭐ Most Popular
                      </div>
                    )}
                    <CardContent className="p-6 space-y-5">
                      <div>
                        <h3 className="font-bold text-lg">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                      </div>
                      <div>
                        <span className="text-3xl font-bold text-foreground">₦{(monthlyPrice / 100000).toFixed(0)}k</span>
                        <span className="text-muted-foreground text-sm">/month</span>
                      </div>
                      <ul className="space-y-2">
                        {plan.features?.slice(0, 4).map((f: any, idx: number) => (
                          <li key={idx} className={cn("flex items-start gap-2 text-sm", !f.included && "opacity-50 line-through")}>
                            <CheckCircle2 className={cn("h-4 w-4 shrink-0 mt-0.5", f.included ? "text-brand-600" : "text-muted-foreground")} />
                            <span className="text-muted-foreground">{f.text || f}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        asChild
                        className={`w-full ${isPopular ? 'bg-brand-600 hover:bg-brand-700 text-white' : ''}`}
                        variant={isPopular ? 'default' : 'outline'}
                      >
                        <Link to={ROUTES.REGISTER}>Get Started</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <div className="text-center mt-8">
            <Link to={ROUTES.PRICING} className="text-brand-600 hover:underline font-medium inline-flex items-center gap-1">
              View full pricing details <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CTA BANNER ============ */}
      <section className="gradient-brand py-20 relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 md:px-6 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready for a Cleaner Estate?
          </h2>
          <p className="text-brand-100 text-lg max-w-xl mx-auto">
            Join thousands of estates and businesses that have eliminated waste headaches with CleanNigeria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-brand-700 hover:bg-brand-50 font-semibold px-8">
              <Link to={ROUTES.REGISTER}>Start Free Month</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white bg-transparent text-white hover:bg-white/10 hover:text-white">
              <Link to={ROUTES.CONTACT}>Talk to Sales</Link>
            </Button>
          </div>
        </div>
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/5 pointer-events-none" />
      </section>
    </>
  )
}
