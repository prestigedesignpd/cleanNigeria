import mongoose, { Schema, Document } from 'mongoose'

export interface IWaitlistEntry extends Document {
  email: string
  fullName?: string
  phone?: string
  state?: string
  lga?: string
  accountType?: 'ESTATE' | 'BUSINESS' | 'INDIVIDUAL'
  isConverted: boolean
  convertedUserId?: mongoose.Types.ObjectId
  createdAt: Date
}

const WaitlistEntrySchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: String,
    phone: String,
    state: String,
    lga: String,
    accountType: { type: String, enum: ['ESTATE', 'BUSINESS', 'INDIVIDUAL'] },
    isConverted: { type: Boolean, default: false },
    convertedUserId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, updatedAt: false }
)

export const WaitlistEntry = mongoose.model<IWaitlistEntry>('WaitlistEntry', WaitlistEntrySchema)
