import mongoose, { Schema, Document } from 'mongoose'

export interface IBroadcastLog extends Document {
  adminId: mongoose.Types.ObjectId
  templateId?: mongoose.Types.ObjectId
  title: string
  message: string
  targetRoles: string[]
  targetZones: mongoose.Types.ObjectId[]
  recipientCount: number
  channels: string[]
  metadata?: Record<string, unknown>
  createdAt: Date
}

const BroadcastLogSchema: Schema = new Schema(
  {
    adminId: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true, index: true },
    templateId: { type: Schema.Types.ObjectId, ref: 'NotificationTemplate' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    targetRoles: [{ type: String }],
    targetZones: [{ type: Schema.Types.ObjectId, ref: 'Zone' }],
    recipientCount: { type: Number, default: 0 },
    channels: [{ type: String }],
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
)

export const BroadcastLog = mongoose.model<IBroadcastLog>('BroadcastLog', BroadcastLogSchema)
