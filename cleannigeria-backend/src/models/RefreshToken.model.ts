import mongoose, { Schema, Document } from 'mongoose'

export interface IRefreshToken extends Document {
  userId: mongoose.Types.ObjectId
  adminId?: mongoose.Types.ObjectId
  token: string
  expiresAt: Date
  isRevoked: boolean
  replacedByToken?: string
  createdAt: Date
}

const RefreshTokenSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    adminId: { type: Schema.Types.ObjectId, ref: 'AdminUser', index: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    isRevoked: { type: Boolean, default: false },
    replacedByToken: { type: String },
  },
  { timestamps: true }
)

// TTL index
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema)
