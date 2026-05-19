import api from './api'
import type { Payment, Invoice } from '@/types/payment.types'
import type { PaginationParams, DateRangeParams } from '@/types/api.types'

export const paymentService = {
  async getPayments(params?: PaginationParams & DateRangeParams): Promise<Payment[]> {
    const res = await api.get('/payments', { params })
    return res.data.data?.data || res.data.data || []
  },

  async getPaymentById(id: string): Promise<Payment> {
    const res = await api.get(`/payments/${id}`)
    return res.data.data
  },

  async getInvoices(params?: PaginationParams): Promise<Invoice[]> {
    const res = await api.get('/invoices', { params })
    return res.data.data?.data || res.data.data || []
  },

  async getInvoiceById(id: string): Promise<Invoice> {
    const res = await api.get(`/invoices/${id}`)
    return res.data.data
  },

  async initiatePayment(amount: number, email: string): Promise<{ reference: string, authorization_url: string }> {
    const res = await api.post('/payments/initiate', { amount, email })
    return res.data.data
  },

  async verifyPayment(reference: string): Promise<{ success: boolean }> {
    const res = await api.post('/payments/verify', { reference })
    return { success: res.data.success }
  },
}
