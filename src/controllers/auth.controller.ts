import { Request, Response } from "express";

import { prisma } from "../database/connection";
import { AppString } from "../utils/common/AppString";
import commonUtils, { findAlreadyExist, throwError } from "../utils/commonUtils";
import { successResponseHandler } from "../utils/handler";
import { LoginRequestPayload, RegisterRequestPayload, VerifyCodeRequestPayload } from "../utils/interface/auth.interface";
import redisClient from "../utils/redisHelper";


interface RedisDataPayloadInterface {
    type: number
    role: number
    mobile: string
    password: string
    email: string
    code: string
}

// REGISTER API //
const register = async (req: Request, res: Response) => {
    let { type, role, mobile, email, password } = <RegisterRequestPayload>req.body

    let filter = type == 1 ? { mobile } : { email }
    let isAlreadyUserWithSameCredential = await findAlreadyExist("user", filter)
    if (isAlreadyUserWithSameCredential.id) return throwError(AppString.account_already_exist_with_given_cred, 409)

    let redisDataPayload: RedisDataPayloadInterface = {
        type: +type,
        role: +role,
        password: password!,
        mobile: type === 1 ? mobile as string : '',
        email: type === 2 ? email as string : '',
        code: commonUtils.generateRandomCode()
    }
    let responseData: { code?: string, token?: string, info: string } = {
        code: redisDataPayload.code,
        info: `You need to verify your ${type === 1 ? 'mobile' : 'email'} in next 15 minutes`
    }

    switch (type) {
        case 1:
        case 2:
            let token = commonUtils.generateUniqueIdByDateAndString()
            _helper_saveDataInRedis(redisDataPayload, token)
            responseData.token = token
    }
    return res.json(successResponseHandler(AppString.code_sent, responseData))
}

// VERIFY OTP/CODE API //
const verifyCode = async (req: Request, res: Response) => {
    let { token, code } = <VerifyCodeRequestPayload>req.body

    let isDataExistWithToken = await redisClient.get(token)
    if (!isDataExistWithToken) return throwError(AppString.something_went_wrong, 422)
    let redisDataPayload: RedisDataPayloadInterface = JSON.parse(isDataExistWithToken)
    if (redisDataPayload.code !== code) return throwError(AppString.invalid_otp, 400)

    let user = await prisma.user.create({
        data: {
            email: redisDataPayload.email,
            mobile: redisDataPayload.mobile,
            password: redisDataPayload.password,
            registeredWith: redisDataPayload.type
        }
    })

    let generateTokenByData: any = { id: user.id }
    if (redisDataPayload.type === 1) generateTokenByData['mobile'] = user.mobile
    if (redisDataPayload.type === 2) generateTokenByData['email'] = user.email

    let accessToken = commonUtils.generateJwtToken(generateTokenByData, 1)
    let refreshToken = commonUtils.generateJwtToken(generateTokenByData, 2)

    await redisClient.setex(
        `token:${accessToken}`,
        60 * 60 * 24, // 1 day
        JSON.stringify({ userId: user.id, refreshToken })
    )

    await redisClient.del(token)
    return res.status(201).json(successResponseHandler(AppString.user_registered, { accessToken, refreshToken }))
}

// LOGIN API //
const login = async (req: Request, res: Response) => {
    let { type, email, mobile, password } = <LoginRequestPayload>req.body

    let filter: any = {}
    if (type === 1) filter['mobile'] = mobile
    if (type === 2) filter['email'] = email

    const user = await prisma.user.findFirst({
        where: filter
    })
    if (!user?.id) return throwError(AppString.something_went_wrong, 422)

    if (user.password !== password) return throwError(AppString.invalid_password, 400)

    let generateTokenByData: any = { id: user.id }
    let accessToken = commonUtils.generateJwtToken(generateTokenByData, 1)
    let refreshToken = commonUtils.generateJwtToken(generateTokenByData, 2)

    await redisClient.setex(
        `token:${accessToken}`,
        60 * 60 * 24, // 1 day
        JSON.stringify({ userId: user.id, refreshToken })
    )

    return res.json(successResponseHandler(AppString.user_logged_in, { accessToken, refreshToken }))
}

// Logout API //
const logout = async (req: Request, res: Response) => {
    let accessToken = req.headers['authorization']?.split(' ')[1]

    let tokenData = await redisClient.get(`token:${accessToken}`)
    if (!tokenData) return throwError(AppString.something_went_wrong, 401)

    // Remove the token
    await redisClient.del(`token:${accessToken}`);

    return res.json(successResponseHandler(AppString.user_logged_out))
}

// ---------------------------- PRIVATE HELPER FUNCTION ---------------------------- //

async function _helper_saveDataInRedis(redisDataPayload: RedisDataPayloadInterface, token: string) {
    await redisClient.set(token, JSON.stringify(redisDataPayload), 'EX', 60 * 15) // 15 minutes
}

export default {
    register,
    verifyCode,

    login,
    logout
}