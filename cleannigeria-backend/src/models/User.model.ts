import mongoose, { Schema, Document } from 'mongoose'
import { AccountStatus, AccountType } from '@constants/status.constants'

export interface IUser extends Document {
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  password?: string
  avatar?: { url: string; publicId: string }
  accountType: AccountType
  estateId?: mongoose.Types.ObjectId
  businessId?: mongoose.Types.ObjectId
  isEmailVerified: boolean
  isPhoneVerified: boolean
  isActive: boolean
  isSuspended: boolean
  suspendedReason?: string
  suspendedUntil?: Date
  onboardingCompleted: boolean
  onboardingStep: number
  referralCode: string
  referredBy?: mongoose.Types.ObjectId
  twoFactorEnabled: boolean
  twoFactorSecret?: string
  savedCards: {
    authorizationCode: string
    last4: string
    cardType: string
    expMonth: string
    expYear: string
    bank: string
    isDefault: boolean
  }[]
  pushTokens: string[]
  lastLoginAt?: Date
  lastLoginIP?: string
  passwordChangedAt?: Date
  loginAttempts: number
  lockUntil?: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, unique: true, trim: true, index: true },
    password: { type: String, select: false },
    avatar: {
      url: String,
      publicId: String,
    },
    accountType: {
      type: String,
      enum: Object.values(AccountType),
      default: AccountType.ESTATE,
    },
    estateId: { type: Schema.Types.ObjectId, ref: 'Estate' },
    businessId: { type: Schema.Types.ObjectId, ref: 'Business' },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isSuspended: { type: Boolean, default: false },
    suspendedReason: String,
    suspendedUntil: Date,
    onboardingCompleted: { type: Boolean, default: false },
    onboardingStep: { type: Number, default: 1 },
    referralCode: { type: String, unique: true, required: true },
    referredBy: { type: Schema.Types.ObjectId, ref: 'User' },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, select: false },
    savedCards: [
      {
        authorizationCode: { type: String, required: true },
        last4: { type: String, required: true },
        cardType: { type: String },
        expMonth: { type: String },
        expYear: { type: String },
        bank: { type: String },
        isDefault: { type: Boolean, default: false },
      }
    ],
    pushTokens: [{ type: String }],
    lastLoginAt: Date,
    lastLoginIP: String,
    passwordChangedAt: Date,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

UserSchema.virtual('fullName').get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`
})

// Indexes
UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ phone: 1 }, { unique: true })
UserSchema.index({ referralCode: 1 }, { unique: true })
UserSchema.index({ accountType: 1 })
UserSchema.index({ isActive: 1 })
UserSchema.index({ createdAt: 1 })

export const User = mongoose.model<IUser>('User', UserSchema)
