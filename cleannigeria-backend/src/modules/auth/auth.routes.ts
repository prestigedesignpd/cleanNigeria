import { Router } from 'express'
import * as AuthController from './auth.controller'
import { validateRequest } from '@middleware/validateRequest'
import { authenticate } from '@middleware/authenticate'
import { authLimiter, otpLimiter } from '@middleware/rateLimiter'
import * as AuthValidation from './auth.validation'
import { googleLogin } from './googleAuth.controller'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Client authentication and account management
 */

router.post(
  '/register',
  authLimiter,
  validateRequest(AuthValidation.registerSchema),
  AuthController.register
)

router.post(
  '/login',
  authLimiter,
  validateRequest(AuthValidation.loginSchema),
  AuthController.login
)

router.post(
  '/google',
  authLimiter,
  googleLogin
)

router.post(
  '/verify-email',
  otpLimiter,
  validateRequest(AuthValidation.verifyOtpSchema),
  AuthController.verifyEmail
)

router.post(
  '/resend-otp',
  otpLimiter,
  validateRequest(AuthValidation.resendOtpSchema),
  AuthController.resendOtp
)

router.post(
  '/refresh-token',
  AuthController.refreshToken
)

router.post(
  '/logout',
  AuthController.logout
)

router.post(
  '/forgot-password',
  authLimiter,
  validateRequest(AuthValidation.forgotPasswordSchema),
  AuthController.forgotPassword
)

router.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPasswordSchema),
  AuthController.resetPassword
)

// Protected routes
router.get(
  '/me',
  authenticate,
  AuthController.getMe
)

router.patch(
  '/change-password',
  authenticate,
  validateRequest(AuthValidation.changePasswordSchema),
  AuthController.changePassword
)

export default router
