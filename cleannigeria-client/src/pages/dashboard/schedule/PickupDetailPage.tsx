import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ChevronLeft, 
  MapPin, 
  Clock, 
  Truck, 
  User, 
  Phone, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Star,
  MoreVertical,
  MessageSquare
} from 'lucide-react'
import { ROUTES } from '@/lib/routes'
import { mockPickups } from '@/mock'
import { formatDate, formatDateTime, capitalize } from '@/lib/formatters'
import { StatusBadge } from '@/components/common/StatusBadge'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

import { useQuery } from '@tanstack/react-query'
import { scheduleService } from '@/services/schedule.service'
import { Loader2 } from 'lucide-react'

export default function PickupDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: pickupData, isLoading } = useQuery({
    queryKey: ['pickup', id],
    queryFn: () => scheduleService.getPickupById(id!),
    enabled: !!id
  })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand-600 mb-4" />
        <h1 className="text-xl font-bold">Loading Pickup Details...</h1>
      </div>
    )
  }

  // Map backend IPickupSchedule to Client's Pickup type
  const pickup = pickupData ? {
    id: pickupData._id || pickupData.id,
    scheduledDate: pickupData.scheduledDate,
    timeWindow: pickupData.timeWindow ? capitalize(pickupData.timeWindow.toLowerCase()) : 'Morning (8:00 AM - 12:00 PM)',
    status: (pickupData.status?.toLowerCase() || 'scheduled') as any,
    wasteType: (pickupData.wasteType?.toLowerCase() || 'general') as any,
    notes: pickupData.adminNote || '',
    isExtra: pickupData.type === 'EXTRA',
    completedAt: (pickupData as any).completedAt,
    collector: (pickupData.collectorId as any) ? {
      id: (pickupData.collectorId as any)._id,
      name: `${(pickupData.collectorId as any).firstName || ''} ${(pickupData.collectorId as any).lastName || ''}`.trim() || 'Collector Assigned',
      phone: (pickupData.collectorId as any).phone || '',
      avatar: (pickupData.collectorId as any).avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256',
      vehiclePlate: (pickupData.collectorId as any).vehicle?.plateNumber || 'N/A',
      rating: (pickupData.collectorId as any).rating?.average || 4.8,
      totalCollections: (pickupData.collectorId as any).totalCollections || 120,
      zone: (pickupData.zoneId as any)?.name || 'Local Zone'
    } : undefined
  } : null

  if (!pickup) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-xl font-bold">Pickup Not Found</h1>
        <p className="text-muted-foreground">We couldn't find the pickup details you're looking for.</p>
        <Button asChild className="mt-4 bg-brand-600 hover:bg-brand-700 text-white">
          <Link to={ROUTES.SCHEDULE}>Back to Schedule</Link>
        </Button>
      </div>
    )
  }

  const timeline = [
    { label: 'Scheduled', status: 'completed', time: formatDate(pickup.scheduledDate) },
    { label: 'Collector Assigned', status: pickup.collector ? 'completed' : 'pending' },
    { label: 'In Transit', status: pickup.status === 'in_progress' ? 'current' : pickup.status === 'completed' ? 'completed' : 'pending' },
    { label: 'Completed', status: pickup.status === 'completed' ? 'completed' : 'pending', time: pickup.completedAt ? formatDateTime(pickup.completedAt) : undefined },
  ]

  return (
    <>
      <Helmet><title>Pickup {pickup.id} | CleanNigeria</title></Helmet>
      
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link to={ROUTES.SCHEDULE} className="text-xs text-muted-foreground hover:text-brand-600 flex items-center gap-1 mb-2 transition-colors">
              <ChevronLeft className="h-3 w-3" />
              Back to Schedule
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pickup Details</h1>
              <StatusBadge status={pickup.status} />
            </div>
            <p className="text-muted-foreground text-sm">Reference: <span className="font-mono">{pickup.id}</span> · {pickup.isExtra ? 'On-Demand Pickup' : 'Standard Collection'}</p>
          </div>
          <div className="flex items-center gap-2">
            {pickup.status === 'scheduled' && (
              <>
                <Button variant="outline" size="sm">Reschedule</Button>
                <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">Cancel</Button>
              </>
            )}
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Support
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-400">Pickup Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-slate-100" />
                  <div className="space-y-8 relative">
                    {timeline.map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <div className={cn(
                          "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white shadow-sm",
                          step.status === 'completed' ? "bg-brand-600 text-white" : 
                          step.status === 'current' ? "bg-brand-50 text-brand-600 border-brand-200" : "bg-slate-100 text-slate-400"
                        )}>
                          {step.status === 'completed' ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-current" />}
                        </div>
                        <div className="flex-1 pt-1">
                          <p className={cn("text-sm font-semibold", step.status === 'pending' ? "text-slate-400" : "text-slate-900")}>
                            {step.label}
                          </p>
                          {step.time && <p className="text-xs text-muted-foreground mt-0.5">{step.time}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pickup Information */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scheduled Date</p>
                      <p className="text-sm font-semibold text-slate-900">{formatDate(pickup.scheduledDate)}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Time Window</p>
                      <p className="text-sm font-semibold text-slate-900">{pickup.timeWindow}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Waste Type</p>
                      <p className="text-sm font-semibold text-slate-900">{capitalize(pickup.wasteType)} Waste</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Location</p>
                      <p className="text-sm font-semibold text-slate-900">Sunflower Estates, Unit 42B</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Special Instructions */}
            {pickup.notes && (
              <Card className="border-slate-200 shadow-sm border-l-4 border-l-brand-600">
                <CardContent className="p-4 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Notes / Instructions</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{pickup.notes}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Collector Card */}
            {pickup.collector ? (
              <Card className="border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assigned Collector</p>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-xs font-bold">{pickup.collector.rating}</span>
                  </div>
                </div>
                <CardContent className="p-5 space-y-5">
                  <div className="flex items-center gap-4">
                    <img 
                      src={pickup.collector.avatar} 
                      alt={pickup.collector.name} 
                      className="h-14 w-14 rounded-full bg-brand-50 border-2 border-white shadow-sm"
                    />
                    <div>
                      <p className="font-bold text-slate-900">{pickup.collector.name}</p>
                      <p className="text-xs text-muted-foreground">{pickup.collector.zone} Collector</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-50">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Vehicle Plate</p>
                      <p className="text-xs font-semibold font-mono text-slate-900">{pickup.collector.vehiclePlate}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Collections</p>
                      <p className="text-xs font-semibold text-slate-900">{pickup.collector.totalCollections}+</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 h-9 text-xs">
                      <Phone className="h-3.5 w-3.5 mr-2" />
                      Call
                    </Button>
                    <Button className="flex-1 h-9 text-xs bg-brand-600 hover:bg-brand-700 text-white">
                      Track Live
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-slate-200 shadow-sm bg-slate-50 border-dashed">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Assigning Collector</p>
                    <p className="text-xs text-muted-foreground mt-1">We'll notify you as soon as a collector is assigned to your pickup.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Help Card */}
            <Card className="bg-brand-600 text-white border-none overflow-hidden relative">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <HelpCircle className="h-24 w-24" />
              </div>
              <CardContent className="p-5 space-y-3 relative z-10">
                <h3 className="font-bold text-lg leading-snug">Having issues with your pickup?</h3>
                <p className="text-xs text-white/80 leading-relaxed">If your waste wasn't collected or you have a complaint, our team is here to help.</p>
                <Button variant="secondary" className="w-full h-9 text-xs text-brand-600 font-bold bg-white hover:bg-slate-50 border-none shadow-sm" asChild>
                  <Link to={ROUTES.SUPPORT}>File a Complaint</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

const HelpCircle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

