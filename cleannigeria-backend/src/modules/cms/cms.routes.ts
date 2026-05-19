import { Router } from 'express'
import * as CmsController from './cms.controller'
import { authenticateAdmin } from '@middleware/authenticateAdmin'
import { authorize } from '@middleware/authorize'
import { AdminRole } from '@constants/roles.constants'
import { uploadSingleImage } from '@middleware/multerUpload'

const router = Router()

// Public routes
router.get('/:key', CmsController.getContent)

// Admin routes
router.use(authenticateAdmin)
router.post('/upload', authorize(AdminRole.ADMIN, AdminRole.CONTENT_MANAGER), uploadSingleImage, CmsController.uploadImage)
router.patch('/:key', authorize(AdminRole.ADMIN, AdminRole.CONTENT_MANAGER), CmsController.updateContent)

export default router
