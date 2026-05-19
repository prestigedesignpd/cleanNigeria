import mongoose, { Schema, Document } from 'mongoose'

export interface ICollectorZoneAssignment extends Document {
  collectorId: mongoose.Types.ObjectId
  zoneId: mongoose.Types.ObjectId
  assignedBy: mongoose.Types.ObjectId
  isActive: boolean
  assignedAt: Date
  revokedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const CollectorZoneAssignmentSchema: Schema = new Schema(
  {
    collectorId: { type: Schema.Types.ObjectId, ref: 'Collector', required: true, index: true },
    zoneId: { type: Schema.Types.ObjectId, ref: 'Zone', required: true, index: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
    isActive: { type: Boolean, default: true },
    assignedAt: { type: Date, default: Date.now },
    revokedAt: Date,
  },
  { timestamps: true }
)

// Compound index to ensure a collector is only active in a zone once
CollectorZoneAssignmentSchema.index({ collectorId: 1, zoneId: 1, isActive: 1 })

export const CollectorZoneAssignment = mongoose.model<ICollectorZoneAssignment>(
  'CollectorZoneAssignment',
  CollectorZoneAssignmentSchema
)
