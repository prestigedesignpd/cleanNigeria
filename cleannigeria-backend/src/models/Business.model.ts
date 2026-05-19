import mongoose, { Schema, Document } from 'mongoose'
import { BusinessType, WasteVolumeTier, AccountStatus } from '@constants/status.constants'
import slugify from 'slugify'

export interface IBusiness extends Document {
  name: string
  slug: string
  businessType: BusinessType
  description?: string
  wasteVolumeTier: WasteVolumeTier
  address: {
    street: string
    lga: string
    state: string
    coordinates: { lat: number; lng: number }
  }
  zoneId: mongoose.Types.ObjectId
  ownerId: mongoose.Types.ObjectId
  contactPerson: {
    name: string
    phone: string
    email: string
  }
  logo?: { url: string; publicId: string }
  documents: {
    type: string
    url: string
    publicId: string
    uploadedAt: Date
  }[]
  status: AccountStatus
  notes?: string
  createdBy?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const BusinessSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    businessType: {
      type: String,
      enum: Object.values(BusinessType),
      required: true,
    },
    description: String,
    wasteVolumeTier: {
      type: String,
      enum: Object.values(WasteVolumeTier),
      default: WasteVolumeTier.SMALL,
    },
    address: {
      street: { type: String, required: true },
      lga: { type: String, required: true },
      state: { type: String, required: true },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    zoneId: { type: Schema.Types.ObjectId, ref: 'Zone', index: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    contactPerson: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    logo: {
      url: String,
      publicId: String,
    },
    documents: [
      {
        type: { type: String, enum: ['CAC', 'UTILITY_BILL', 'ID_CARD', 'OTHER'] },
        url: String,
        publicId: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.PENDING,
    },
    notes: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  },
  { timestamps: true }
)

BusinessSchema.pre('save', async function (this: IBusiness) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true })
  }
})

BusinessSchema.index({ name: 'text', slug: 1 })

export const Business = mongoose.model<IBusiness>('Business', BusinessSchema)
