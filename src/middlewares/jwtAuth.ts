import { NextFunction, Request, Response } from "express"
import { prisma } from "../database/connection"
import { AppString } from "../utils/common/AppString"
import { getTokenInsideReq, throwError, verifyJwtToken } from "../utils/commonUtils"

export const jwtAuth = (role: number[]) => async (req: Request, res: Response, next: NextFunction) => {
    let token = await getTokenInsideReq(req)
    if (!token) return throwError(AppString.something_went_wrong, 401)

    // Check if token is valid or not
    let decodedToken = verifyJwtToken(token, 1)

    // If valid, then set user info in req.user
    let user = await prisma.user.findUnique({
        where: { id: decodedToken['id'] }, select: {
            id: true, name: true, email: true, mobile: true, registeredWith: true, role: true
        }
    })
    if (!user) return throwError(AppString.something_went_wrong, 401)

    // Check for user role
    let isValidRole = role.includes(user.role)
    if (!isValidRole) return throwError(AppString.something_went_wrong, 401)

    req.user = user
    next()
}

// ---------------------------- PRIVATE HELPER FUNCTION ---------------------------- //

