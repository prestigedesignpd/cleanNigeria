import { Router } from 'express'
import * as PaymentController from './payment.controller'
import { authenticate } from '@middleware/authenticate'

const router = Router()

router.use(authenticate)

router.get('/cards', PaymentController.getCards)
router.delete('/cards/:last4', PaymentController.removeCard)

router.get('/', PaymentController.getPayments)
router.get('/:id', PaymentController.getPaymentById)

export default router
