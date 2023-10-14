import Joi from "joi";

const idVaildation = Joi.string().hex().length(24).required()

export const validationAddReview = Joi.object({
    review: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    product: idVaildation
})

export const validationUpdateReview = Joi.object({
    review: Joi.string().max(100),
    rating: Joi.number().min(1).max(5),
    id: idVaildation
})

export const idVaildationSchema = Joi.object({
    id: idVaildation
})

// export const validationQuery = Joi.object({
//     // must do vaildation on fulter query
//     pageNumber :Joi.number().min(1),
//     fields   :Joi.string().max(200),          
//     sort     :Joi.string().min(1).max(200),      // sort by field in the model
//     keyword: Joi.string().min(1).max(200),      //search text to query with
// })