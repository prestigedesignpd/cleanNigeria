import crypto from 'crypto'

/**
 * Generate a numeric OTP of specified length
 */
export const generateOtp = (length = 6): string => {
  const digits = '0123456789'
  let otp = ''
  const bytes = crypto.randomBytes(length)
  for (let i = 0; i < length; i++) {
    otp += digits[bytes[i] % 10]
  }
  return otp
}

/**
 * Generate a secure random hex token (for password reset links)
 */
export const generateSecureToken = (bytes = 32): string => {
  return crypto.randomBytes(bytes).toString('hex')
}

/**
 * Get OTP expiry date (default: 10 minutes from now)
 */
export const getOtpExpiry = (minutes?: number): Date => {
  const mins = minutes ?? parseInt(process.env.OTP_EXPIRES_MINUTES || '10', 10)
  const expiry = new Date()
  expiry.setMinutes(expiry.getMinutes() + mins)
  return expiry
}
