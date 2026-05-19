export type PickupStatus = 'scheduled' | 'in_progress' | 'completed' | 'missed' | 'rescheduled'
export type WasteType = 'general' | 'bulk' | 'recyclable' | 'hazardous'
export type TimePreference = 'morning' | 'afternoon' | 'evening'

export interface Collector {
  id: string
  name: string
  phone: string
  avatar?: string
  vehiclePlate: string
  rating: number
  totalCollections: number
  zone: string
}

export interface Pickup {
  id: string
  userId: string
  subscriptionId: string
  collector?: Collector
  scheduledDate: string
  timeWindow: string
  status: PickupStatus
  wasteType: WasteType
  notes?: string
  completedAt?: string
  missedReason?: string
  rescheduledDate?: string
  rating?: number
  photoUrl?: string
  isExtra: boolean
}

export interface RequestExtraPickupPayload {
  preferredDate: string
  timePreference: TimePreference
  wasteType: WasteType
  specialInstructions?: string
}
