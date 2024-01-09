import Joi from "joi";

const idVaildation = Joi.string().hex().length(24).required()

export const validationaAddUser = Joi.object({
    name: Joi.string().max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required()
})

export const validationUpdateUser = Joi.object({
    id: idVaildation,
    role: Joi.string().valid('admin', 'user'),
    isActive: Joi.boolean(),
    isVerified: Joi.boolean(),
    blocked: Joi.boolean(),
});


export const idVaildationSchema = Joi.object({
    id: idVaildation
})
