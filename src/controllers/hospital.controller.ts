import { Request, Response } from "express";
import { successResponseHandler } from "../utils/handler";
import { AppString } from "../utils/common/AppString";
import { prisma } from "../database/connection";
import { CreateHospitalBodyPayload } from "../utils/interface/hospital.interface";
import { throwError } from "../utils/commonUtils";

interface GetHospitalQueryPayload {
    hospitalId?: number
}

// GET HOSPITAL API //
const getHospital = async (req: Request, res: Response) => {
    let { hospitalId } = <GetHospitalQueryPayload>req.query
    let hospitalData

    if (!hospitalId) {
        hospitalData = await prisma.hospital.findMany({ include: { doctors: true } })
    } else {
        hospitalData = await prisma.hospital.findUnique({ where: { id: hospitalId }, include: { doctors: true } })
    }

    return res.json(successResponseHandler(AppString.hospital_fetched, hospitalData))
}

// CREATE HOSPITAL API //
const createHospital = async (req: Request, res: Response) => {
    const { name, contact, location } = <CreateHospitalBodyPayload>req.body
    let hospitalData = await prisma.hospital.create({
        data: {
            name,
            contact,
            location
        },
        include: { doctors: true }
    })
    if (!hospitalData.id) return throwError(AppString.something_went_wrong, 400)

    return res.json(successResponseHandler(AppString.hospital_created, hospitalData))
}

// EDIT HOSPITAL API //
const editHospital = async (req: Request, res: Response) => {
    const { name, contact, location } = <CreateHospitalBodyPayload>req.body
    let { hospitalId } = <GetHospitalQueryPayload>req.params

    let hospitalData = await prisma.hospital.update({
        where: { id: +hospitalId! },
        data: {
            name,
            contact,
            location
        },
        include: { doctors: true }
    })
    if (!hospitalData.id) return throwError(AppString.something_went_wrong, 400)

    return res.json(successResponseHandler(AppString.hospital_updated, hospitalData))
}

// DELETE HOSPITAL API //
const deleteHospital = async (req: Request, res: Response) => {
    let { hospitalId } = <GetHospitalQueryPayload>req.params

    let hospitalData = await prisma.hospital.findFirst({ where: { id: +hospitalId! }, select: { id: true, isDeleted: true } })
    if (!hospitalData?.id) return throwError(AppString.hospital_not_found, 400)

    let status = hospitalData.isDeleted == 1 ? 0 : 1

    await prisma.hospital.update({
        where: { id: +hospitalId! },
        data: {
            isDeleted: status
        },
        include: { doctors: true }
    })
    if (!hospitalData.id) return throwError(AppString.something_went_wrong, 400)

    let message = status == 1 ? AppString.hospital_deleted : AppString.hospital_re_get
    return res.json(successResponseHandler(message))
}

// ---------------------------- PRIVATE HELPER FUNCTION ---------------------------- //

export default {
    getHospital,
    createHospital,
    editHospital,
    deleteHospital
}