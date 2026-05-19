import mongoose from 'mongoose'
import { logger } from '@utils/logger'

let isConnected = false

export const connectDatabase = async (): Promise<void> => {
  if (isConnected) {
    logger.info('MongoDB: already connected')
    return
  }

  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not defined')

  try {
    mongoose.set('strictQuery', true)

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    isConnected = true
    logger.info('✅ MongoDB connected successfully')

    mongoose.connection.on('disconnected', () => {
      isConnected = false
      logger.warn('MongoDB disconnected')
    })

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err)
    })

    mongoose.connection.on('reconnected', () => {
      isConnected = true
      logger.info('MongoDB reconnected')
    })
  } catch (error) {
    logger.error('MongoDB connection failed:', error)
    throw error
  }
}

export const disconnectDatabase = async (): Promise<void> => {
  if (!isConnected) return
  await mongoose.disconnect()
  isConnected = false
  logger.info('MongoDB disconnected cleanly')
}
