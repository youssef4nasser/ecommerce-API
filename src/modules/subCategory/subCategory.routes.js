import express from "express"
import { addSubCategory, deleteSubCategory, getAllSubCategories, getSubCategory, updateSubCategory } from "./subCategory.controller.js"
import { validate } from "../../middleware/validate.js"
import { addSubcategorySchema, idVaildationSchema, updateSubCategorySchema } from "./subCategory.validation.js"
import { allowedTo } from "../../middleware/authorize.js"
import { protectedRoutes } from "../../middleware/protectedRoutes.js"

const subCategoryRouter = express.Router({mergeParams: true})

subCategoryRouter.route('/')
    .post(protectedRoutes, allowedTo('admin'), validate(addSubcategorySchema), addSubCategory)
    .get(getAllSubCategories)

subCategoryRouter.route('/:id')
    .get(validate(idVaildationSchema), getSubCategory)
    .put(protectedRoutes, allowedTo('admin'), validate(updateSubCategorySchema), updateSubCategory)
    .delete(protectedRoutes, allowedTo('admin'), validate(idVaildationSchema), deleteSubCategory)

export default subCategoryRouter
