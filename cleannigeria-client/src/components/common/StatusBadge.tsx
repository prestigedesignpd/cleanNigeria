import type { SubscriptionStatus, PaymentStatus, ComplaintStatus, PickupStatus } from '@/types/subscription.types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type StatusType = SubscriptionStatus | PaymentStatus | ComplaintStatus | PickupStatus | string

const statusMap: Record<string, { label: string; className: string }> = {
  // Subscription
  active: { label: 'Active', className: 'bg-green-100 text-green-700 border-green-200' },
  expired: { label: 'Expired', className: 'bg-red-100 text-red-700 border-red-200' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-700 border-gray-200' },
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  suspended: { label: 'Suspended', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  // Payment
  paid: { label: 'Paid', className: 'bg-green-100 text-green-700 border-green-200' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-700 border-red-200' },
  refunded: { label: 'Refunded', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  // Complaint
  open: { label: 'Open', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  in_progress: { label: 'In Progress', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  resolved: { label: 'Resolved', className: 'bg-green-100 text-green-700 border-green-200' },
  closed: { label: 'Closed', className: 'bg-gray-100 text-gray-700 border-gray-200' },
  // Pickup
  scheduled: { label: 'Scheduled', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-700 border-green-200' },
  missed: { label: 'Missed', className: 'bg-red-100 text-red-700 border-red-200' },
  rescheduled: { label: 'Rescheduled', className: 'bg-purple-100 text-purple-700 border-purple-200' },
  in_progress: { label: 'In Progress', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
}

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusMap[status] ?? { label: status, className: 'bg-gray-100 text-gray-700 border-gray-200' }

  return (
    <Badge
      variant="outline"
      className={cn('font-medium capitalize border', config.className, className)}
    >
      {config.label}
    </Badge>
  )
}
