import { env } from './env'

export const paystackConfig = {
  publicKey: env.paystackPublicKey,
  currency: 'NGN',
  channels: ['card', 'bank', 'ussd', 'bank_transfer'] as const,
}
