import mongoose, { Schema, Document } from 'mongoose'
import slugify from 'slugify'

export interface IBlogPost extends Document {
  title: string
  slug: string
  content: string
  excerpt?: string
  authorId: mongoose.Types.ObjectId
  categoryId: mongoose.Types.ObjectId
  featuredImage?: { url: string; publicId: string }
  tags: string[]
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  isFeatured: boolean
  viewCount: number
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const BlogPostSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    content: { type: String, required: true },
    excerpt: String,
    authorId: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'BlogCategory', required: true, index: true },
    featuredImage: {
      url: String,
      publicId: String,
    },
    tags: [{ type: String }],
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
      index: true,
    },
    isFeatured: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
    publishedAt: Date,
  },
  { timestamps: true }
)

BlogPostSchema.pre('save', async function (this: IBlogPost) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
})

BlogPostSchema.index({ title: 'text', content: 'text' })

export const BlogPost = mongoose.model<IBlogPost>('BlogPost', BlogPostSchema)
