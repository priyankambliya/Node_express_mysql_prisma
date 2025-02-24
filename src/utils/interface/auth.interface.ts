export interface RegisterRequestPayload {
    type: number // 1 -> Mobile 2 -> Email
    role: number // 1 -> super admin 2 -> sub Admin 3 -> doctor 4 -> patient
    email?: string
    mobile?: string
    password?: string
}

export interface VerifyCodeRequestPayload {
    token: string
    code: string
}

export interface LoginRequestPayload {
    type: number // 1 -> Mobile 2 -> Email
    email?: string
    mobile?: string
    password: string
}