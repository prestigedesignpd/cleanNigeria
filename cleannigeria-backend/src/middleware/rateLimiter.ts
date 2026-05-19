import rateLimit from 'express-rate-limit'
import { ApiResponse } from '@utils/ApiResponse'

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10)
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)
const authMax = parseInt(process.env.AUTH_RATE_LIMIT_MAX || '10', 10)

const rateLimitHandler = (_req: unknown, res: import('express').Response) => {
  ApiResponse.error(res, 'Too many requests, please try again later.', 429)
}

/**
 * General API rate limiter — 100 req / 15 min per IP
 */
export const generalLimiter = rateLimit({
  windowMs,
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
})

/**
 * Strict auth rate limiter — 10 req / 15 min per IP
 * Applied to: /auth/login, /auth/register, /auth/forgot-password
 */
export const authLimiter = rateLimit({
  windowMs,
  max: authMax,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skipSuccessfulRequests: true,
})

/**
 * OTP / SMS rate limiter — 5 req / 10 min
 */
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
})
