import { PHONE_REGEX } from '@constants/nigeria.constants'

/**
 * Normalize a Nigerian phone number to international format (+234...)
 */
export const normalizePhone = (phone: string): string => {
  const cleaned = phone.replace(/\s+/g, '').replace(/-/g, '')
  if (cleaned.startsWith('+234')) return cleaned
  if (cleaned.startsWith('0')) return '+234' + cleaned.slice(1)
  if (cleaned.startsWith('234')) return '+' + cleaned
  return cleaned
}

/**
 * Validate a Nigerian phone number
 */
export const isValidNigerianPhone = (phone: string): boolean => {
  const normalized = normalizePhone(phone)
  return PHONE_REGEX.test(phone) || /^\+234[789]\d{9}$/.test(normalized)
}

/**
 * Mask phone number for display: +234 801 ***-**45
 */
export const maskPhone = (phone: string): string => {
  if (phone.length < 6) return phone
  const visible = phone.slice(-2)
  return phone.slice(0, 4) + '****' + visible
}
