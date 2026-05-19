import { Worker, Job } from 'bullmq'
import { redisConfig } from '@config/database.config'
import { logger } from '@utils/logger'
import { NotificationService } from '@services/Notification.service'

export const notificationWorker = new Worker(
  'notification-queue',
  async (job: Job) => {
    const { userId, type, data, channels } = job.data
    logger.info(`Processing notification job ${job.id} for user ${userId}`)
    
    await NotificationService.send({
      userId,
      type,
      data,
      channels,
    })
  },
  { connection: redisConfig }
)

notificationWorker.on('completed', (job) => {
  logger.info(`Notification job ${job.id} completed`)
})

notificationWorker.on('failed', (job, err) => {
  logger.error(`Notification job ${job?.id} failed:`, err)
})
