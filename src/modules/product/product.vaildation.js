import Joi from "joi";

export const addProductValidation = Joi.object({
    name: Joi.string().required().max(700),
    description: Joi.string().required().min(3).max(2000),
    price: Joi.number().min(1).positive().required(),
    stock: Joi.number().min(0).positive().required(),
    colors: Joi.custom((value, helper)=>{
        value = JSON.parse(value)
        const arraySchema = Joi.object().keys({
            value: Joi.array().items(Joi.string())
        })
        const vaildationResult = arraySchema.validate({value});
        if (vaildationResult.error){
            return helper.message(vaildationResult.error.message)
        } else {
            return true;
        }
    }).required(),
    sizes: Joi.custom((value, helper)=>{
        value = JSON.parse(value)
        const arraySchema = Joi.object().keys({
            value: Joi.array().items(Joi.string())
        })
        const vaildationResult = arraySchema.validate({value});
        if (vaildationResult.error){
            return helper.message(vaildationResult.error.message)
        } else {
            return true;
        }
    }).required(),
    discount: Joi.number().min(1).max(100).positive(),
    brand: Joi.string().hex().length(24).required(),
    category: Joi.string().hex().length(24).required(),
    subCategory: Joi.string().hex().length(24).required(),
    file: Joi.required(),
})

export const updateProductValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
    name: Joi.string().max(700),
    description: Joi.string().min(3).max(2000),
    price: Joi.number().min(1).positive(),
    stock: Joi.number().min(0).positive(),
    colors: Joi.custom((value, helper)=>{
        value = JSON.parse(value)
        const arraySchema = Joi.object().keys({
            value: Joi.array().items(Joi.string())
        })
        const vaildationResult = arraySchema.validate({value});
        if (vaildationResult.error){
            return helper.message(vaildationResult.error.message)
        } else {
            return true;
        }
    }),
    sizes: Joi.custom((value, helper)=>{
        value = JSON.parse(value)
        const arraySchema = Joi.object().keys({
            value: Joi.array().items(Joi.string())
        })
        const vaildationResult = arraySchema.validate({value});
        if (vaildationResult.error){
            return helper.message(vaildationResult.error.message)
        } else {
            return true;
        }
    }),
    discount: Joi.number().min(1).max(100).positive(),
    brand: Joi.string().hex().length(24),
    category: Joi.string().hex().length(24),
    subCategory: Joi.string().hex().length(24),
    file: Joi.optional()
})

export const idValidate = Joi.object({
    id: Joi.string().hex().length(24).required(),
})