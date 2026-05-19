import { Router } from 'express'
import * as BusinessController from './business.controller'
import { authenticate } from '@middleware/authenticate'
import { authenticateAdmin } from '@middleware/authenticateAdmin'
import { authorize } from '@middleware/authorize'
import { validateRequest } from '@middleware/validateRequest'
import { uploadSingleDocument, uploadSingleImage } from '@middleware/multerUpload'
import { AdminRole } from '@constants/roles.constants'
import * as BusinessValidation from './business.validation'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Businesses
 *   description: Commercial client management and document verification
 */

// User-specific routes
router.get('/my', authenticate, BusinessController.getMyBusinesses)

// Generic list/get
router.get('/', BusinessController.getAllBusinesses)
router.get('/:id', BusinessController.getBusinessById)

// Admin management
router.use(authenticateAdmin)

router.post(
  '/',
  authorize(AdminRole.ADMIN, AdminRole.OPERATIONS_MANAGER),
  validateRequest(BusinessValidation.createBusinessSchema),
  BusinessController.createBusiness
)

router.patch(
  '/:id',
  authorize(AdminRole.ADMIN, AdminRole.OPERATIONS_MANAGER),
  validateRequest(BusinessValidation.updateBusinessSchema),
  BusinessController.updateBusiness
)

router.post(
  '/:id/logo',
  authorize(AdminRole.ADMIN, AdminRole.OPERATIONS_MANAGER),
  uploadSingleImage,
  BusinessController.updateLogo
)

router.post(
  '/:id/documents',
  authorize(AdminRole.ADMIN, AdminRole.OPERATIONS_MANAGER),
  uploadSingleDocument,
  validateRequest(BusinessValidation.addDocumentSchema),
  BusinessController.uploadDocument
)

export default router
