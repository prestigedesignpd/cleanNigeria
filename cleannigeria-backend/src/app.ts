import express, { Request, Response } from 'express'
import helmet from 'helmet'

declare global {
  namespace Express {
    interface Request {
      user?: any
      admin?: any
    }
  }
}

import cors from 'cors'
import compression from 'compression'
import mongoSanitize from 'express-mongo-sanitize'

import { corsOptions } from '@config/cors.config'
import { errorHandler } from '@middleware/errorHandler'
import { notFound } from '@middleware/notFound'
import { maintenanceCheck } from '@middleware/maintenance'
import { requestLogger } from '@middleware/requestLogger'
import { generalLimiter } from '@middleware/rateLimiter'

import routes from '@routes/index'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from '@config/swagger.config'

const app = express()

// ─── Security Headers ────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors(corsOptions))

// ─── Body Parsing ─────────────────────────────────────────────────────────────
// Raw body saved for Paystack webhook signature verification
app.use('/api/v1/paystack/webhook', express.raw({ type: 'application/json' }))

// Standard JSON + URL-encoded parsing for all other routes
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ─── Sanitization & Compression ───────────────────────────────────────────────
// app.use(mongoSanitize()) // Incompatible with Express 5 (sets read-only req.query)
app.use(compression())

// ─── Logging ──────────────────────────────────────────────────────────────────
app.use(requestLogger)

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
app.use('/api/', generalLimiter)

// ─── Maintenance Mode ─────────────────────────────────────────────────────────
app.use(maintenanceCheck)

// ─── API Documentation ────────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'CleanNigeria API Docs',
  swaggerOptions: { persistAuthorization: true },
}))

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'CleanNigeria API',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  })
})

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/v1', routes)

// ─── 404 & Error Handling ─────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

export default app
