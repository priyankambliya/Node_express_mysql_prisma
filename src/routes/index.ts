import express, { Router, Request, Response } from 'express'

import authRoutes from './authRoutes'

const router: Router = express.Router()

router.get('/ping', (req: Request, res: Response): any => res.send('pong'))
router.use('/auth', authRoutes)
// router.use('/profile', profileRoutes)

export default router