import express from 'express'
import * as controller from './category.controller.js'
import { fileUploud, fileValidation } from '../../utils/multer.cloud.js'
import { validate } from '../../middleware/validate.js'
import { addCategoryValidaion, idValidate, updateCategoryValidation } from './category.validation.js'
import subCategoryRouter from '../subCategory/subCategory.routes.js'
import { allowedTo } from '../../middleware/authorize.js'
import { authenticate } from '../../middleware/authenticate.js'

const categoryRouter = express.Router()

categoryRouter.use("/:categoryId/subcategory", subCategoryRouter)

categoryRouter.route('/')
    .post(authenticate, allowedTo("admin"), fileUploud(fileValidation.image).single("image"), validate(addCategoryValidaion), controller.addCategory)
    .get(controller.getAllCategories)

categoryRouter.route('/:id')
    .get(validate(idValidate), controller.getCategory)
    .put(authenticate, allowedTo("admin"), fileUploud(fileValidation.image).single("image"), validate(updateCategoryValidation), controller.updateCategory)
    .delete(authenticate, allowedTo("admin"), validate(idValidate), controller.deleteCategory)

export default categoryRouter
