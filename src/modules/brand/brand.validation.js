import Joi from "joi";

export const addBrandValidaion = Joi.object({
    name: Joi.string().min(2).required(),
    file: Joi.required()
});

export const headers = Joi.object({
    token: Joi.string().required()
})

export const updateBrandValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
    name: Joi.string().min(2),
    file: Joi.optional(),
})

export const idValidate = Joi.object({
    id: Joi.string().hex().length(24).required(),
})