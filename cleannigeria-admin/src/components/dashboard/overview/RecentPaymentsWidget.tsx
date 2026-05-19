import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useAdminPayments } from '@/hooks/useAdminPayments';
import { Loader2 } from 'lucide-react';

export function RecentPaymentsWidget() {
  const { data: response, isLoading } = useAdminPayments({ limit: 5 });
  const payments = response?.data || [];

  return (
    <Card className="col-span-4 lg:col-span-2 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
      <CardHeader>
        <CardTitle>Recent Payments</CardTitle>
        <CardDescription>Latest transactions recorded.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
             <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center text-sm text-neutral-500 py-6">No recent payments</div>
        ) : (
          <div className="space-y-6">
            {payments.map((payment: any) => (
              <div key={payment.id || payment._id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium leading-none text-neutral-900 dark:text-white">
                    {payment.userId?.firstName} {payment.userId?.lastName}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{payment.paymentReference || payment.id}</p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    +₦{(payment.amount / 100).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline" 
                      className={
                        payment.status === 'SUCCESS' 
                          ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200' 
                          : payment.status === 'FAILED'
                          ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200'
                      }
                    >
                      {payment.status}
                    </Badge>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {formatDistanceToNow(new Date(payment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
