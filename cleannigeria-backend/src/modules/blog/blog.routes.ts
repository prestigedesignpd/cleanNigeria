import { Router } from 'express'
import * as BlogController from './blog.controller'
import { authenticateAdmin } from '@middleware/authenticateAdmin'
import { authorize } from '@middleware/authorize'
import { validateRequest } from '@middleware/validateRequest'
import { uploadSingleImage } from '@middleware/multerUpload'
import { AdminRole } from '@constants/roles.constants'
import * as BlogValidation from './blog.validation'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Marketing content and blog management
 */

// Public routes
router.get('/categories', BlogController.getAllCategories)
router.get('/posts', BlogController.getAllPosts)
router.get('/posts/:slug', BlogController.getPostBySlug)

// Admin routes
router.use(authenticateAdmin)

router.get('/admin/posts', BlogController.getAllPosts)

router.post(
  '/categories',
  authorize(AdminRole.ADMIN),
  validateRequest(BlogValidation.createCategorySchema),
  BlogController.createCategory
)

router.post(
  '/posts',
  authorize(AdminRole.ADMIN, AdminRole.CONTENT_MANAGER),
  validateRequest(BlogValidation.createPostSchema),
  BlogController.createPost
)

router.patch(
  '/posts/:id',
  authorize(AdminRole.ADMIN, AdminRole.CONTENT_MANAGER),
  validateRequest(BlogValidation.updatePostSchema),
  BlogController.updatePost
)

router.post(
  '/posts/:id/featured-image',
  authorize(AdminRole.ADMIN, AdminRole.CONTENT_MANAGER),
  uploadSingleImage,
  BlogController.uploadFeaturedImage
)

router.delete(
  '/posts/:id',
  authorize(AdminRole.ADMIN, AdminRole.CONTENT_MANAGER),
  BlogController.deletePost
)

export default router
