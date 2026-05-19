export type ComplaintCategory =
  | 'missed_pickup' | 'incomplete_collection' | 'rude_collector'
  | 'billing_issue' | 'app_issue' | 'other'

export type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export interface ComplaintMessage {
  id: string
  complaintId: string
  senderId: string
  senderName: string
  senderRole: 'user' | 'support'
  message: string
  attachments?: string[]
  createdAt: string
}

export interface Complaint {
  id: string
  userId: string
  category: ComplaintCategory
  subject: string
  description: string
  photos?: string[]
  relatedPickupDate?: string
  status: ComplaintStatus
  messages: ComplaintMessage[]
  resolvedAt?: string
  rating?: number
  createdAt: string
  updatedAt: string
}

export interface CreateComplaintPayload {
  category: ComplaintCategory
  subject: string
  description: string
  photos?: File[]
  relatedPickupDate?: string
}
