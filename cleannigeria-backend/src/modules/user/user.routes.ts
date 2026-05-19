import { Router } from 'express'
import * as UserController from './user.controller'
import { authenticate } from '@middleware/authenticate'
import { validateRequest } from '@middleware/validateRequest'
import { uploadSingleImage } from '@middleware/multerUpload'
import * as UserValidation from './user.validation'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile and settings
 */

router.use(authenticate)

router.get('/profile', UserController.getProfile)

router.patch(
  '/profile',
  validateRequest(UserValidation.updateProfileSchema),
  UserController.updateProfile
)

router.post(
  '/avatar',
  uploadSingleImage,
  UserController.updateAvatar
)

router.post(
  '/onboarding/complete',
  validateRequest(UserValidation.onboardingSchema),
  UserController.completeOnboarding
)

router.post(
  '/push-tokens',
  validateRequest(UserValidation.pushTokenSchema),
  UserController.addPushToken
)

router.delete(
  '/push-tokens',
  validateRequest(UserValidation.pushTokenSchema),
  UserController.removePushToken
)

export default router
