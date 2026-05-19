import { Router } from 'express'
import * as InvoiceController from './invoice.controller'
import { authenticate } from '@middleware/authenticate'

const router = Router()

router.use(authenticate)

router.get('/', InvoiceController.getInvoices)
router.get('/:id', InvoiceController.getInvoiceById)

export default router
