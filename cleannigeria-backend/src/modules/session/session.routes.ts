import { Router } from 'express'
import { getSessions, revokeSession } from './session.controller'
import { authenticate } from '@middleware/authenticate'

const router = Router()

// All session routes require authentication
router.use(authenticate)

router.get('/', getSessions)
router.delete('/:sessionId', revokeSession)

export default router
