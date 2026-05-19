import mongoose, { Schema, Document } from 'mongoose'
import { PaymentStatus } from '@constants/status.constants'

export interface IRefund extends Document {
  paymentId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  amount: number // in kobo
  reason: string
  status: PaymentStatus
  paystackRefundId?: string
  adminId: mongoose.Types.ObjectId
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const RefundSchema: Schema = new Schema(
  {
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true }, // kobo
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    paystackRefundId: String,
    adminId: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
    notes: String,
  },
  { timestamps: true }
)

export const Refund = mongoose.model<IRefund>('Refund', RefundSchema)
