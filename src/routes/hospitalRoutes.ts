import express, { Router } from 'express'

import hospitalController from "../controllers/hospital.controller"
import { jwtAuth } from "../middlewares/jwtAuth"
import { use } from "../utils/commonUtils"

const router: Router = express.Router()

router.get('/', use(jwtAuth([1, 2, 3])), use(hospitalController.getHospital))
router.post('/', use(jwtAuth([1, 2])), use(hospitalController.createHospital))
router.put('/:hospitalId', use(jwtAuth([1, 2])), use(hospitalController.editHospital))
router.patch('/:hospitalId', use(jwtAuth([1, 2])), use(hospitalController.deleteHospital))

export default router