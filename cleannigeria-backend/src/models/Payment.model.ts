import mongoose, { Schema, Document } from 'mongoose'
import { PaymentStatus, PaymentType } from '@constants/status.constants'

export interface IPayment extends Document {
  reference: string
  paystackReference: string
  userId: mongoose.Types.ObjectId
  subscriptionId?: mongoose.Types.ObjectId
  type: PaymentType
  amount: number // in kobo
  currency: string
  status: PaymentStatus
  channel?: string
  metadata?: Record<string, unknown>
  paymentMethod?: {
    type: string
    last4: string
    bank: string
    authorizationCode: string
  }
  paidAt?: Date
  failureReason?: string
  retryCount: number
  refundedAmount?: number
  adminNote?: string
  createdAt: Date
  updatedAt: Date
}

const PaymentSchema: Schema = new Schema(
  {
    reference: { type: String, required: true, unique: true },
    paystackReference: { type: String, unique: true, sparse: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription', index: true },
    type: {
      type: String,
      enum: Object.values(PaymentType),
      required: true,
    },
    amount: { type: Number, required: true }, // kobo
    currency: { type: String, default: 'NGN' },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      index: true,
    },
    channel: String,
    metadata: { type: Schema.Types.Mixed },
    paymentMethod: {
      type: { type: String },
      last4: String,
      bank: String,
      authorizationCode: String,
    },
    paidAt: Date,
    failureReason: String,
    retryCount: { type: Number, default: 0 },
    refundedAmount: { type: Number, default: 0 },
    adminNote: String,
  },
  { timestamps: true }
)

PaymentSchema.index({ createdAt: 1 })

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema)
