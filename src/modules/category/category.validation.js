import Joi from "joi";

const idVaildation = Joi.string().hex().length(24).required()

export const validationaAddCategory = Joi.object({
    name: Joi.string().max(200).required(),
})

export const validationUpdateCategory = Joi.object({
    name: Joi.string().max(250),
    id: idVaildation
})

export const idVaildationSchema = Joi.object({
  id: idVaildation
})

// export const getAllCategoriesValidation = Joi.object({
//   page: Joi.number().integer().min(1),
//   name: Joi.string(), //Filter
//   age: Joi.number().integer(), //Filter
//   sort: Joi.string(), //Sort
//   searchQuery: Joi.string(), //Search
//   selectedFields: Joi.string(), //Selected Fields
// }) 
  
// Full query schema combining all components
//  export const fullQuerySchema = Joi.object({
//     pagination: paginationSchema,
//     filter: filterSchema,
//     sort: sortSchema,
//     search: searchSchema,
//     selectedFields: selectedFieldsSchema,
//   });

