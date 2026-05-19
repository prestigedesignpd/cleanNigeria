import { Request, Response } from 'express'
import { BlogPost, BlogCategory } from '@models/index'
import { catchAsync } from '@utils/catchAsync'
import { ApiError } from '@utils/ApiError'
import { ApiResponse } from '@utils/ApiResponse'
import { parsePagination, buildPaginationMeta } from '@utils/pagination'
import { CloudinaryService } from '@services/Cloudinary.service'

// Categories
export const getAllCategories = catchAsync(async (_req: Request, res: Response) => {
  const categories = await BlogCategory.find().sort({ name: 1 })
  return ApiResponse.success(res, categories)
})

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await BlogCategory.create(req.body)
  return ApiResponse.created(res, category)
})

// Posts
export const getAllPosts = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = parsePagination(req.query)
  const filters: any = {}

  if (req.query.status) filters.status = req.query.status
  else if (!req.admin) filters.status = 'PUBLISHED' // Public only sees published

  if (req.query.categoryId) filters.categoryId = req.query.categoryId
  if (req.query.isFeatured) filters.isFeatured = req.query.isFeatured === 'true'
  if (req.query.search) {
    filters.$text = { $search: req.query.search as string }
  }

  const posts = await BlogPost.find(filters)
    .populate('authorId', 'firstName lastName')
    .populate('categoryId', 'name')
    .sort({ publishedAt: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await BlogPost.countDocuments(filters)

  return ApiResponse.paginated(res, posts, buildPaginationMeta(total, page, limit))
})

export const getPostBySlug = catchAsync(async (req: Request, res: Response) => {
  const post = await BlogPost.findOne({ slug: req.params.slug })
    .populate('authorId', 'firstName lastName')
    .populate('categoryId', 'name')

  if (!post) throw ApiError.notFound('Blog post not found')
  
  // Increment view count
  post.viewCount += 1
  await post.save()

  return ApiResponse.success(res, post)
})

export const createPost = catchAsync(async (req: Request, res: Response) => {
  const authorIdStr = req.admin?.id === 'super-admin-id' ? '000000000000000000000000' : req.admin?.id
  const post = await BlogPost.create({
    ...req.body,
    authorId: authorIdStr,
    publishedAt: req.body.status === 'PUBLISHED' ? new Date() : undefined,
  })
  return ApiResponse.created(res, post)
})

export const updatePost = catchAsync(async (req: Request, res: Response) => {
  const post = await BlogPost.findByIdAndUpdate(
    req.params.id,
    { 
        ...req.body,
        publishedAt: req.body.status === 'PUBLISHED' ? new Date() : undefined
    },
    { new: true, runValidators: true }
  )
  if (!post) throw ApiError.notFound('Post not found')
  return ApiResponse.success(res, post)
})

export const uploadFeaturedImage = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest('No image file uploaded')
  const post = await BlogPost.findById(req.params.id)
  if (!post) throw ApiError.notFound('Post not found')

  const result = await CloudinaryService.uploadBuffer(req.file.buffer, 'blog')
  
  if (post.featuredImage?.publicId) {
    await CloudinaryService.deleteImage(post.featuredImage.publicId)
  }

  post.featuredImage = result
  await post.save()

  return ApiResponse.success(res, post.featuredImage, 'Featured image updated')
})

export const deletePost = catchAsync(async (req: Request, res: Response) => {
  const post = await BlogPost.findById(req.params.id)
  if (!post) throw ApiError.notFound('Post not found')

  if (post.featuredImage?.publicId) {
    await CloudinaryService.deleteImage(post.featuredImage.publicId)
  }

  await BlogPost.findByIdAndDelete(req.params.id)
  return ApiResponse.success(res, null, 'Post deleted successfully')
})
