import { Router } from 'express'
import * as NotificationController from './notification.controller'
import { authenticate } from '@middleware/authenticate'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: In-app notifications and alerts
 */

router.use(authenticate)

router.get('/', NotificationController.getMyNotifications)
router.patch('/read-all', NotificationController.markAllAsRead)
router.patch('/:id/read', NotificationController.markAsRead)
router.delete('/:id', NotificationController.deleteNotification)

export default router
