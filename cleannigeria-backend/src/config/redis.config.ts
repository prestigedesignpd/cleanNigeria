import { Redis } from 'ioredis'
import { logger } from '@utils/logger'

let redisClient: Redis | null = null

export const connectRedis = async (): Promise<Redis> => {
  if (redisClient) return redisClient

  const url = process.env.REDIS_URL || 'redis://localhost:6379'
  const password = process.env.REDIS_PASSWORD || undefined

  redisClient = new Redis(url, {
    password: password || undefined,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    retryStrategy: (times) => {
      if (times > 5) {
        logger.error('Redis: max retries reached, giving up')
        return null
      }
      return Math.min(times * 200, 2000)
    },
  })

  redisClient.on('connect', () => logger.info('✅ Redis connected'))
  redisClient.on('error', (err) => logger.error('Redis error:', err))
  redisClient.on('close', () => logger.warn('Redis connection closed'))

  await redisClient.connect()
  return redisClient
}

export const getRedisClient = (): Redis => {
  if (!redisClient) throw new Error('Redis not connected. Call connectRedis() first.')
  return redisClient
}

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit()
    redisClient = null
    logger.info('Redis disconnected cleanly')
  }
}
