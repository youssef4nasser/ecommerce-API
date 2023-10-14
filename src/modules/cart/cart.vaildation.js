import Joi from "joi";

const idVaildation = Joi.string().hex().length(24).required()

export const validationaAddToCart = Joi.object({
    product: idVaildation,
    quantity: Joi.number().positive()
})

export const validationaupdateQuantity = Joi.object({
    id: idVaildation,
    quantity: Joi.number().positive()
})

export const validationRemoveProduct = Joi.object({
    id: idVaildation,
})

export const validationCoupon = Joi.object({
    code: Joi.string().required()
})