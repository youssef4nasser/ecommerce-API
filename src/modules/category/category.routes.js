import express from "express"
import { addCategory, deleteCategory, getAllCategories, getCategory, updateCategory } from "./category.controller.js"
import subCategoryRouter from "../subCategory/subCategory.routes.js"

const categoryRouter = express.Router()

categoryRouter.use('/:categoryId/subcategories', subCategoryRouter)

categoryRouter.route('/')
    .post(addCategory)
    .get(getAllCategories)

categoryRouter.route('/:id')
    .get(getCategory)
    .put(updateCategory)
    .delete(deleteCategory)

export default categoryRouter