import { Router } from 'express'
import * as ComplaintController from './complaint.controller'
import { authenticate } from '@middleware/authenticate'
import { authenticateAdmin } from '@middleware/authenticateAdmin'
import { authorize } from '@middleware/authorize'
import { validateRequest } from '@middleware/validateRequest'
import { uploadMultipleImages } from '@middleware/multerUpload'
import { AdminRole } from '@constants/roles.constants'
import * as ComplaintValidation from './complaint.validation'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Complaints
 *   description: Support ticket system and resolution tracking
 */

// Shared List/Get (Controller handles filtering based on auth)
router.get('/', authenticate, ComplaintController.getAllComplaints)
router.get('/:id', authenticate, ComplaintController.getComplaintById)

// Client routes
router.post(
  '/',
  authenticate,
  uploadMultipleImages,
  validateRequest(ComplaintValidation.createComplaintSchema),
  ComplaintController.createComplaint
)

router.post(
  '/:id/messages',
  uploadMultipleImages,
  validateRequest(ComplaintValidation.addMessageSchema),
  ComplaintController.addMessage
)

router.post(
  '/:id/rate',
  authenticate,
  validateRequest(ComplaintValidation.rateComplaintSchema),
  ComplaintController.rateResolution
)

// Admin routes
router.patch(
  '/:id/resolve',
  authenticateAdmin,
  authorize(AdminRole.ADMIN, AdminRole.OPERATIONS_MANAGER),
  validateRequest(ComplaintValidation.resolveComplaintSchema),
  ComplaintController.resolveComplaint
)

export default router
