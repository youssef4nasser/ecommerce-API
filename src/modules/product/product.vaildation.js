import Joi from "joi";

const idVaildation = Joi.string().hex().length(24).required()

export const addProductValidation = Joi.object({
    name: Joi.string().required().max(200),
    description: Joi.string().required().max(350),
    price: Joi.number().min(0).positive().required(),
    stock: Joi.number().min(0).positive(),
    category: idVaildation,
    subCategory: idVaildation,
    brand: idVaildation
})

export const updateProductValidation = Joi.object({
    id: idVaildation,
    name: Joi.string().max(200),
    description: Joi.string().max(350),
    price: Joi.number().min(0).positive(),
    stock: Joi.number().min(0).positive(),
    category: Joi.string().hex().length(24),
    subCategory: Joi.string().hex().length(24),
    brand: Joi.string().hex().length(24)
})

export const deleteProductValidation = Joi.object({
    id: idVaildation,
})

export const getProductValidation = Joi.object({
    id: idVaildation,
})