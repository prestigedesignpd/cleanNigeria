export type CollectionType = 'full_estate' | 'unit_collection'

export interface Estate {
  id: string
  userId: string
  name: string
  address: string
  state: string
  lga: string
  zone?: string
  collectionType: CollectionType
  totalUnits?: number
  contactPerson: string
  contactPhone: string
  logo?: string
  createdAt: string
  updatedAt: string
}

export interface EstateUnit {
  id: string
  estateId: string
  unitNumber: string
  residentName: string
  residentPhone: string
  residentEmail?: string
  isActive: boolean
}

export interface CreateEstatePayload {
  name: string
  address: string
  state: string
  lga: string
  collectionType: CollectionType
  totalUnits?: number
  contactPerson: string
  contactPhone: string
}
