import { Helmet } from 'react-helmet-async'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  MessageSquare, 
  Phone, 
  Mail, 
  ExternalLink, 
  Plus, 
  HelpCircle, 
  FileText, 
  ChevronRight,
  MessageCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/routes'
import { StatusBadge } from '@/components/common/StatusBadge'
import { formatDate } from '@/lib/formatters'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { complaintService } from '@/services/complaint.service'
import { Skeleton } from '@/components/ui/skeleton'

const POPULAR_FAQS = [
  { q: 'How do I reschedule a missed pickup?', a: 'You can reschedule directly from the Pickup Details page or file a complaint.' },
  { q: 'Where can I find my payment receipt?', a: 'All receipts are available in the Billing History section under Payments.' },
  { q: 'How do I update my service address?', a: 'Go to Settings > Profile to update your estate or unit details.' },
]

export default function SupportPage() {
  const [complaints, setComplaints] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchComplaints() {
      try {
        const data = await complaintService.getComplaints()
        setComplaints(data)
      } catch (error) {
        console.error('Failed to fetch complaints:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchComplaints()
  }, [])

  const recentComplaints = complaints.slice(0, 3)

  return (
    <>
      <Helmet><title>Support Center | CleanNigeria</title></Helmet>
      
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        {/* Hero / Search */}
        <div className="relative rounded-3xl overflow-hidden bg-brand-600 p-8 md:p-12 text-white shadow-brand-lg">
          <div className="absolute top-0 right-0 p-8 opacity-10 hidden md:block">
            <HelpCircle className="h-64 w-64" />
          </div>
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">How can we help you today?</h1>
              <p className="text-brand-100 text-lg">Search our help center or browse common topics below.</p>
            </div>
            <div className="relative max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search for articles, guides..." 
                className="pl-10 h-12 bg-white text-slate-900 border-none shadow-lg focus-visible:ring-brand-400 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions / FAQs */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Popular Questions</h2>
                <Button variant="ghost" asChild className="text-brand-600 hover:text-brand-700 font-bold text-xs">
                  <Link to={ROUTES.FAQ}>View All FAQs <ChevronRight className="h-4 w-4 ml-1" /></Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {POPULAR_FAQS.map((faq, i) => (
                  <Card key={i} className="border-slate-100 hover:border-brand-200 hover:shadow-md transition-all cursor-pointer group">
                    <CardContent className="p-5 space-y-2">
                      <p className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{faq.q}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{faq.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Recent Complaints */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Recent Complaints</h2>
                <Button asChild className="bg-brand-600 hover:bg-brand-700 text-white shadow-brand-sm h-9 px-4 text-xs font-bold">
                  <Link to={ROUTES.NEW_COMPLAINT}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Complaint
                  </Link>
                </Button>
              </div>
              <Card className="border-slate-200 overflow-hidden shadow-sm">
                <CardContent className="p-0 divide-y divide-slate-100">
                  {loading ? (
                    <div className="p-5 space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-3 w-1/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recentComplaints.length > 0 ? (
                    recentComplaints.map((cmp) => (
                      <Link 
                        key={cmp.id} 
                        to={`${ROUTES.COMPLAINTS}/${cmp.id}`}
                        className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                            cmp.status === 'resolved' ? "bg-emerald-50 text-emerald-600" : "bg-brand-50 text-brand-600"
                          )}>
                            <MessageCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{cmp.subject}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{cmp.id}</span>
                              <span className="text-xs text-slate-300">•</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Updated {formatDate(cmp.updatedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={cmp.status} />
                      </Link>
                    ))
                  ) : (
                    <div className="p-12 text-center space-y-3">
                      <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto">
                        <MessageSquare className="h-6 w-6" />
                      </div>
                      <p className="text-slate-500 text-sm">No active complaints. We're here to help if anything goes wrong.</p>
                    </div>
                  )}
                </CardContent>
                {recentComplaints.length > 0 && (
                  <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                    <Button variant="ghost" asChild className="text-xs font-bold text-slate-500 hover:text-brand-600">
                      <Link to={ROUTES.COMPLAINTS}>View All Complaints</Link>
                    </Button>
                  </div>
                )}
              </Card>
            </section>
          </div>

          {/* Sidebar / Contact */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Contact Us</h2>
            <div className="space-y-4">
              <ContactCard 
                icon={<Phone className="h-5 w-5 text-brand-600" />}
                title="Phone Support"
                value="+234 800 2532 6443"
                description="Mon-Fri, 8am - 6pm"
                actionLabel="Call Now"
              />
              <ContactCard 
                icon={<Mail className="h-5 w-5 text-brand-600" />}
                title="Email Support"
                value="help@cleannigeria.com"
                description="Avg. response: 2 hours"
                actionLabel="Email Us"
              />
              <ContactCard 
                icon={<MessageSquare className="h-5 w-5 text-emerald-600" />}
                title="WhatsApp"
                value="+234 901 234 5678"
                description="Quick responses for collections"
                actionLabel="Message"
                color="emerald"
              />
            </div>

            <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertCircle className="h-20 w-20" />
              </div>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-lg">Emergency Pickup?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Need an immediate collection outside your schedule? Use our on-demand service for bulk or emergency waste.
                </p>
                <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold h-10 shadow-brand-sm border-none" asChild>
                  <Link to={ROUTES.SCHEDULE}>Request Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

function ContactCard({ icon, title, value, description, actionLabel, color = 'brand' }: any) {
  const colorClass = color === 'emerald' ? 'hover:border-emerald-200 hover:shadow-emerald-sm' : 'hover:border-brand-200 hover:shadow-brand-sm'
  const actionColor = color === 'emerald' ? 'text-emerald-600 hover:text-emerald-700' : 'text-brand-600 hover:text-brand-700'

  return (
    <Card className={cn("border-slate-100 transition-all", colorClass)}>
      <CardContent className="p-5 flex gap-4">
        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <p className="font-bold text-slate-900 truncate my-0.5">{value}</p>
          <p className="text-[10px] text-muted-foreground">{description}</p>
          <button className={cn("mt-2 text-xs font-bold flex items-center gap-1 transition-colors", actionColor)}>
            {actionLabel} <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

