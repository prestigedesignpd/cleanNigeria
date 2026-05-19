import mongoose, { Schema, Document } from 'mongoose'

export interface ISystemSetting extends Document {
  key: string
  value: any
  description?: string
  updatedBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const SystemSettingSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    value: { type: Schema.Types.Mixed, required: true },
    description: String,
    updatedBy: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
  },
  { timestamps: true }
)

export const SystemSetting = mongoose.model<ISystemSetting>('SystemSetting', SystemSettingSchema)
