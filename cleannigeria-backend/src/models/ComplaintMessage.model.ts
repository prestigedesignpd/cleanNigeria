import mongoose, { Schema, Document } from 'mongoose'

export interface IComplaintMessage extends Document {
  complaintId: mongoose.Types.ObjectId
  senderId: mongoose.Types.ObjectId
  senderModel: 'User' | 'AdminUser'
  message: string
  photos: { url: string; publicId: string }[]
  isRead: boolean
  readAt?: Date
  createdAt: Date
}

const ComplaintMessageSchema: Schema = new Schema(
  {
    complaintId: { type: Schema.Types.ObjectId, ref: 'Complaint', required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, required: true, refPath: 'senderModel' },
    senderModel: { type: String, required: true, enum: ['User', 'AdminUser'] },
    message: { type: String, required: true },
    photos: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    isRead: { type: Boolean, default: false },
    readAt: Date,
  },
  { timestamps: true }
)

export const ComplaintMessage = mongoose.model<IComplaintMessage>(
  'ComplaintMessage',
  ComplaintMessageSchema
)
