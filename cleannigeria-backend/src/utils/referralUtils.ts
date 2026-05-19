import { nanoid } from 'nanoid'

/**
 * Generate a unique referral code e.g. "CN-X7K2P"
 */
export const generateReferralCode = (): string => {
  return `CN-${nanoid(5).toUpperCase()}`
}

/**
 * Generate a short employee ID for collectors e.g. "EMP-00123"
 */
export const generateEmployeeId = (sequence: number): string => {
  return `EMP-${String(sequence).padStart(5, '0')}`
}

/**
 * Generate an invoice number e.g. "CN-2024-000456"
 */
export const generateInvoiceNumber = (sequence: number): string => {
  const year = new Date().getFullYear()
  return `CN-${year}-${String(sequence).padStart(6, '0')}`
}

/**
 * Generate a complaint ticket ID e.g. "CN-TKT-8821"
 */
export const generateTicketId = (): string => {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `CN-TKT-${num}`
}

/**
 * Generate a payment reference e.g. "CN-PAY-1699999999999"
 */
export const generatePaymentReference = (): string => {
  return `CN-PAY-${Date.now()}`
}
