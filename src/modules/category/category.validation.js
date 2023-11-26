import Joi from "joi";

export const addCategoryValidaion = Joi.object({
    name: Joi.string().min(2).required(),
    file: Joi.required().label('image')
});

export const updateCategoryValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
    name: Joi.string().min(2),
    file: Joi.optional(),
})

export const idValidate = Joi.object({
    id: Joi.string().hex().length(24).required(),
})