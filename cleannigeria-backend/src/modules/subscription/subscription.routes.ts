import { Router } from 'express'
import * as SubscriptionController from './subscription.controller'
import { authenticate } from '@middleware/authenticate'
import { validateRequest } from '@middleware/validateRequest'
import * as SubscriptionValidation from './subscription.validation'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: User subscription management and billing
 */

router.use(authenticate)

router.get('/my', SubscriptionController.getMySubscriptions)
router.get('/:id', SubscriptionController.getSubscriptionById)

router.post(
  '/checkout',
  validateRequest(SubscriptionValidation.checkoutSchema),
  SubscriptionController.checkout
)

router.post(
  '/verify',
  validateRequest(SubscriptionValidation.verifySubscriptionSchema),
  SubscriptionController.verifySubscription
)

router.post('/change-plan', SubscriptionController.changePlan)
router.post('/cancel', SubscriptionController.cancelSubscription)
router.post('/reactivate', SubscriptionController.reactivateSubscription)

export default router
