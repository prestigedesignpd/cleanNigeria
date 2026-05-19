import { Router } from 'express'
import * as AdminAuthController from './adminAuth.controller'
import { validateRequest } from '@middleware/validateRequest'
import { authenticateAdmin } from '@middleware/authenticateAdmin'
import { authLimiter } from '@middleware/rateLimiter'
import * as AdminAuthValidation from './adminAuth.validation'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Admin Auth
 *   description: Admin portal authentication
 */

router.post(
  '/login',
  authLimiter,
  validateRequest(AdminAuthValidation.adminLoginSchema),
  AdminAuthController.login
)

router.post(
  '/refresh-token',
  AdminAuthController.refreshToken
)

router.post(
  '/logout',
  AdminAuthController.logout
)

router.post(
  '/forgot-password',
  authLimiter,
  validateRequest(AdminAuthValidation.adminForgotPasswordSchema),
  AdminAuthController.forgotPassword
)

router.post(
  '/reset-password',
  validateRequest(AdminAuthValidation.adminResetPasswordSchema),
  AdminAuthController.resetPassword
)

// Protected
router.get(
  '/me',
  authenticateAdmin,
  AdminAuthController.getMe
)

export default router
