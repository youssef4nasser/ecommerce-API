import Joi from "joi";

const idVaildation = Joi.string().hex().length(24).required()

export const validationAddReview = Joi.object({
    review: Joi.string().required().min(3),
    rating: Joi.number().min(1).max(5).positive().required(),
    product: idVaildation
})

export const validationUpdateReview = Joi.object({
    review: Joi.string().min(3),
    rating: Joi.number().positive().min(1).max(5),
    id: idVaildation
})

export const idValidate = Joi.object({
    id: idVaildation
})