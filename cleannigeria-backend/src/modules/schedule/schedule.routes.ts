import { Router } from 'express'
import * as ScheduleController from './schedule.controller'
import { authenticate } from '@middleware/authenticate'
import { authenticateAdmin } from '@middleware/authenticateAdmin'
import { authorize } from '@middleware/authorize'
import { AdminRole } from '@constants/roles.constants'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Pickup Schedules
 *   description: Waste collection scheduling and task management
 */

// Client
router.get('/my', authenticate, ScheduleController.getMySchedules)
router.get('/:id', authenticate, ScheduleController.getScheduleById)
router.post('/request-extra', authenticate, ScheduleController.requestExtraPickup)

// Collector (authenticated as user or special collector role)
router.get('/collector/:collectorId', ScheduleController.getCollectorTasks)
router.patch('/:id/status', ScheduleController.updatePickupStatus)

// Admin
router.get(
  '/',
  authenticateAdmin,
  ScheduleController.getAllSchedules
)

router.post(
  '/generate',
  authenticateAdmin,
  authorize(AdminRole.ADMIN, AdminRole.OPERATIONS_MANAGER),
  ScheduleController.generateSchedules
)

export default router
