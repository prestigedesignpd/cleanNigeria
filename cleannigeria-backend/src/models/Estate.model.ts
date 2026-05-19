import mongoose, { Schema, Document } from 'mongoose'
import { CollectionType, AccountStatus } from '@constants/status.constants'
import slugify from 'slugify'

export interface IEstate extends Document {
  name: string
  slug: string
  description?: string
  collectionType: CollectionType
  totalUnits: number
  address: {
    street: string
    lga: string
    state: string
    coordinates: { lat: number; lng: number }
  }
  zoneId: mongoose.Types.ObjectId
  managerId?: mongoose.Types.ObjectId
  managerName?: string
  managerPhone?: string
  managerEmail?: string
  logo?: { url: string; publicId: string }
  status: AccountStatus
  notes?: string
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const EstateSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: String,
    collectionType: {
      type: String,
      enum: Object.values(CollectionType),
      default: CollectionType.FULL,
    },
    totalUnits: { type: Number, default: 0 },
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
    managerId: { type: Schema.Types.ObjectId, ref: 'User' },
    managerName: String,
    managerPhone: String,
    managerEmail: String,
    logo: {
      url: String,
      publicId: String,
    },
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

// Auto-generate slug from name
EstateSchema.pre('save', async function (this: IEstate) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true })
  }
})

EstateSchema.index({ name: 'text', slug: 1 })
EstateSchema.index({ 'address.state': 1, 'address.lga': 1 })

export const Estate = mongoose.model<IEstate>('Estate', EstateSchema)
