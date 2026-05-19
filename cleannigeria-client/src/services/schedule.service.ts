import api from './api'
import type { Pickup, RequestExtraPickupPayload } from '@/types/schedule.types'

const mapPickup = (p: any): Pickup => {
  return {
    id: p.id || p._id || '',
    userId: p.userId || '',
    subscriptionId: p.subscriptionId || '',
    collector: p.collectorId ? {
      id: p.collectorId.id || p.collectorId._id || '',
      name: p.collectorId.name || `${p.collectorId.firstName || ''} ${p.collectorId.lastName || ''}`.trim() || 'Collector',
      phone: p.collectorId.phone || '',
      avatar: p.collectorId.avatar || '',
      vehiclePlate: p.collectorId.vehicle?.plateNumber || p.collectorId.vehicle || '',
      rating: p.collectorId.rating || 5,
      totalCollections: p.collectorId.totalCollections || 0,
      zone: p.zoneId?.name || '',
    } : undefined,
    scheduledDate: p.scheduledDate,
    timeWindow: p.timeWindow ? p.timeWindow.charAt(0).toUpperCase() + p.timeWindow.slice(1).toLowerCase() : '',
    status: (p.status || 'scheduled').toLowerCase() as any,
    wasteType: (p.wasteType || 'general').toLowerCase() as any,
    notes: p.adminNote || p.notes || '',
    completedAt: p.completedAt,
    missedReason: p.missedReason,
    rescheduledDate: p.rescheduledDate,
    rating: p.rating,
    photoUrl: p.photoUrl,
    isExtra: p.type === 'EXTRA',
  }
}

export const scheduleService = {
  async getPickups(): Promise<Pickup[]> {
    const res = await api.get('/schedules/my')
    const rawList = res.data.data?.data || res.data.data || []
    return Array.isArray(rawList) ? rawList.map(mapPickup) : []
  },

  async getPickupById(id: string): Promise<Pickup> {
    const res = await api.get(`/schedules/${id}`)
    return mapPickup(res.data.data)
  },

  async requestExtraPickup(payload: RequestExtraPickupPayload): Promise<{ message: string; pickup: Pickup }> {
    const res = await api.post('/schedules/request-extra', payload)
    return {
      message: res.data.message || 'Extra pickup scheduled successfully',
      pickup: mapPickup(res.data.data),
    }
  },

  async ratePickup(id: string, rating: number): Promise<{ message: string }> {
    const res = await api.post(`/schedules/${id}/rate`, { rating })
    return { message: res.data.message || 'Rating submitted. Thank you!' }
  },
}

