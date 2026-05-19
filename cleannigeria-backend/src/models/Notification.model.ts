import mongoose, { Schema, Document } from 'mongoose'
import { NotificationType, NotificationChannel } from '@constants/status.constants'

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId
  type: NotificationType
  title: string
  message: string
  data?: Record<string, unknown>
  channels: NotificationChannel[]
  isRead: boolean
  readAt?: Date
  actionUrl?: string
  createdAt: Date
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: Schema.Types.Mixed },
    channels: [{ type: String, enum: Object.values(NotificationChannel) }],
    isRead: { type: Boolean, default: false, index: true },
    readAt: Date,
    actionUrl: String,
  },
  { timestamps: true }
)

// TTL index to auto-delete notifications after 90 days
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 })

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema)
