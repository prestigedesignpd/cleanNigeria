import { notificationWorker } from '@workers/notification.worker'
import { subscriptionWorker } from '@workers/subscription.worker'
import { logger } from '@utils/logger'

/**
 * Register all background workers
 * In a large app, workers might run in a separate process
 */
export const registerJobs = () => {
  logger.info('🚀 Registering background workers...')
  
  // Workers start automatically upon instantiation, but we reference them here
  // to ensure they are loaded into the process.
  const workers = [
    notificationWorker,
    subscriptionWorker,
  ]

  logger.info(`✅ ${workers.length} workers are active.`)
}
