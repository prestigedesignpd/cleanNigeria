import { Notification, NotificationTemplate, User } from '@models/index'
import { logger } from '@utils/logger'
import { emitToUser } from '@config/socket.config'
import { SOCKET_EVENTS } from '@constants/events.constants'
import { EmailService } from '@services/Email.service'
import { NotificationType, NotificationChannel } from '@constants/status.constants'
import Handlebars from 'handlebars'

export class NotificationService {
  /**
   * Send a notification to a specific user
   */
  static async send(params: {
    userId: string
    type: NotificationType
    data?: any
    channels?: NotificationChannel[]
  }) {
    const { userId, type, data, channels = [NotificationChannel.IN_APP] } = params

    try {
      // 1. Get template
      const template = await NotificationTemplate.findOne({ type, isActive: true })
      if (!template) {
        logger.warn(`No active notification template found for type: ${type}`)
        return
      }

      // 2. Compile content
      const title = Handlebars.compile(template.title)(data || {})
      const message = Handlebars.compile(template.message)(data || {})

      // 3. Handle channels
      const targetChannels = channels || template.channels

      // 3a. In-App
      if (targetChannels.includes(NotificationChannel.IN_APP)) {
        const notif = await Notification.create({
          userId,
          type,
          title,
          message,
          data,
          channels: targetChannels,
        })

        // Emit via Socket.io
        emitToUser(userId, SOCKET_EVENTS.NOTIFICATION_NEW, notif)
      }

      // 3b. Email
      if (targetChannels.includes(NotificationChannel.EMAIL)) {
        const user = await User.findById(userId)
        if (user && user.email) {
          // We can use a generic email template for notifications
          await EmailService.sendEmail(user.email, title, 'notification', {
            name: user.firstName,
            title,
            message,
          })
        }
      }

      // 3c. SMS / Push would go here
      // if (targetChannels.includes(NotificationChannel.SMS)) { ... }

    } catch (error) {
      logger.error(`Failed to send notification ${type} to user ${userId}:`, error)
    }
  }

  /**
   * Broadcast notification to all users in a zone or with a specific role
   */
  static async broadcast(params: {
    title: string
    message: string
    targetZones?: string[]
    targetRoles?: string[]
    data?: any
  }) {
    // This would typically be a background job for scale
    // For now, let's keep it simple
    const filters: any = {}
    if (params.targetZones) filters.currentZoneId = { $in: params.targetZones }
    if (params.targetRoles) filters.accountType = { $in: params.targetRoles }

    const users = await User.find(filters).select('_id')
    
    // In production, use BullMQ to process these in batches
    for (const user of users) {
      await this.send({
        userId: user._id.toString(),
        type: NotificationType.SYSTEM_ANNOUNCEMENT, // Generic type
        data: { title: params.title, message: params.message, ...params.data },
      })
    }
  }
}
