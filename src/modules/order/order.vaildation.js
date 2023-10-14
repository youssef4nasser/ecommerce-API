import Joi from "joi";

const idVaildation = Joi.string().hex().length(24).required()

export const validationaAddToWishlist = Joi.object({
    product: idVaildation
})

export const validationaRemoveFromWishlist = Joi.object({
    product: idVaildation
})