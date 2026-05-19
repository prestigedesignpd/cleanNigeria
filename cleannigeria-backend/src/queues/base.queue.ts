import { Queue, DefaultJobOptions } from 'bullmq'
import { redisConfig } from '@config/database.config'
import { logger } from '@utils/logger'

const defaultJobOptions: DefaultJobOptions = {
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 1000 },
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 5000,
  },
}

export const createQueue = (name: string) => {
  const queue = new Queue(name, {
    connection: redisConfig,
    defaultJobOptions,
  })

  queue.on('error', (err) => {
    logger.error(`Queue ${name} error:`, err)
  })

  return queue
}
