import Joi from "joi";

const PASSWORD_REGEX = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
);

const registerValidationSchema = Joi.object({
    type: Joi.alternatives().try(Joi.string().valid('1', '2'), Joi.number().valid(1, 2)).required(),
    role: Joi.alternatives().try(Joi.string().valid('1', '2', '3', '4'), Joi.number().valid(1, 2, 3, 4)).required(),
    mobile: Joi.string().when('type', {
        is: Joi.alternatives().try('1', 1),
        then: Joi.required(),
        otherwise: Joi.optional()
    }),
    email: Joi.string().email().when('type', {
        is: Joi.alternatives().try('2', 2),
        then: Joi.required(),
        otherwise: Joi.optional()
    }),
    password: Joi.string().pattern(PASSWORD_REGEX).min(8).required()
        .messages({
            'string.pattern.base': 'password is too easy. It must contain at least one letter and one number.',
            'string.min': 'password should be at least 8 characters long.',
            'string.empty': 'password is required.'
        })
})

const adminLoginValidationSchema = Joi.object({
    email: Joi.string().email()
        .messages({
            'string.email': 'email is not valid.',
            'string.empty': 'email is required.'
        }),
    password: Joi.string().pattern(PASSWORD_REGEX).min(8).required()
        .messages({
            'string.pattern.base': 'password is too easy. It must contain at least one letter and one number.',
            'string.min': 'password should be at least 8 characters long.',
            'string.empty': 'password is required.'
        })
})

export default {
    registerValidation: registerValidationSchema,
    adminLoginValidation: adminLoginValidationSchema
}