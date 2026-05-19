export type BusinessType =
  | 'mart' | 'supermarket' | 'school' | 'hospital'
  | 'clinic' | 'shop' | 'salon' | 'restaurant'
  | 'church' | 'mosque' | 'construction' | 'other'

export type WasteVolume = 'small' | 'medium' | 'large' | 'very_large'

export interface Business {
  id: string
  userId: string
  name: string
  businessType: BusinessType
  address: string
  state: string
  lga: string
  zone?: string
  wasteVolume: WasteVolume
  contactPerson: string
  contactPhone: string
  logo?: string
  createdAt: string
  updatedAt: string
}

export interface CreateBusinessPayload {
  name: string
  businessType: BusinessType
  address: string
  state: string
  lga: string
  wasteVolume: WasteVolume
  contactPerson: string
  contactPhone: string
}
