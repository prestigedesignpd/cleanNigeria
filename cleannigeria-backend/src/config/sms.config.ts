export const smsConfig = {
  apiKey: process.env.TERMII_API_KEY || '',
  senderId: process.env.TERMII_SENDER_ID || 'CleanNG',
  baseUrl: process.env.TERMII_BASE_URL || 'https://api.ng.termii.com/api',
  channel: 'generic' as const,
  messageType: 'ALPHANUMERIC' as const,
}
