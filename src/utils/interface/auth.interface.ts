export interface RegisterRequestPayload {
    type: number // 1 -> Mobile 2 -> Email
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