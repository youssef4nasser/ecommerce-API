import Joi from "joi";

const idVaildation = Joi.string().hex().length(24).required()

export const validationaAddUser = Joi.object({
    name: Joi.string().max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required()
})

export const validationUpdateUser = Joi.object({
    id: idVaildation,
    role: Joi.string().valid('admin', 'user'),
    isActive: Joi.boolean(),
    isVerified: Joi.boolean(),
    blocked: Joi.boolean(),
});


export const idVaildationSchema = Joi.object({
    id: idVaildation
})

export const validationchangePassword = Joi.object({
    password: Joi.string().min(6).max(30),
    id: idVaildation
})

// export const validationQuery = Joi.object({
//     // must do vaildation on fulter query
//     pageNumber :Joi.number().min(1),
//     fields   :Joi.number().positive(),          
//     sort     :Joi.string().min(1).max(200),      // sort by field in the model
//     keyword: Joi.string().min(1).max(200),      //search text to query with
// })