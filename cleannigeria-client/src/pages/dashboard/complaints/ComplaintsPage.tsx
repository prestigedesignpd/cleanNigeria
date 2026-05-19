import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  MessageSquare, 
  Calendar, 
  Clock, 
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  HelpCircle
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/common/StatusBadge'
import { formatDate } from '@/lib/formatters'
import { Link } from 'react-router-dom'
import { ROUTES, complaintDetailRoute } from '@/lib/routes'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { complaintService } from '@/services/complaint.service'
import { AppLoader } from '@/components/common/AppLoader'
import type { Complaint } from '@/types/complaint.types'

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' },
]

export default function ComplaintsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchComplaints = async () => {
      setIsLoading(true)
      try {
        const data = await complaintService.getComplaints()
        setComplaints(data)
      } catch (error) {
        console.error('Failed to fetch complaints:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchComplaints()
  }, [])

  const filteredComplaints = complaints.filter(c => {
    const cStatus = (c.status || '').toLowerCase()
    const matchesTab = activeTab === 'all' || cStatus === activeTab
    const matchesSearch = (c.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (c.id || c._id || '').toString().toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  if (isLoading) {
    return <AppLoader />
  }

  return (
    <>
      <Helmet><title>Complaints & Support | CleanNigeria</title></Helmet>
      
      <div className="space-y-8 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Complaints</h1>
            <p className="text-slate-500">Track and manage your service issues and support requests.</p>
          </div>
          <Button asChild className="bg-brand-600 hover:bg-brand-700 text-white gap-2 h-12 px-6 rounded-2xl shadow-lg shadow-brand-600/20 transition-all hover:scale-105 active:scale-95">
            <Link to={ROUTES.NEW_COMPLAINT}>
              <Plus className="h-5 w-5" /> 
              New Complaint
            </Link>
          </Button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between p-2 bg-slate-100/50 rounded-2xl border border-slate-200/60">
          <div className="flex items-center gap-1 w-full lg:w-auto overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                  activeTab === tab.value 
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
                    : "text-slate-500 hover:text-brand-600"
                )}
              >
                {tab.label}
                {activeTab === tab.value && (
                  <Badge className="ml-2 bg-brand-50 text-brand-700 border-brand-100 h-5 px-1.5 text-[10px]">
                    {filteredComplaints.length}
                  </Badge>
                )}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-80 px-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by subject or ID..." 
              className="h-11 pl-10 pr-4 rounded-xl border-slate-200 bg-white focus-visible:ring-brand-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Complaints List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map((c, i) => {
              const safeId = (c.id || (c as any)._id || '').toString()
              return (
              <motion.div
                key={safeId || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={complaintDetailRoute(safeId)}>
                  <Card className="group border-slate-200/60 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-600/5 transition-all duration-300 rounded-[20px] overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row sm:items-center p-5 gap-5">
                        <div className={cn(
                          "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border",
                          c.status === 'resolved' ? "bg-emerald-50 border-emerald-100" : "bg-brand-50 border-brand-100"
                        )}>
                          {c.status === 'resolved' ? (
                            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                          ) : c.status === 'in_progress' ? (
                            <Clock className="h-7 w-7 text-brand-600" />
                          ) : (
                            <AlertCircle className="h-7 w-7 text-brand-600" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{safeId.slice(-6).toUpperCase()}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">{(c.category || '').replace(/_/g, ' ')}</span>
                          </div>
                          <h3 className="text-lg font-black text-slate-900 group-hover:text-brand-600 transition-colors truncate">
                            {c.subject}
                          </h3>
                          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {formatDate(c.createdAt)}</span>
                            <span className="flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> 2 Updates</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 shrink-0 pt-4 sm:pt-0 border-t sm:border-0 border-slate-50">
                          <StatusBadge status={c.status} />
                          <div className="flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-brand-600 transition-colors">
                            Manage <ChevronRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
              )
            })
          ) : (
            <div className="text-center py-24 bg-white rounded-[32px] border border-slate-100 space-y-6">
              <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <HelpCircle className="h-12 w-12" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">No complaints found</h3>
                <p className="text-slate-500 max-w-xs mx-auto">
                  {searchQuery ? "We couldn't find any issues matching your search terms." : "You haven't filed any complaints yet. We hope your experience is seamless!"}
                </p>
              </div>
              <Button asChild variant="outline" className="rounded-xl px-8" onClick={() => { setActiveTab('all'); setSearchQuery('') }}>
                <Link to={searchQuery ? "#" : ROUTES.NEW_COMPLAINT}>
                  {searchQuery ? "Clear Filters" : "Report an Issue"}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

