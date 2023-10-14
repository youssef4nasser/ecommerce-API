import express from "express"
import { addCategory, deleteCategory, getAllCategories, getCategory, updateCategory } from "./category.controller.js"
import subCategoryRouter from "../subCategory/subCategory.routes.js"
import { validate } from "../../middleware/validate.js"
import { idVaildationSchema, validationUpdateCategory, validationaAddCategory } from "./category.validation.js"
import { allowedTo } from "../../middleware/authorize.js"
import { protectedRoutes } from "../../middleware/protectedRoutes.js"

const categoryRouter = express.Router()

categoryRouter.use('/:id/subcategories', validate(idVaildationSchema), subCategoryRouter)

categoryRouter.route('/')
    .post(protectedRoutes, allowedTo('admin'), validate(validationaAddCategory), addCategory)
    .get(getAllCategories)

categoryRouter.route('/:id')
    .get(validate(idVaildationSchema), getCategory)
    .put(protectedRoutes, allowedTo('admin'), validate(validationUpdateCategory), updateCategory)
    .delete(protectedRoutes, allowedTo('admin'), validate(idVaildationSchema), deleteCategory)

export default categoryRouter