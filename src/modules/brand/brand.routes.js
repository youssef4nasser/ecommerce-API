import express from 'express'
import * as controller from './brand.controller.js'
import { fileUploud, fileValidation } from '../../utils/multer.cloud.js'
import { validate } from '../../middleware/validate.js'
import { addBrandValidaion, headers, idValidate, updateBrandValidation } from './brand.validation.js'
import { allowedTo } from '../../middleware/authorize.js'
import { authenticate } from '../../middleware/authenticate.js'

const brandRouter = express.Router()

brandRouter.route('/')
    .post(validate(headers, true), authenticate, allowedTo("admin"), fileUploud(fileValidation.image).single("image"), validate(addBrandValidaion), controller.addBrand)
    .get(controller.getAllBrands)

brandRouter.route('/:id')
    .get(validate(idValidate), controller.getBrand)
    .put(authenticate, allowedTo("admin"), fileUploud(fileValidation.image).single("image"), validate(updateBrandValidation), controller.updateBrand)
    .delete(authenticate, allowedTo("admin"), validate(idValidate), controller.deleteBrand)

export default brandRouter
