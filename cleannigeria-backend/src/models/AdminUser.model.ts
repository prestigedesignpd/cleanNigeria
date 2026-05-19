import mongoose, { Schema, Document } from 'mongoose'
import { AdminRole } from '@constants/roles.constants'

export interface IAdminUser extends Document {
  firstName: string
  lastName: string
  fullName: string
  email: string
  password?: string
  avatar?: { url: string; publicId: string }
  role: AdminRole
  permissions: string[]
  isActive: boolean
  isSuspended: boolean
  twoFactorEnabled: boolean
  twoFactorSecret?: string
  lastLoginAt?: Date
  lastLoginIP?: string
  loginAttempts: number
  lockUntil?: Date
  invitedBy?: mongoose.Types.ObjectId
  inviteAcceptedAt?: Date
  passwordChangedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const AdminUserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    avatar: {
      url: String,
      publicId: String,
    },
    role: {
      type: String,
      enum: Object.values(AdminRole),
      default: AdminRole.SUPPORT_AGENT,
    },
    permissions: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isSuspended: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, select: false },
    lastLoginAt: Date,
    lastLoginIP: String,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
    invitedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    inviteAcceptedAt: Date,
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

AdminUserSchema.virtual('fullName').get(function (this: IAdminUser) {
  return `${this.firstName} ${this.lastName}`
})

export const AdminUser = mongoose.model<IAdminUser>('AdminUser', AdminUserSchema)
