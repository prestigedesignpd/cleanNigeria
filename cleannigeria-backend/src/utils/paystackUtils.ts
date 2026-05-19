import crypto from 'crypto'

/**
 * Verify Paystack webhook signature
 * Paystack sends X-Paystack-Signature header = HMAC SHA512 of request body
 */
export const verifyPaystackWebhookSignature = (
  rawBody: Buffer | string,
  signature: string,
  secret: string
): boolean => {
  const hash = crypto
    .createHmac('sha512', secret)
    .update(rawBody)
    .digest('hex')
  return hash === signature
}

/**
 * Convert Naira amount to Kobo (Paystack uses kobo)
 */
export const nairaToKobo = (naira: number): number => Math.round(naira * 100)

/**
 * Convert Kobo to Naira for display
 */
export const koboToNaira = (kobo: number): number => kobo / 100

/**
 * Format amount in Naira for display
 */
export const formatNaira = (kobo: number): string => {
  const naira = koboToNaira(kobo)
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(naira)
}
