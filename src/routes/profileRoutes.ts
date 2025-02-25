import express, { Router } from 'express'
import { use } from "../utils/commonUtils"
import { jwtAuth } from "../middlewares/jwtAuth"
import profileController from "../controllers/profile.controller"

const router: Router = express.Router()

router.post('/update-doctor', use(jwtAuth([3])), use(profileController.updateDoctorProfile))

export default router