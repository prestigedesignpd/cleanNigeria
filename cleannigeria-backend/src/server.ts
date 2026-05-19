import 'reflect-metadata'
import dotenv from 'dotenv'
dotenv.config()
console.log('DEBUG: MONGODB_URI=', process.env.MONGODB_URI)

import dns from 'dns'
dns.setDefaultResultOrder('ipv4first')

import http from 'http'
import app from './app'
import { connectDatabase } from '@config/database.config'
import { connectRedis } from '@config/redis.config'
import { initializeSocket } from '@config/socket.config'
import { configureCloudinary } from '@config/cloudinary.config'
import { registerJobs } from '@jobs/index'
import { logger } from '@utils/logger'

console.log('DEBUG: server.ts started')

const PORT = process.env.PORT || 5000

async function bootstrap(): Promise<void> {
  console.log('DEBUG: bootstrap started')
  try {
    logger.info('🚀 Starting CleanNigeria API...')
    console.log('DEBUG: connecting to DB...')

    // External services
    await connectDatabase()
    // await connectRedis() // Redis not available on host
    configureCloudinary()

    // HTTP server
    const server = http.createServer(app)

    // Socket.io (real-time)
    initializeSocket(server)

    // Background jobs
    // registerJobs() // Requires Redis

    // Start listening
    server.listen(PORT as number, '0.0.0.0', () => {
      logger.info(`✅ CleanNigeria API running on port ${PORT}`)
      logger.info(`📚 API docs: http://localhost:${PORT}/api-docs`)
      logger.info(`💚 Health:   http://localhost:${PORT}/health`)
      logger.info(`🌍 Environment: ${process.env.NODE_ENV}`)
    })

    // ─── Graceful Shutdown ────────────────────────────────────────────────────
    const shutdown = (signal: string) => {
      logger.info(`${signal} received — shutting down gracefully...`)
      server.close(async () => {
        const { disconnectDatabase } = await import('@config/database.config')
        const { disconnectRedis } = await import('@config/redis.config')
        await disconnectDatabase()
        await disconnectRedis()
        logger.info('Shutdown complete.')
        process.exit(0)
      })

      // Force kill after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout')
        process.exit(1)
      }, 10_000)
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))

    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err)
      process.exit(1)
    })

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Rejection:', reason)
      process.exit(1)
    })

  } catch (error) {
    logger.error('Fatal: failed to start server:', error)
    process.exit(1)
  }
}

bootstrap()
