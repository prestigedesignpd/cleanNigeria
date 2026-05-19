import mongoose, { Schema, Document } from 'mongoose'
import { PlanTargetType } from '@constants/status.constants'
import { NIGERIAN_CURRENCY } from '@constants/nigeria.constants'
import slugify from 'slugify'

export interface ISubscriptionPlan extends Document {
  name: string
  slug: string
  description: string
  tagline?: string
  targetType: PlanTargetType
  pricing: {
    monthly: number
    yearly: number
    currency: string
  }
  paystackPlanCodes: {
    monthly?: string
    yearly?: string
  }
  features: {
    text: string
    included: boolean
  }[]
  limits: {
    pickupsPerCycle: number
    maxUnits?: number
    extraPickupPrice: number
  }
  allowExtraPickups: boolean
  trialDays: number
  isActive: boolean
  isFeatured: boolean
  displayOrder: number
  color?: string
  icon?: string
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const SubscriptionPlanSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: true },
    tagline: String,
    targetType: {
      type: String,
      enum: Object.values(PlanTargetType),
      required: true,
    },
    pricing: {
      monthly: { type: Number, required: true }, // in kobo
      yearly: { type: Number, required: true }, // in kobo
      currency: { type: String, default: 'NGN' },
    },
    paystackPlanCodes: {
      monthly: String,
      yearly: String,
    },
    features: [
      {
        text: { type: String, required: true },
        included: { type: Boolean, default: true },
      },
    ],
    limits: {
      pickupsPerCycle: { type: Number, required: true },
      maxUnits: Number,
      extraPickupPrice: { type: Number, default: 0 },
    },
    allowExtraPickups: { type: Boolean, default: true },
    trialDays: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    color: String,
    icon: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  },
  { timestamps: true }
)

SubscriptionPlanSchema.pre('save', async function (this: ISubscriptionPlan) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true })
  }
})

export const SubscriptionPlan = mongoose.model<ISubscriptionPlan>(
  'SubscriptionPlan',
  SubscriptionPlanSchema
)
