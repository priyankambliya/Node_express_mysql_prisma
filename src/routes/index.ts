import express, { Router } from 'express'

import authRoutes from './authRoutes'

const router: Router = express.Router()

router.use('/auth', authRoutes)
// router.use('/profile', profileRoutes)

export default router