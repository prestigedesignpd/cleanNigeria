import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { scheduleService } from '@/services/schedule.service'
import { formatPickupDate } from '@/lib/formatters'
import { Link } from 'react-router-dom'
import { ROUTES, pickupDetailRoute } from '@/lib/routes'
import { Plus } from 'lucide-react'
import { AppLoader } from '@/components/common/AppLoader'
import type { Pickup } from '@/types/schedule.types'

export default function SchedulePage() {
  const [pickups, setPickups] = useState<Pickup[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPickups = async () => {
      setIsLoading(true)
      try {
        const data = await scheduleService.getPickups()
        setPickups(data)
      } catch (error) {
        console.error('Failed to fetch pickups:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPickups()
  }, [])

  if (isLoading) {
    return <AppLoader />
  }

  return (
    <>
      <Helmet><title>Schedule | CleanNigeria</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold">Collection Schedule</h1><p className="text-muted-foreground text-sm">Upcoming and past pickup dates</p></div>
          <Button asChild className="bg-brand-600 hover:bg-brand-700 text-white gap-2">
            <Link to={ROUTES.REQUEST_PICKUP}><Plus className="h-4 w-4" /> Extra Pickup</Link>
          </Button>
        </div>
        <div className="space-y-3">
          {pickups.map((p) => (
            <Card key={p.id} className="border hover:shadow-card transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-600 text-white text-xs font-bold">
                  {new Date(p.scheduledDate).getDate()}<span className="text-[10px] font-normal">{new Date(p.scheduledDate).toLocaleDateString('en', { month: 'short' })}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{formatPickupDate(p.scheduledDate)}</p>
                  <p className="text-xs text-muted-foreground">{p.timeWindow} · {p.wasteType}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={p.status} />
                  <Link to={pickupDetailRoute(p.id)} className="text-xs text-brand-600 hover:underline">Details</Link>
                </div>
              </CardContent>
            </Card>
          ))}
          {pickups.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No pickups scheduled yet.
            </div>
          )}
        </div>
      </div>
    </>
  )
}
