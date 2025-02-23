import express, { Router, Request, Response, NextFunction } from 'express'
import { use } from "../utils/commonUtils"
import authController from "../controllers/auth.controller"
import { jwtAuth } from "../middlewares/jwtAuth"

const router: Router = express.Router()

router.post('/register', use(authController.register))
router.post('/verify-code', use(authController.verifyCode))

router.post('/manually-login', use(authController.login))
router.post('/qr-login')

router.post('/logout', use(jwtAuth), use(authController.logout))

export default router