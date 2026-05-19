import mongoose, { Schema, Document } from 'mongoose'
import { NotificationType, NotificationChannel } from '@constants/status.constants'

export interface INotificationTemplate extends Document {
  name: string
  type: NotificationType
  channels: NotificationChannel[]
  title: string // Handlebars template
  message: string // Handlebars template
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const NotificationTemplateSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, enum: Object.values(NotificationType), required: true, unique: true },
    channels: [{ type: String, enum: Object.values(NotificationChannel) }],
    title: { type: String, required: true },
    message: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const NotificationTemplate = mongoose.model<INotificationTemplate>(
  'NotificationTemplate',
  NotificationTemplateSchema
)
