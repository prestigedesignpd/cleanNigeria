import mongoose, { Schema, Document } from 'mongoose'

export interface IAuditLog extends Document {
  adminId: mongoose.Types.ObjectId
  adminName: string
  action: string
  entity: string
  entityId: string
  changes: {
    before: Record<string, unknown>
    after: Record<string, unknown>
  }
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, unknown>
  createdAt: Date
}

const AuditLogSchema: Schema = new Schema(
  {
    adminId: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true, index: true },
    adminName: { type: String, required: true },
    action: { type: String, required: true, index: true },
    entity: { type: String, required: true, index: true },
    entityId: { type: String, required: true },
    changes: {
      before: { type: Schema.Types.Mixed },
      after: { type: Schema.Types.Mixed },
    },
    ipAddress: String,
    userAgent: String,
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true, updatedAt: false }
)

// TTL index to auto-delete logs after 1 year (configurable)
AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 })

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema)
