import { Router } from 'express'
import * as ZoneController from './zone.controller'
import { authenticateAdmin } from '@middleware/authenticateAdmin'
import { authorize } from '@middleware/authorize'
import { validateRequest } from '@middleware/validateRequest'
import { AdminRole } from '@constants/roles.constants'
import * as ZoneValidation from './zone.validation'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Zones
 *   description: Service zone management and coverage checks
 */

// Public routes
router.get('/', ZoneController.getAllZones)
router.get('/:id', ZoneController.getZoneById)
router.post(
  '/check-coverage',
  validateRequest(ZoneValidation.checkCoverageSchema),
  ZoneController.checkCoverage
)

// Admin routes
router.use(authenticateAdmin)

router.post(
  '/',
  authorize(AdminRole.ADMIN),
  validateRequest(ZoneValidation.createZoneSchema),
  ZoneController.createZone
)

router.patch(
  '/:id',
  authorize(AdminRole.ADMIN),
  validateRequest(ZoneValidation.updateZoneSchema),
  ZoneController.updateZone
)

export default router
