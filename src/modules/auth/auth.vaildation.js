import Joi from "joi";

const emailValidation = Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
const passwordValidation = Joi.string().min(6).max(30).required()

export const signUpValidationa = Joi.object({
    name: Joi.string().max(200).required(),
    email: emailValidation,
    password: passwordValidation
})

export const signInValidationa = Joi.object({
    email: emailValidation,
    password: passwordValidation
})

export const VerifyCodeValidationa = Joi.object({
    email: emailValidation,
    newPassword: passwordValidation,
    code: Joi.string().length(6)
})

export const confirmValidation = Joi.object({
    email: emailValidation,
    code: Joi.string().length(6)
})

export const forgetPasswordValidation = Joi.object({
    email: emailValidation,
})

export const signInGoogleValidationa = Joi.object({
    idToken:  Joi.string().required(),
})
