import Joi from "joi";

const idVaildation = Joi.string().hex().length(24).required()

export const validationaAddToAddress = Joi.object({
    city: Joi.string().max(100).required(),
    phone: Joi.string().max(100).required(),
    street: Joi.string().max(100).required()
})

export const validationaRemoveAddress = Joi.object({
    address: idVaildation
})