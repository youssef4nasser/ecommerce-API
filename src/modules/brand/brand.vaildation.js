import Joi from "joi";

const idVaildation = Joi.string().hex().length(24).required()

export const validationaAddBrand = Joi.object({
    name: Joi.string().max(200).required(),
})

export const validationUpdateBrand = Joi.object({
    name: Joi.string().max(100).required(),
    id: idVaildation,
})

export const idVaildationSchema = Joi.object({
    id: idVaildation
})

// export const validationQuery = Joi.object({
//     // must do vaildation on fulter query
//     pageNumber :Joi.number().min(1),
//     fields   :Joi.number().positive(),          
//     sort     :Joi.string().min(1).max(200),      // sort by field in the model
//     keyword: Joi.string().min(1).max(200),      //search text to query with
// })