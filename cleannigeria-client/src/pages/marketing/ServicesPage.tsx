import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  Trash2, 
  Building2, 
  Factory, 
  Recycle, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Zap,
  Globe,
  Leaf
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/routes'
import { cn } from '@/lib/utils'

const SERVICES = [
  {
    title: 'Residential Collection',
    desc: 'Reliable weekly waste management for homes and estates. We ensure your neighborhood stays clean and healthy.',
    icon: Trash2,
    color: 'bg-emerald-500',
    features: ['Weekly Pickups', 'Organic Waste', 'General Waste', 'Odor Control']
  },
  {
    title: 'Commercial Waste',
    desc: 'Tailored solutions for offices, malls, and restaurants. Flexible scheduling to match your business hours.',
    icon: Building2,
    color: 'bg-blue-500',
    features: ['Daily Pickups', 'Cardboard Recycling', 'Food Waste', 'Compactor Service']
  },
  {
    title: 'Industrial Solutions',
    desc: 'Heavy-duty waste management for factories and construction sites. Safe disposal of non-hazardous materials.',
    icon: Factory,
    color: 'bg-slate-700',
    features: ['Skip Rentals', 'Bulk Removal', 'Site Cleanup', 'On-Demand Service']
  },
  {
    title: 'Smart Recycling',
    desc: 'Advanced sorting and recycling services to help reduce your carbon footprint. Turn your waste into value.',
    icon: Recycle,
    color: 'bg-brand-600',
    features: ['Plastic Sorting', 'Paper & Cardboard', 'Metal Recovery', 'Impact Reports']
  }
]

const STEPS = [
  { title: 'Sign Up', desc: 'Choose a plan that fits your needs and provide your location.', icon: Zap },
  { title: 'Set Schedule', desc: 'Select your preferred collection days and time windows.', icon: Clock },
  { title: 'Easy Pickup', desc: 'Our smart collectors arrive on time to manage your waste.', icon: Truck },
  { title: 'Track Impact', desc: 'Monitor your recycling progress through your dashboard.', icon: Globe },
]

export default function ServicesPage() {
  return (
    <>
      <Helmet><title>Our Services | CleanNigeria - Sustainable Waste Management</title></Helmet>
      
      <div className="flex flex-col w-full">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-50 pt-20 pb-32 md:pt-32 md:pb-48 border-b border-slate-100">
          <div className="absolute inset-0 opacity-[0.03]" 
            style={{ 
              backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', 
              backgroundSize: '32px 32px' 
            }} 
          />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
          
          <div className="container relative mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="h-3 w-3" />
                World-Class Waste Solutions
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                Sustainable Solutions for a <span className="text-brand-600">Cleaner Future</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                CleanNigeria provides tech-driven waste management services designed to make collection seamless, efficient, and eco-friendly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button size="lg" className="h-14 px-8 bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg rounded-2xl shadow-brand-lg" asChild>
                  <Link to={ROUTES.REGISTER}>Get Started Now</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 border-slate-200 text-slate-900 hover:bg-slate-50 font-bold text-lg rounded-2xl">
                  View Case Studies
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24 bg-white relative -mt-20 rounded-t-[40px] md:rounded-t-[60px] z-10">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest">What We Offer</h2>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">Comprehensive Waste Management for Everyone</h3>
              <p className="text-slate-500">From residential estates to heavy industrial zones, we have the expertise to manage every type of waste responsibly.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {SERVICES.map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-brand-100 hover:shadow-xl hover:shadow-brand-600/5 transition-all duration-500"
                >
                  <div className={cn(
                    "h-14 w-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg transition-transform group-hover:scale-110 duration-500",
                    service.color
                  )}>
                    <service.icon className="h-7 w-7" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">{service.desc}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <CheckCircle2 className="h-4 w-4 text-brand-600 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 space-y-8">
                <div className="space-y-4">
                  <h2 className="text-xs font-bold text-brand-600 uppercase tracking-widest">The Process</h2>
                  <h3 className="text-4xl font-black text-slate-900 leading-tight">Cleaning Nigeria, <br />One Step at a Time</h3>
                  <p className="text-slate-500 leading-relaxed">Our technology-first approach removes the friction from waste management. We use GPS tracking, automated scheduling, and smart logistics to ensure you never miss a collection.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {STEPS.map((step, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3">
                      <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                        <step.icon className="h-5 w-5" />
                      </div>
                      <h5 className="font-bold text-slate-900">{step.title}</h5>
                      <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="lg:w-1/2 relative">
                <div className="aspect-square rounded-[40px] bg-brand-600 overflow-hidden shadow-2xl relative">
                  <img 
                    src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=1000" 
                    alt="Sustainable Future" 
                    className="w-full h-full object-cover mix-blend-overlay opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 text-white max-w-xs text-center space-y-4">
                      <Leaf className="h-12 w-12 mx-auto text-brand-400" />
                      <p className="text-2xl font-black italic">"Our mission is to create a waste-free Nigeria by 2030."</p>
                      <p className="text-sm font-bold opacity-80">— CleanNigeria Team</p>
                    </div>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-8 -right-8 h-32 w-32 bg-amber-400 rounded-3xl -z-10 animate-bounce transition-all duration-1000" />
                <div className="absolute -bottom-8 -left-8 h-48 w-48 bg-brand-200 rounded-full -z-10 blur-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="rounded-[40px] bg-slate-50 p-8 md:p-16 relative overflow-hidden text-center space-y-8 border border-slate-100 shadow-sm">
              <div className="absolute inset-0 opacity-5" 
                style={{ 
                  backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' 
                }} 
              />
              <div className="max-w-2xl mx-auto space-y-6 relative z-10">
                <h3 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">Ready to join the movement?</h3>
                <p className="text-slate-600 text-lg">Join thousands of Nigerians making their communities cleaner and more sustainable every day.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button size="lg" className="h-14 px-12 bg-brand-600 text-white hover:bg-brand-700 font-black text-lg rounded-2xl shadow-brand-lg" asChild>
                    <Link to={ROUTES.REGISTER}>Create Your Account</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 px-12 border-slate-200 text-slate-900 hover:bg-slate-100 font-bold text-lg rounded-2xl" asChild>
                    <Link to={ROUTES.CONTACT}>Contact Sales</Link>
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
                <div className="space-y-1">
                  <p className="text-2xl font-black text-slate-900">50k+</p>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Active Users</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-black text-slate-900">12</p>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Cities Covered</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-black text-slate-900">1M+</p>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Tons Collected</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-black text-slate-900">4.9</p>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">User Rating</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

