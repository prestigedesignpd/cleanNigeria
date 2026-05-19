import mongoose, { Schema, Document } from 'mongoose'
import { WasteType } from '@constants/status.constants'

export interface ICollectionLog extends Document {
  scheduleId: mongoose.Types.ObjectId
  collectorId: mongoose.Types.ObjectId
  estateId?: mongoose.Types.ObjectId
  businessId?: mongoose.Types.ObjectId
  arrivedAt?: Date
  completedAt?: Date
  durationMinutes?: number
  weightKg?: number
  wasteTypes: WasteType[]
  photos: { url: string; publicId: string }[]
  notes?: string
  rating?: number
  ratingComment?: string
  ratedAt?: Date
  isLate: boolean
  lateByMinutes?: number
  location?: {
    type: 'Point'
    coordinates: [number, number]
  }
  createdAt: Date
  updatedAt: Date
}

const CollectionLogSchema: Schema = new Schema(
  {
    scheduleId: { type: Schema.Types.ObjectId, ref: 'PickupSchedule', required: true, index: true },
    collectorId: { type: Schema.Types.ObjectId, ref: 'Collector', required: true, index: true },
    estateId: { type: Schema.Types.ObjectId, ref: 'Estate' },
    businessId: { type: Schema.Types.ObjectId, ref: 'Business' },
    arrivedAt: Date,
    completedAt: Date,
    durationMinutes: Number,
    weightKg: Number,
    wasteTypes: [{ type: String, enum: Object.values(WasteType) }],
    photos: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    notes: String,
    rating: { type: Number, min: 1, max: 5 },
    ratingComment: String,
    ratedAt: Date,
    isLate: { type: Boolean, default: false },
    lateByMinutes: Number,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number], // [lng, lat]
    },
  },
  { timestamps: true }
)

CollectionLogSchema.index({ location: '2dsphere' })

export const CollectionLog = mongoose.model<ICollectionLog>('CollectionLog', CollectionLogSchema)
