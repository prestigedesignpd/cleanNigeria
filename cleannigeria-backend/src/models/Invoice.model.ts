import mongoose, { Schema, Document } from 'mongoose'
import { InvoiceStatus } from '@constants/status.constants'

export interface IInvoice extends Document {
  invoiceNumber: string
  userId: mongoose.Types.ObjectId
  paymentId?: mongoose.Types.ObjectId
  subscriptionId?: mongoose.Types.ObjectId
  lineItems: {
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
  subtotal: number
  tax: number
  taxRate: number
  discount: number
  total: number
  currency: string
  status: InvoiceStatus
  issuedAt: Date
  dueDate: Date
  paidAt?: Date
  pdfUrl?: string
  pdfPublicId?: string
  createdAt: Date
  updatedAt: Date
}

const InvoiceSchema: Schema = new Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
    subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription' },
    lineItems: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: 'NGN' },
    status: {
      type: String,
      enum: Object.values(InvoiceStatus),
      default: InvoiceStatus.DRAFT,
      index: true,
    },
    issuedAt: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    paidAt: Date,
    pdfUrl: String,
    pdfPublicId: String,
  },
  { timestamps: true }
)

export const Invoice = mongoose.model<IInvoice>('Invoice', InvoiceSchema)
