import express, { Router, Request, Response, NextFunction } from 'express'
import { use } from "../utils/commonUtils"
import authController from "../controllers/auth.controller"
import { jwtAuth } from "../middlewares/jwtAuth"
import schemaValidator from "../middlewares/schemaValidator"

const router: Router = express.Router()

router.post('/register', schemaValidator('registerValidation'), use(authController.register))
router.post('/verify-code', use(authController.verifyCode))

router.post('/manually-login', use(authController.login))
router.post('/admin-login', schemaValidator('adminLoginValidation'), use(authController.adminLogin))

router.post('/logout', use(jwtAuth([1, 2, 3])), use(authController.logout))

export default router