import Joi from "joi";

export const addCouponValidaion = Joi.object({
    code: Joi.string().min(2).max(25).required(),
    discount: Joi.number().positive().min(1).max(100).required(),
    expire: Joi.date().greater(Date.now() - 24 * 60 * 60 * 1000).required()
});

export const updateCouponValidation = Joi.object({
    code: Joi.string().min(2).max(25),
    discount: Joi.number().positive().min(1).max(100),
    expire: Joi.date().greater(Date.now() - 24 * 60 * 60 * 1000).required()
})

export const idValidate = Joi.object({
    id: Joi.string().hex().length(24).required(),
})