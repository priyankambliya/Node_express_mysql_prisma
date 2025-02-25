import { Request, Response } from "express";

import { prisma } from "../database/connection";
import { AppString } from "../utils/common/AppString";
import { throwError } from "../utils/commonUtils";
import { successResponseHandler } from "../utils/handler";

interface HospitalIdInterface {
    hospitalId: number
}

// UPDATE DOCTOR PROFILE API //
const updateDoctorProfile = async (req: Request, res: Response) => {
    let { hospitalId } = <HospitalIdInterface>req.body
    let { id } = req.user

    let isAlreadyDoctor = await prisma.user.findFirst({
        where: { id, hospitalId }
    })
    if (isAlreadyDoctor?.id) return throwError(AppString.already_exist_in_hospital, 409)
    let doctorData = await prisma.user.update({
        where: { id },
        data: {
            hospitalId
        }
    })
    if (!doctorData?.id) return throwError(AppString.something_went_wrong, 400)
    return res.json(successResponseHandler(AppString.doctor_updated, doctorData))
}

export default {
    updateDoctorProfile
}