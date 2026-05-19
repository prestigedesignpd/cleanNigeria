import mongoose, { Schema, Document } from 'mongoose'

export interface IOTPVerification extends Document {
  userId: mongoose.Types.ObjectId
  code: string
  type: 'email' | 'phone' | '2fa'
  expiresAt: Date
  createdAt: Date
}

const OTPVerificationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    code: { type: String, required: true },
    type: { type: String, enum: ['email', 'phone', '2fa'], required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
)

// TTL index to automatically delete expired OTPs
OTPVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const OTPVerification = mongoose.model<IOTPVerification>(
  'OTPVerification',
  OTPVerificationSchema
)
