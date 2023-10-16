import Joi from "joi";

const idVaildation = Joi.string().hex().length(24).required()

export const validationashippingAddres = Joi.object({
    shippingAddres: {
        city: Joi.string().required(),
        street: Joi.string().required(),
        phone: Joi.string().required(),
    }
})

export const validationaRemoveFromWishlist = Joi.object({
    product: idVaildation
})