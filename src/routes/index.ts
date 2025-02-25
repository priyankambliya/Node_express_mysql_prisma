import express, { Router, Request, Response } from 'express'

import authRoutes from './authRoutes'
import profileRoutes from './profileRoutes'
import hospitalRoutes from './hospitalRoutes'

const router: Router = express.Router()

router.get('/ping', (req: Request, res: Response): any => res.send('pong'))
router.use('/auth', authRoutes)

router.use('/hospital', hospitalRoutes)
router.use('/profile', profileRoutes)

export default router