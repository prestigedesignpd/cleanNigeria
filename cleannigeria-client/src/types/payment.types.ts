export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded'
export type PaymentType = 'subscription' | 'extra_pickup' | 'upgrade'

export interface Payment {
  id: string
  userId: string
  subscriptionId?: string
  reference: string
  paystackRef: string
  type: PaymentType
  description: string
  amount: number
  currency: 'NGN'
  status: PaymentStatus
  channel?: string
  paidAt?: string
  createdAt: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  userId: string
  subscriptionId: string
  period: string
  lineItems: Array<{ description: string; amount: number }>
  subtotal: number
  tax: number
  total: number
  status: 'paid' | 'pending' | 'overdue'
  dueDate: string
  paidAt?: string
  createdAt: string
}

export interface InitiatePaymentPayload {
  amount: number
  email: string
  type: PaymentType
  metadata?: Record<string, unknown>
}
