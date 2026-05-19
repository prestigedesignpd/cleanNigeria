import mongoose, { Schema, Document } from 'mongoose'

export interface IPasswordReset extends Document {
  userId?: mongoose.Types.ObjectId
  adminId?: mongoose.Types.ObjectId
  token: string
  expiresAt: Date
  createdAt: Date
}

const PasswordResetSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    adminId: { type: Schema.Types.ObjectId, ref: 'AdminUser', index: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
)

// TTL index
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const PasswordReset = mongoose.model<IPasswordReset>('PasswordReset', PasswordResetSchema)
