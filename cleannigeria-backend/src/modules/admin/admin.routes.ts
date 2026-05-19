import { Router } from 'express'
import * as AdminController from './admin.controller'
import { authenticateAdmin } from '@middleware/authenticateAdmin'
import { authorize } from '@middleware/authorize'
import { AdminRole } from '@constants/roles.constants'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Admin Management
 *   description: Global system administration and analytics
 */

router.use(authenticateAdmin)
router.use(authorize(AdminRole.ADMIN, AdminRole.SUPER_ADMIN))

router.get('/stats', AdminController.getStats)
router.get('/users', AdminController.getAllUsers)
router.get('/users/:id', AdminController.getUserById)
router.patch('/users/:id/status', AdminController.toggleUserStatus)
router.get('/zone-stats', AdminController.getZoneStats)
router.get('/payments', AdminController.getAllPayments)
router.get('/subscriptions', AdminController.getAllSubscriptions)
router.get('/analytics', AdminController.getFullAnalytics)
router.get('/activity', AdminController.getActivity)
router.get('/collectors', AdminController.getAllCollectors)
router.get('/collectors/:id', AdminController.getCollectorById)
router.get('/verifications', AdminController.getVerificationQueue)
router.patch('/verifications/:id/status', AdminController.updateVerificationStatus)

// Admin team CRUD
router.get('/admins', AdminController.getAllAdmins)
router.post('/admins', AdminController.createAdmin)
router.patch('/admins/:id', AdminController.updateAdmin)
router.delete('/admins/:id', AdminController.deleteAdmin)

export default router
