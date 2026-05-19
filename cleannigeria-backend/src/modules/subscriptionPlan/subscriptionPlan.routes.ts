import { Router } from 'express'
import * as PlanController from './subscriptionPlan.controller'
import { authenticateAdmin } from '@middleware/authenticateAdmin'
import { authorize } from '@middleware/authorize'
import { validateRequest } from '@middleware/validateRequest'
import { AdminRole } from '@constants/roles.constants'
import * as PlanValidation from './subscriptionPlan.validation'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Subscription Plans
 *   description: Plan catalogue and pricing management
 */

// Public
router.get('/', PlanController.getAllPlans)
router.get('/:id', PlanController.getPlanById)

// Admin
router.use(authenticateAdmin)

router.post(
  '/',
  authorize(AdminRole.ADMIN),
  validateRequest(PlanValidation.createPlanSchema),
  PlanController.createPlan
)

router.patch(
  '/:id',
  authorize(AdminRole.ADMIN),
  validateRequest(PlanValidation.updatePlanSchema),
  PlanController.updatePlan
)

router.delete(
  '/:id',
  authorize(AdminRole.ADMIN),
  PlanController.deletePlan
)

export default router
