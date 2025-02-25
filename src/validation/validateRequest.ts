import { ObjectSchema } from "joi"

import authValidation from "./auth.validation"

export default {
    "registerValidation": authValidation.registerValidation,
    "adminLoginValidation": authValidation.adminLoginValidation
} as { [key: string]: ObjectSchema }