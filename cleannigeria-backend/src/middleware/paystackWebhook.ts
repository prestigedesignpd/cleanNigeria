import { Request, Response, NextFunction } from 'express'
import { verifyPaystackWebhookSignature } from '@utils/paystackUtils'
import { ApiError } from '@utils/ApiError'

/**
 * Middleware: verify Paystack webhook signature before processing events
 * IMPORTANT: Must be applied BEFORE express.json() parses the body
 * Use express.raw() on the webhook route to preserve the raw body
 */
export const verifyPaystackWebhook = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const signature = req.headers['x-paystack-signature'] as string
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET

  if (!signature) {
    throw ApiError.unauthorized('Missing Paystack signature')
  }

  if (!secret) {
    throw ApiError.internal('Paystack webhook secret not configured')
  }

  const rawBody = (req as Request & { rawBody?: Buffer }).rawBody || req.body
  const isValid = verifyPaystackWebhookSignature(rawBody, signature, secret)

  if (!isValid) {
    throw ApiError.unauthorized('Invalid Paystack webhook signature', 'WEBHOOK_SIGNATURE_INVALID')
  }

  next()
}
