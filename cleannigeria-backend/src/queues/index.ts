import { createQueue } from './base.queue'

export const notificationQueue = createQueue('notification-queue')
export const subscriptionQueue = createQueue('subscription-queue')
export const scheduleQueue = createQueue('schedule-queue')
export const reportQueue = createQueue('report-queue')
