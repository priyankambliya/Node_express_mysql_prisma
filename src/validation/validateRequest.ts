import { ObjectSchema } from "joi"

import authValidation from "./auth.validation"

export default {
    "registerValidation": authValidation.registerValidation,
} as { [key: string]: ObjectSchema }