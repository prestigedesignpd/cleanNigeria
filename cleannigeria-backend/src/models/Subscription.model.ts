import mongoose, { Schema, Document } from 'mongoose'
import { SubscriptionStatus, BillingCycle } from '@constants/status.constants'

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId
  planId: mongoose.Types.ObjectId
  estateId?: mongoose.Types.ObjectId
  businessId?: mongoose.Types.ObjectId
  unitId?: mongoose.Types.ObjectId
  status: SubscriptionStatus
  billingCycle: BillingCycle
  currentPeriodStart: Date
  currentPeriodEnd: Date
  trialStart?: Date
  trialEnd?: Date
  cancelledAt?: Date
  cancellationReason?: string
  paystackSubscriptionCode?: string
  paystackCustomerCode?: string
  paystackAuthorizationCode?: string
  autoRenew: boolean
  discountApplied?: number
  referralCreditApplied?: number
  adminNote?: string
  createdAt: Date
  updatedAt: Date
}

const SubscriptionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    planId: { type: Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true, index: true },
    estateId: { type: Schema.Types.ObjectId, ref: 'Estate', index: true },
    businessId: { type: Schema.Types.ObjectId, ref: 'Business', index: true },
    unitId: { type: Schema.Types.ObjectId, ref: 'EstateUnit', index: true },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.PENDING,
      index: true,
    },
    billingCycle: {
      type: String,
      enum: Object.values(BillingCycle),
      required: true,
    },
    currentPeriodStart: { type: Date, required: true },
    currentPeriodEnd: { type: Date, required: true, index: true },
    trialStart: Date,
    trialEnd: Date,
    cancelledAt: Date,
    cancellationReason: String,
    paystackSubscriptionCode: String,
    paystackCustomerCode: String,
    paystackAuthorizationCode: String,
    autoRenew: { type: Boolean, default: true },
    discountApplied: Number,
    referralCreditApplied: Number,
    adminNote: String,
  },
  { timestamps: true }
)

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema)
