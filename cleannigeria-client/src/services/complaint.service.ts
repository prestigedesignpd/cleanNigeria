import api from './api'
import type { Complaint } from '@/types/complaint.types'

export const complaintService = {
  async getComplaints(): Promise<Complaint[]> {
    const res = await api.get('/complaints')
    // Handle paginated response: { data: { data: [...], meta: {...} } } or flat array
    const raw: any[] = res.data.data?.data || res.data.data || []
    // Normalize Mongoose docs: _id → id, UPPERCASE status → lowercase
    return raw.map((c: any) => ({
      ...c,
      id: c._id || c.id,
      status: (c.status || 'open').toLowerCase() as Complaint['status'],
      category: (c.category || 'other').toLowerCase() as Complaint['category'],
    }))
  },

  async getComplaintById(id: string): Promise<{ complaint: Complaint, messages: any[] }> {
    const res = await api.get(`/complaints/${id}`)
    return res.data.data
  },

  async createComplaint(payload: FormData): Promise<{ message: string; id: string }> {
    const res = await api.post('/complaints', payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return { 
      message: res.data.message || "Complaint filed successfully",
      id: res.data.data?._id || res.data.data?.id
    }
  },

  async replyToComplaint(id: string, message: string): Promise<{ message: string }> {
    const res = await api.post(`/complaints/${id}/messages`, { message })
    return { message: res.data.message || 'Reply sent' }
  },

  async closeComplaint(id: string, rating?: number, comment?: string): Promise<{ message: string }> {
    // The backend uses rate for closing by user, or admin uses resolve
    const res = await api.post(`/complaints/${id}/rate`, { rating: rating || 5, comment })
    return { message: res.data.message || 'Complaint closed' }
  },
}
