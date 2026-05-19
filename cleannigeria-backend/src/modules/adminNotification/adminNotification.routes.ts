import { Router } from 'express'
import * as AdminNotificationController from './adminNotification.controller'
import { authenticateAdmin } from '@middleware/authenticateAdmin'

const router = Router()

router.use(authenticateAdmin)

router.get('/', AdminNotificationController.getAdminNotifications)
router.patch('/read-all', AdminNotificationController.markAllAsRead)
router.patch('/:id/read', AdminNotificationController.markAsRead)
router.delete('/:id', AdminNotificationController.deleteNotification)
router.post('/broadcast', AdminNotificationController.createBroadcast)

export default router
