import express from "express"
import { addSubCategory, deleteSubCategory, getAllSubCategories, getSubCategory, updateSubCategory } from "./subCategory.controller.js"

const subCategoryRouter = express.Router({mergeParams: true})

subCategoryRouter.route('/')
    .post(addSubCategory)
    .get(getAllSubCategories)

subCategoryRouter.route('/:id')
    .put(updateSubCategory)
    .delete(deleteSubCategory)
    .get(getSubCategory)


export default subCategoryRouter