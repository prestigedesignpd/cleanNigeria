import mongoose, { Schema, Document } from 'mongoose'
import slugify from 'slugify'

export interface IBlogCategory extends Document {
  name: string
  slug: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const BlogCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: String,
  },
  { timestamps: true }
)

BlogCategorySchema.pre('save', async function (this: IBlogCategory) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true })
  }
})

export const BlogCategory = mongoose.model<IBlogCategory>('BlogCategory', BlogCategorySchema)
