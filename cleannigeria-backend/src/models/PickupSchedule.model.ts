import mongoose, { Schema, Document } from 'mongoose'
import { PickupStatus, PickupType, TimeWindow } from '@constants/status.constants'

export interface IPickupSchedule extends Document {
  estateId?: mongoose.Types.ObjectId
  businessId?: mongoose.Types.ObjectId
  unitId?: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  zoneId: mongoose.Types.ObjectId
  collectorId?: mongoose.Types.ObjectId
  subscriptionId: mongoose.Types.ObjectId
  scheduledDate: Date
  timeWindow: TimeWindow
  status: PickupStatus
  type: PickupType
  rescheduledFrom?: mongoose.Types.ObjectId
  rescheduledTo?: mongoose.Types.ObjectId
  missedReason?: string
  adminNote?: string
  reminderSent: boolean
  createdBy: string // "SYSTEM" or Admin ID
  createdAt: Date
  updatedAt: Date
}

const PickupScheduleSchema: Schema = new Schema(
  {
    estateId: { type: Schema.Types.ObjectId, ref: 'Estate', index: true },
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', index: true },
    unitId: { type: Schema.Types.ObjectId, ref: 'EstateUnit' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    zoneId: { type: Schema.Types.ObjectId, ref: 'Zone', required: true, index: true },
    collectorId: { type: Schema.Types.ObjectId, ref: 'Collector', index: true },
    subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription', required: true },
    scheduledDate: { type: Date, required: true, index: true },
    timeWindow: {
      type: String,
      enum: Object.values(TimeWindow),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PickupStatus),
      default: PickupStatus.SCHEDULED,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(PickupType),
      default: PickupType.REGULAR,
    },
    rescheduledFrom: { type: Schema.Types.ObjectId, ref: 'PickupSchedule' },
    rescheduledTo: { type: Schema.Types.ObjectId, ref: 'PickupSchedule' },
    missedReason: String,
    adminNote: String,
    reminderSent: { type: Boolean, default: false },
    createdBy: { type: String, default: 'SYSTEM' },
  },
  { timestamps: true }
)

export const PickupSchedule = mongoose.model<IPickupSchedule>(
  'PickupSchedule',
  PickupScheduleSchema
)
