import { Request, Response, NextFunction } from "express";
import { JwtPayload, sign, SignOptions, verify } from "jsonwebtoken"
import { AppString } from "./common/AppString";

function generateUniqueIdByDateAndString() {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substring(2);
    return timestamp + randomString;
}

function generateRandomCode(length = 4) {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += digits[Math.floor(Math.random() * digits.length)];
    }
    return code;
}

// Generate JWT Token
function generateJwtToken(payload: JwtPayload, type: number) { // type: 1 for access token | 2 for refresh token
    let jwt_secret = type === 1 ? process.env['JWT_ACCESS_SECRET'] as string : process.env['JWT_REFRESH_SECRET'] as string
    let expiresIn = type === 1 ? process.env['JWT_ACCESS_EXPIRES_IN'] as string ?? '1d' : process.env['JWT_REFRESH_EXPIRES_IN'] as string ?? '2d'
    const options: SignOptions = { expiresIn: expiresIn as SignOptions['expiresIn'] }
    return `${type == 1 ? 'JWT_ACCESS_V1' : 'JWT_REFRESH_V1'}${sign(payload, jwt_secret, options)}`
}

// Verify JWT Token
export function verifyJwtToken(token: string, type: number): { id: number } { // type: 1 for access token | 2 for refresh token 
    try {
        let jwt_secret = type === 1 ? process.env['JWT_ACCESS_SECRET'] as string : process.env['JWT_REFRESH_SECRET'] as string
        const decoded = verify(token, jwt_secret as string) as { id: number }
        if (!decoded || !decoded.id) return throwError(AppString.something_went_wrong, 401)
        return decoded
    } catch (error: any) { return throwError(error.message, error?.statusCode) }
}

export async function getTokenInsideReq(req: Request) {
    let token = req.headers['authorization']
    if (!token) return null
    let generatedToken = token.split(' ')[1]
    return generatedToken.split('JWT_ACCESS_V1')[1]
}

export const use = (fn: (req: Request, res: Response, next: NextFunction) => void) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}

// ERROR HANDLER MIDDLEWARE:
export const throwError = (message: string, statusCode?: number) => {
    if (!statusCode) statusCode = 500
    const error = new Error(message);
    (error as any).statusCode = statusCode;
    throw error;
}

export default {
    generateUniqueIdByDateAndString,
    generateRandomCode,
    generateJwtToken
}