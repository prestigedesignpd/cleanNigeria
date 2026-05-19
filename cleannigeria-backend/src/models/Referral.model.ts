import mongoose, { Schema, Document } from 'mongoose'
import { ReferralStatus } from '@constants/status.constants'

export interface IReferral extends Document {
  referrerId: mongoose.Types.ObjectId
  referredUserId: mongoose.Types.ObjectId
  referralCode: string
  status: ReferralStatus
  rewardAmount: number // in kobo
  rewardAppliedAt?: Date
  rewardAppliedToInvoice?: mongoose.Types.ObjectId
  qualifiedAt?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const ReferralSchema: Schema = new Schema(
  {
    referrerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    referredUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    referralCode: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: Object.values(ReferralStatus),
      default: ReferralStatus.PENDING,
    },
    rewardAmount: { type: Number, default: 0 },
    rewardAppliedAt: Date,
    rewardAppliedToInvoice: { type: Schema.Types.ObjectId, ref: 'Invoice' },
    qualifiedAt: Date,
    notes: String,
  },
  { timestamps: true }
)

export const Referral = mongoose.model<IReferral>('Referral', ReferralSchema)
