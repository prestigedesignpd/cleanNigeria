import { Router } from 'express'
import * as CollectorController from './collector.controller'
import { authenticateAdmin } from '@middleware/authenticateAdmin'
import { authorize } from '@middleware/authorize'
import { validateRequest } from '@middleware/validateRequest'
import { uploadSingleImage } from '@middleware/multerUpload'
import { AdminRole } from '@constants/roles.constants'
import * as CollectorValidation from './collector.validation'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Collectors
 *   description: Waste collector management and live tracking
 */

// Basic list/get
router.get('/', CollectorController.getAllCollectors)
router.get('/:id', CollectorController.getCollectorById)

// Admin management
router.use(authenticateAdmin)

router.post(
  '/',
  authorize(AdminRole.ADMIN, AdminRole.OPERATIONS_MANAGER),
  validateRequest(CollectorValidation.createCollectorSchema),
  CollectorController.createCollector
)

router.patch(
  '/:id',
  authorize(AdminRole.ADMIN, AdminRole.OPERATIONS_MANAGER),
  validateRequest(CollectorValidation.updateCollectorSchema),
  CollectorController.updateCollector
)

router.post(
  '/:id/avatar',
  authorize(AdminRole.ADMIN, AdminRole.OPERATIONS_MANAGER),
  uploadSingleImage,
  CollectorController.uploadAvatar
)

router.post(
  '/:id/assign-zone',
  authorize(AdminRole.ADMIN, AdminRole.OPERATIONS_MANAGER),
  validateRequest(CollectorValidation.assignZoneSchema),
  CollectorController.assignZone
)

export default router
