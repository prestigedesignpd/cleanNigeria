import mongoose, { Schema, Document } from 'mongoose'
import {
  ComplaintStatus,
  ComplaintPriority,
  ComplaintCategory,
} from '@constants/status.constants'

export interface IComplaint extends Document {
  ticketId: string
  userId: mongoose.Types.ObjectId
  estateId?: mongoose.Types.ObjectId
  businessId?: mongoose.Types.ObjectId
  relatedScheduleId?: mongoose.Types.ObjectId
  category: ComplaintCategory
  subject: string
  description: string
  photos: { url: string; publicId: string }[]
  priority: ComplaintPriority
  status: ComplaintStatus
  assignedTo?: mongoose.Types.ObjectId
  assignedAt?: Date
  resolvedAt?: Date
  closedAt?: Date
  resolutionNote?: string
  slaDeadline?: Date
  slaBreached: boolean
  satisfactionRating?: number
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

const ComplaintSchema: Schema = new Schema(
  {
    ticketId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    estateId: { type: Schema.Types.ObjectId, ref: 'Estate' },
    businessId: { type: Schema.Types.ObjectId, ref: 'Business' },
    relatedScheduleId: { type: Schema.Types.ObjectId, ref: 'PickupSchedule' },
    category: {
      type: String,
      enum: Object.values(ComplaintCategory),
      required: true,
    },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    photos: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    priority: {
      type: String,
      enum: Object.values(ComplaintPriority),
      default: ComplaintPriority.MEDIUM,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(ComplaintStatus),
      default: ComplaintStatus.OPEN,
      index: true,
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    assignedAt: Date,
    resolvedAt: Date,
    closedAt: Date,
    resolutionNote: String,
    slaDeadline: Date,
    slaBreached: { type: Boolean, default: false, index: true },
    satisfactionRating: { type: Number, min: 1, max: 5 },
    tags: [{ type: String }],
  },
  { timestamps: true }
)

ComplaintSchema.index({ createdAt: 1 })

export const Complaint = mongoose.model<IComplaint>('Complaint', ComplaintSchema)
