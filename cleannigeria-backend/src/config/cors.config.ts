import { CorsOptions } from 'cors'
import { logger } from '@utils/logger'

const ALLOWED_ORIGINS = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  process.env.ADMIN_URL || 'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:5174',
]

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, mobile apps, curl)
    if (!origin) return callback(null, true)

    if (ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true)
    } else {
      logger.warn(`CORS blocked origin: ${origin}`)
      callback(new Error(`Origin ${origin} is not allowed by CORS policy`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400, // 24 hours preflight cache
}
