import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/StatusBadge'
import { paymentService } from '@/services/payment.service'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { Link } from 'react-router-dom'
import { paymentDetailRoute } from '@/lib/routes'
import type { Payment } from '@/types/payment.types'
import { Skeleton } from '@/components/ui/skeleton'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPayments() {
      try {
        const data = await paymentService.getPayments()
        setPayments(data)
      } catch (error) {
        console.error('Failed to fetch payments:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [])

  return (
    <>
      <Helmet><title>Payments | CleanNigeria</title></Helmet>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Payment History</h1>
        
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No payments found.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {payments.map((p) => (
              <Card key={p.id} className="border hover:shadow-card transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{p.description || 'Payment'}</p>
                    <p className="text-xs text-muted-foreground">{p.reference} · {formatDate(p.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <p className="font-bold">{formatCurrency(p.amount / 100)}</p>
                    <StatusBadge status={p.status} />
                    <Link to={paymentDetailRoute(p.id)} className="text-xs text-brand-600 hover:underline">View</Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
