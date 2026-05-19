import { Worker, Job } from 'bullmq'
import { redisConfig } from '@config/database.config'
import { logger } from '@utils/logger'
import { Subscription } from '@models/index'
import { PaystackService } from '@services/Paystack.service'

export const subscriptionWorker = new Worker(
  'subscription-queue',
  async (job: Job) => {
    const { action, subscriptionId } = job.data
    logger.info(`Processing subscription job ${job.id}: ${action}`)

    if (action === 'RENEW_CHECK') {
      const sub = await Subscription.findById(subscriptionId).populate('planId')
      if (!sub || sub.status !== 'ACTIVE') return

      // Logic for auto-renewal would go here
      // 1. Check if period end is soon
      // 2. Charge via Paystack authorization code
      // 3. Update subscription dates
    }
  },
  { connection: redisConfig }
)

subscriptionWorker.on('completed', (job) => {
  logger.info(`Subscription job ${job.id} completed`)
})
