import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Download, Printer, Share2, HelpCircle, FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import { ROUTES } from '@/lib/routes'
import { mockInvoices } from '@/mock'
import { formatCurrency, formatDateTime, formatDate } from '@/lib/formatters'
import { StatusBadge } from '@/components/common/StatusBadge'
import { AppLogo } from '@/components/common/AppLogo'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import { paymentService } from '@/services/payment.service'
import { Loader2 } from 'lucide-react'

export default function PaymentDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: payment, isLoading } = useQuery({
    queryKey: ['payment', id],
    queryFn: () => paymentService.getPaymentById(id!),
    enabled: !!id
  })

  // We are currently mocking invoice connection if not available directly from backend
  const invoice = mockInvoices.find((inv) => inv.userId === payment?.userId && inv.paidAt === payment?.paidAt)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-600 mb-4" />
        <h1 className="text-xl font-bold">Loading Payment...</h1>
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-xl font-bold">Payment Not Found</h1>
        <p className="text-muted-foreground">We couldn't find the payment receipt you're looking for.</p>
        <Button asChild className="mt-4 bg-brand-600 hover:bg-brand-700 text-white">
          <Link to={ROUTES.PAYMENTS}>Back to Payments</Link>
        </Button>
      </div>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    toast.info('Downloading receipt...', {
      description: `Receipt-${payment.reference}.pdf is being generated.`,
    })
  }

  const handleShare = () => {
    toast.success('Link copied to clipboard')
  }

  return (
    <>
      <Helmet><title>Receipt {payment.reference} | CleanNigeria</title></Helmet>
      
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
          <div className="space-y-1">
            <Link to={ROUTES.PAYMENTS} className="text-xs text-muted-foreground hover:text-brand-600 flex items-center gap-1 mb-2 transition-colors">
              <ChevronLeft className="h-3 w-3" />
              Back to Billing History
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payment Receipt</h1>
            <p className="text-muted-foreground text-sm">Receipt for your transaction on {formatDate(payment.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-slate-200 shadow-sm overflow-hidden bg-white print:border-0 print:shadow-none">
            {/* Receipt Header */}
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="space-y-4">
                <AppLogo linkTo="#" size="lg" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Receipt From</p>
                  <p className="text-sm font-semibold text-slate-900">CleanNigeria Waste Solutions</p>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                    123 Victoria Island,<br />
                    Lagos, Nigeria<br />
                    billing@cleannigeria.com
                  </p>
                </div>
              </div>
              <div className="text-left md:text-right space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Payment Status</p>
                  <div className="md:flex md:justify-end">
                    <StatusBadge status={payment.status} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Receipt Reference</p>
                  <p className="text-sm font-mono font-semibold text-slate-900">{payment.reference || payment._id}</p>
                </div>
                {payment.paystackRef && (
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction ID</p>
                    <p className="text-xs font-mono text-slate-500">{payment.paystackRef}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Receipt Details */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Billed To</p>
                  <p className="text-sm font-semibold text-slate-900">{payment.userId?.firstName} {payment.userId?.lastName}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {payment.userId?.email}
                  </p>
                </div>
              </div>
              <div className="space-y-4 md:text-right">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Payment Details</p>
                  <p className="text-sm text-slate-600">
                    Date Paid: <span className="font-semibold text-slate-900">{payment.createdAt ? formatDateTime(payment.createdAt) : 'Pending'}</span>
                  </p>
                  <p className="text-sm text-slate-600">
                    Payment Method: <span className="font-semibold text-slate-900 capitalize">{payment.channel || 'N/A'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="px-8 pb-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Description</th>
                      <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-50">
                      <td className="py-4">
                        <p className="text-sm font-semibold text-slate-900">{payment.description || 'Service Payment'}</p>
                      </td>
                      <td className="py-4 text-sm font-semibold text-slate-900 text-right">
                        {formatCurrency((payment.amount || 0) / 100)}
                      </td>
                    </tr>
                    {/* Add more items if it was an invoice */}
                    {invoice && invoice.lineItems.length > 1 && invoice.lineItems.slice(1).map((item, idx) => (
                       <tr key={idx} className="border-b border-slate-50">
                        <td className="py-4">
                          <p className="text-sm font-semibold text-slate-900">{item.description}</p>
                        </td>
                        <td className="py-4 text-sm font-semibold text-slate-900 text-right">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="p-8 bg-slate-50 flex justify-end">
              <div className="w-full md:w-64 space-y-3">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency((payment.amount || 0) / 100)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>VAT (0%)</span>
                  <span>₦0.00</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-200">
                  <span className="font-bold text-slate-900">Amount Paid</span>
                  <span className="font-bold text-brand-600 text-lg">{formatCurrency((payment.amount || 0) / 100)}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Footer actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border border-dashed border-slate-200 rounded-xl print:hidden">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Need help with this payment?</p>
              <p className="text-xs text-muted-foreground">Contact our support team if you notice any issues.</p>
            </div>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <Link to={ROUTES.SUPPORT}>Get Support</Link>
          </Button>
        </div>
      </div>
    </>
  )
}

