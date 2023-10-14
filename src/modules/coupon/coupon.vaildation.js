import Joi from "joi";

const idVaildation = Joi.string().hex().length(24).required()

export const validationaAddCoupon = Joi.object({
    code: Joi.string().max(100).required(),
    expires: Joi.date().required(),
    discount: Joi.number().required(),
})

export const validationUpdateCoupon = Joi.object({
    code: Joi.string().max(100),
    expires: Joi.date(),
    discount: Joi.number(),
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