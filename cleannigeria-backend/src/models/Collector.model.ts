import mongoose, { Schema, Document } from 'mongoose'
import { CollectorStatus, VehicleType } from '@constants/status.constants'

export interface ICollector extends Document {
  employeeId: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  password?: string
  avatar?: { url: string; publicId: string }
  gender?: 'MALE' | 'FEMALE'
  dateOfBirth?: Date
  address?: string
  state?: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  vehicle: {
    type: VehicleType
    plateNumber: string
    color?: string
    model?: string
  }
  currentZoneId?: mongoose.Types.ObjectId
  status: CollectorStatus
  employmentDate: Date
  terminationDate?: Date
  salaryBand?: string
  documents: {
    type: string
    url: string
    publicId: string
  }[]
  rating: {
    average: number
    count: number
  }
  totalCollections: number
  lastActiveAt?: Date
  currentLocation?: {
    type: 'Point'
    coordinates: [number, number] // [lng, lat]
  }
  isLocationSharing: boolean
  createdBy?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const CollectorSchema: Schema = new Schema(
  {
    employeeId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, select: false },
    avatar: {
      url: String,
      publicId: String,
    },
    gender: { type: String, enum: ['MALE', 'FEMALE'] },
    dateOfBirth: Date,
    address: String,
    state: String,
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
    vehicle: {
      type: { type: String, enum: Object.values(VehicleType), required: true },
      plateNumber: { type: String, required: true },
      color: String,
      model: String,
    },
    currentZoneId: { type: Schema.Types.ObjectId, ref: 'Zone', index: true },
    status: {
      type: String,
      enum: Object.values(CollectorStatus),
      default: CollectorStatus.ACTIVE,
      index: true,
    },
    employmentDate: { type: Date, default: Date.now },
    terminationDate: Date,
    salaryBand: String,
    documents: [
      {
        type: { type: String, enum: ['ID_CARD', 'DRIVERS_LICENSE', 'OTHER'] },
        url: String,
        publicId: String,
      },
    ],
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    totalCollections: { type: Number, default: 0 },
    lastActiveAt: Date,
    currentLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
    isLocationSharing: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

CollectorSchema.virtual('fullName').get(function (this: ICollector) {
  return `${this.firstName} ${this.lastName}`
})

CollectorSchema.index({ currentLocation: '2dsphere' })

export const Collector = mongoose.model<ICollector>('Collector', CollectorSchema)
