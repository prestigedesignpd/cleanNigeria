import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Users, Leaf, Zap, Shield, Clock, Headphones } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/routes'
import { buildSeoMeta } from '@/lib/seo'

const milestones = [
  { year: '2021', title: 'CleanNigeria Founded', desc: 'Started with 3 estates in Lekki, Lagos.' },
  { year: '2022', title: 'Lagos Expansion', desc: 'Grew to 15 estates across 4 Lagos zones.' },
  { year: '2023', title: 'Abuja Launch', desc: 'Expanded to the Federal Capital Territory.' },
  { year: '2024', title: 'Business Tier Launched', desc: 'Added dedicated plans for businesses and institutions.' },
  { year: '2025', title: 'Live Tracking', desc: 'Launched real-time collector tracking for all subscribers.' },
  { year: '2026', title: '48+ Estates & Counting', desc: 'Now serving 12,000+ homes across 6 cities.' },
]

const whyUs = [
  { icon: Clock, title: 'Reliability', desc: '99% on-time collection rate across all zones.' },
  { icon: Leaf, title: 'Eco-Friendly', desc: 'Responsible waste disposal and recycling partnerships.' },
  { icon: Zap, title: 'Tech-Powered', desc: 'Live tracking, instant notifications, and smart scheduling.' },
  { icon: Shield, title: 'Affordable', desc: 'Transparent pricing with no hidden fees. Cancel anytime.' },
  { icon: Users, title: 'Local Experts', desc: 'Teams trained specifically for Nigerian estate environments.' },
  { icon: Headphones, title: '24/7 Support', desc: 'Always available via chat, phone, and WhatsApp.' },
]

export default function AboutPage() {
  const seo = buildSeoMeta({ title: 'About Us', description: 'Learn the story behind CleanNigeria and our mission to transform waste management across Nigeria.' })

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      {/* Hero */}
      <section className="gradient-mesh py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center space-y-4">
          <Badge className="bg-brand-50 text-brand-700 border-brand-200">Our Story</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">About CleanNigeria</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We're on a mission to make clean, well-managed estates the norm across Nigeria — not the exception.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-brand-50 text-brand-700 border-brand-200">Our Mission</Badge>
              <h2 className="text-3xl font-bold">Transforming Nigerian Waste Management</h2>
              <p className="text-muted-foreground leading-relaxed">
                CleanNigeria exists because we believe that every Nigerian home and business deserves a clean, healthy environment — regardless of location or estate size. We use technology to make that possible at scale.
              </p>
              <div className="space-y-3">
                {['Regular, scheduled waste collection you can count on', 'Tech-enabled tracking and transparency', 'Eco-responsible disposal with recycling programs', 'Locally rooted teams who understand our communities'].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 p-12 text-center space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {[['12,000+', 'Homes Served'], ['48', 'Estates'], ['99%', 'On-time Rate'], ['6', 'Cities']].map(([val, label]) => (
                  <div key={label} className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-3xl font-bold text-brand-600">{val}</p>
                    <p className="text-sm text-muted-foreground mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <div className="text-center mb-14 space-y-3">
            <Badge className="bg-brand-50 text-brand-700 border-brand-200">Our Journey</Badge>
            <h2 className="text-3xl font-bold">Company Milestones</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-brand-200 md:left-1/2 md:-ml-px" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`relative flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className="relative z-10 flex h-8 w-16 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white text-xs font-bold md:absolute md:left-1/2 md:-ml-8">
                    {m.year}
                  </div>
                  <div className={`ml-6 md:ml-0 md:w-5/12 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12 md:ml-auto'}`}>
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{m.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center mb-14 space-y-3">
            <Badge className="bg-brand-50 text-brand-700 border-brand-200">Why CleanNigeria</Badge>
            <h2 className="text-3xl font-bold">Built for Nigerian Realities</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Card className="h-full hover:shadow-card-hover transition-shadow">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
                      <item.icon className="h-6 w-6 text-brand-600" />
                    </div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-brand py-20">
        <div className="mx-auto max-w-3xl px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">Join the CleanNigeria Community</h2>
          <p className="text-brand-100">Be part of the movement transforming Nigerian estates one pickup at a time.</p>
          <Button size="lg" asChild className="bg-white text-brand-700 hover:bg-brand-50 font-semibold">
            <Link to={ROUTES.REGISTER}>Get Started Today</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
