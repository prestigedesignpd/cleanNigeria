import { Router } from 'express'
import * as EstateController from './estate.controller'
import { authenticateAdmin } from '@middleware/authenticateAdmin'
import { authorize } from '@middleware/authorize'
import { validateRequest } from '@middleware/validateRequest'
import { uploadSingleImage } from '@middleware/multerUpload'
import { AdminRole } from '@constants/roles.constants'
import * as EstateValidation from './estate.validation'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Estates
 *   description: Estate community management and unit tracking
 */

// Basic list/get
router.get('/', EstateController.getAllEstates)
router.get('/:id', EstateController.getEstateById)
router.get('/:id/units', EstateController.getUnits)

// Admin management
router.use(authenticateAdmin)

router.post(
  '/',
  authorize(AdminRole.ADMIN, AdminRole.OPERATIONS_MANAGER),
  validateRequest(EstateValidation.createEstateSchema),
  EstateController.createEstate
)

router.patch(
  '/:id',
  authorize(AdminRole.ADMIN, AdminRole.OPERATIONS_MANAGER),
  validateRequest(EstateValidation.updateEstateSchema),
  EstateController.updateEstate
)

router.post(
  '/:id/logo',
  authorize(AdminRole.ADMIN, AdminRole.OPERATIONS_MANAGER),
  uploadSingleImage,
  EstateController.updateLogo
)

router.post(
  '/:id/units',
  authorize(AdminRole.ADMIN, AdminRole.OPERATIONS_MANAGER),
  validateRequest(EstateValidation.addUnitSchema),
  EstateController.addUnit
)

router.post(
  '/:id/units/bulk',
  authorize(AdminRole.ADMIN, AdminRole.OPERATIONS_MANAGER),
  EstateController.bulkAddUnits
)

export default router
