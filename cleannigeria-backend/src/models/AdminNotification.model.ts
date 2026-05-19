import mongoose, { Schema, Document } from 'mongoose'

export interface IAdminNotification extends Document {
  title: string
  message: string
  type: string // 'Alert' | 'Payment' | 'System' | 'Collector'
  isRead: boolean
  readAt?: Date
  createdAt: Date
  updatedAt: Date
}

const AdminNotificationSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true, default: 'System' },
    isRead: { type: Boolean, default: false, index: true },
    readAt: Date,
  },
  { timestamps: true }
)

export const AdminNotification = mongoose.model<IAdminNotification>(
  'AdminNotification',
  AdminNotificationSchema
)
