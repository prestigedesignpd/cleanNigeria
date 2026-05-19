import { Helmet } from 'react-helmet-async'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Download, 
  Eye, 
  FileText, 
  MoreVertical, 
  Search, 
  Filter,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Clock,
  Info
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/routes'
import { formatDate, formatCurrency } from '@/lib/formatters'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { paymentService } from '@/services/payment.service'
import type { Invoice } from '@/types/payment.types'
import { Skeleton } from '@/components/ui/skeleton'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  useEffect(() => {
    async function fetchInvoices() {
      try {
        const data = await paymentService.getInvoices()
        setInvoices(data)
      } catch (error) {
        console.error('Failed to fetch invoices:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchInvoices()
  }, [])

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    (inv.period && inv.period.toLowerCase().includes(search.toLowerCase()))
  )

  const stats = [
    { label: 'Total Paid', value: 24000, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Outstanding', value: 0, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Last Payment', value: 12000, icon: CreditCard, color: 'text-brand-600', bg: 'bg-brand-50' },
  ]

  return (
    <>
      <Helmet><title>Invoices & Billing | CleanNigeria</title></Helmet>
      
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Billing History</h1>
            <p className="text-muted-foreground mt-1 text-lg">Manage your invoices and track your payments.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-10">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border-slate-200 shadow-sm overflow-hidden group">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">{formatCurrency(stat.value)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Invoices Table Section */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-lg">Recent Invoices</CardTitle>
                <CardDescription>A list of all your generated invoices and their statuses.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Search invoices..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-10 bg-white border-slate-200 focus-visible:ring-brand-600"
                  />
                </div>
                <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                  <Filter className="h-4 w-4 text-slate-500" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/30">
                  <TableRow>
                    <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Invoice Number</TableHead>
                    <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Period</TableHead>
                    <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Date Issued</TableHead>
                    <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Amount</TableHead>
                    <TableHead className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Status</TableHead>
                    <TableHead className="text-right font-bold text-slate-500 uppercase tracking-widest text-[10px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [1, 2, 3].map((i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={6}><Skeleton className="h-12 w-full" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredInvoices.length > 0 ? (
                    filteredInvoices.map((inv) => (
                      <TableRow key={inv.id} className="group hover:bg-slate-50/80 transition-colors">
                        <TableCell className="font-bold text-slate-900 py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                              <FileText className="h-4 w-4" />
                            </div>
                            {inv.invoiceNumber}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{inv.period || 'N/A'}</TableCell>
                        <TableCell className="text-sm text-slate-600">{formatDate(inv.createdAt)}</TableCell>
                        <TableCell className="font-black text-slate-900">{formatCurrency(inv.total / 100)}</TableCell>
                        <TableCell>
                          <StatusBadge status={inv.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-slate-400 hover:text-brand-600">
                              <Link to={`${ROUTES.PAYMENTS}/${inv.id.replace('inv_', 'pay_')}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-brand-600">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                            <FileText className="h-6 w-6" />
                          </div>
                          <p className="text-slate-500 font-medium">No invoices found matching your search.</p>
                          <Button variant="outline" size="sm" onClick={() => setSearch('')}>Clear Search</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">Showing <span className="font-bold text-slate-900">{filteredInvoices.length}</span> of <span className="font-bold text-slate-900">{invoices.length}</span> invoices</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled className="h-8 text-[10px] font-bold uppercase tracking-widest">Previous</Button>
                  <Button variant="outline" size="sm" disabled className="h-8 text-[10px] font-bold uppercase tracking-widest">Next</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Helpful Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-slate-100 bg-slate-50/50 shadow-none">
            <CardContent className="p-6 flex gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Info className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900">Need a Tax Invoice?</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All our invoices are tax-compliant. If you need a corporate invoice with your TIN, please update your Business Settings.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-100 bg-slate-50/50 shadow-none">
            <CardContent className="p-6 flex gap-4">
              <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900">Automatic Billing</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your subscription is billed automatically on the 1st of every month. Receipts are sent to your registered email.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

