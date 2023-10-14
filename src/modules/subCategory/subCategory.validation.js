import Joi from "joi";

const idVaildation = Joi.string().hex().length(24).required()

export const addSubcategorySchema = Joi.object({
    name: Joi.string().max(250).required(),
    category: idVaildation
})

export const updateSubCategorySchema = Joi.object({
    name: Joi.string().max(100).required(),
    category: Joi.string().hex().length(24), // if you need update categoryId
    id: idVaildation,
})

export const idVaildationSchema = Joi.object({
    id: idVaildation
})