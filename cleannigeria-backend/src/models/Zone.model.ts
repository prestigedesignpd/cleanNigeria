import mongoose, { Schema, Document } from 'mongoose'
import { ZoneStatus, CollectionDay } from '@constants/status.constants'

export interface IZone extends Document {
  name: string
  description?: string
  state: string
  lgas: string[]
  collectionDays: CollectionDay[]
  timeWindows: {
    label: string
    startTime: string
    endTime: string
  }[]
  boundary: {
    type: 'Polygon'
    coordinates: number[][][]
  }
  status: ZoneStatus
  coverageNotes?: string
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const ZoneSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: String,
    state: { type: String, required: true },
    lgas: [{ type: String }],
    collectionDays: [{ type: String, enum: Object.values(CollectionDay) }],
    timeWindows: [
      {
        label: { type: String, required: true },
        startTime: { type: String, required: true }, // e.g. "07:00"
        endTime: { type: String, required: true }, // e.g. "12:00"
      },
    ],
    boundary: {
      type: { type: String, enum: ['Polygon'], default: 'Polygon' },
      coordinates: { type: [[[Number]]], required: true },
    },
    status: {
      type: String,
      enum: Object.values(ZoneStatus),
      default: ZoneStatus.ACTIVE,
    },
    coverageNotes: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
  },
  { timestamps: true }
)

// GeoJSON index for spatial queries
ZoneSchema.index({ boundary: '2dsphere' })

export const Zone = mongoose.model<IZone>('Zone', ZoneSchema)
