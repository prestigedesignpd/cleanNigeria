import mongoose, { Schema, Document } from 'mongoose'

export interface ICms extends Document {
  key: string
  content: any
}

const CmsSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    content: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
)

export const Cms = mongoose.model<ICms>('Cms', CmsSchema)
