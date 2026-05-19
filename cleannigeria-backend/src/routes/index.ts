import { Router } from 'express'

const router = Router()

/**
 * All API routes are mounted here under /api/v1
 * Modules are added progressively as they are built.
 * ---
 * Auth
 *   POST /auth/*            → client auth
 *   POST /admin/auth/*      → admin auth
 *
 * Client
 *   /users, /estates, /businesses, /zones
 *   /plans, /subscriptions, /payments, /paystack
 *   /invoices, /schedules, /collection-logs
 *   /complaints, /notifications, /referrals
 *   /support, /tracking, /uploads, /blog
 *
 * Admin
 *   /admin/users, /admin/collectors
 *   /admin/refunds, /admin/analytics, /admin/reports
 *   /admin/settings, /admin/audit-logs
 *   /admin/blog, /admin/cms, /admin/notification-templates
 */

// ─── Modules ───────────────────────────────────────────────────────────────
import authRoutes from '@modules/auth/auth.routes'
import adminAuthRoutes from '@modules/adminAuth/adminAuth.routes'
import userRoutes from '@modules/user/user.routes'
import zoneRoutes from '@modules/zone/zone.routes'
import estateRoutes from '@modules/estate/estate.routes'
import businessRoutes from '@modules/business/business.routes'
import collectorRoutes from '@modules/collector/collector.routes'
import planRoutes from '@modules/subscriptionPlan/subscriptionPlan.routes'
import subscriptionRoutes from '@modules/subscription/subscription.routes'
import complaintRoutes from '@modules/complaint/complaint.routes'
import notificationRoutes from '@modules/notification/notification.routes'
import blogRoutes from '@modules/blog/blog.routes'
import adminRoutes from '@modules/admin/admin.routes'
import adminNotificationRoutes from '@modules/adminNotification/adminNotification.routes'
import scheduleRoutes from '@modules/schedule/schedule.routes'
import paymentRoutes from '@modules/payment/payment.routes'
import invoiceRoutes from '@modules/invoice/invoice.routes'
import cmsRoutes from '@modules/cms/cms.routes'
import sessionRoutes from '@modules/session/session.routes'
router.use('/auth', authRoutes)
router.use('/admin/auth', adminAuthRoutes)
router.use('/admin/management', adminRoutes)
router.use('/admin/notifications', adminNotificationRoutes)
router.use('/users', userRoutes)
router.use('/zones', zoneRoutes)
router.use('/estates', estateRoutes)
router.use('/businesses', businessRoutes)
router.use('/collectors', collectorRoutes)
router.use('/plans', planRoutes)
router.use('/subscriptions', subscriptionRoutes)
router.use('/complaints', complaintRoutes)
router.use('/notifications', notificationRoutes)
router.use('/blog', blogRoutes)
router.use('/schedules', scheduleRoutes)
router.use('/payments', paymentRoutes)
router.use('/invoices', invoiceRoutes)
router.use('/cms', cmsRoutes)
router.use('/sessions', sessionRoutes)
export default router
