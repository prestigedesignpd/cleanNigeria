import mongoose, { Schema, Document } from 'mongoose'
import { SubscriptionStatus } from '@constants/status.constants'

export interface IEstateUnit extends Document {
  estateId: mongoose.Types.ObjectId
  unitNumber: string
  residentName?: string
  residentPhone?: string
  residentEmail?: string
  userId?: mongoose.Types.ObjectId
  subscriptionStatus: SubscriptionStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const EstateUnitSchema: Schema = new Schema(
  {
    estateId: { type: Schema.Types.ObjectId, ref: 'Estate', required: true, index: true },
    unitNumber: { type: String, required: true },
    residentName: String,
    residentPhone: String,
    residentEmail: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    subscriptionStatus: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.PENDING,
    },
    notes: String,
  },
  { timestamps: true }
)

// Ensure unitNumber is unique within an estate
EstateUnitSchema.index({ estateId: 1, unitNumber: 1 }, { unique: true })

export const EstateUnit = mongoose.model<IEstateUnit>('EstateUnit', EstateUnitSchema)
