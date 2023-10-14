import express from "express"
import { addBrand, deleteBrand, getAllBrands, getBrand, updateBrand } from "./brand.controller.js"
import { validate } from "../../middleware/validate.js"
import { idVaildationSchema, validationUpdateBrand, validationaAddBrand } from "./brand.vaildation.js"
import { protectedRoutes } from "../../middleware/protectedRoutes.js"
import { allowedTo } from "../../middleware/authorize.js"
import {fileUpload, fileValidation} from "../../utils/multer.cloud.js"
const brandRouter = express.Router()

brandRouter.route('/')
    .post(fileUpload(fileValidation.image).single('image'), validate(validationaAddBrand), addBrand)
    .get(getAllBrands)

brandRouter.route('/:id')
    .get(validate(idVaildationSchema), getBrand)
    .put(protectedRoutes, allowedTo('admin'), validate(validationUpdateBrand), updateBrand)
    .delete(protectedRoutes, allowedTo('admin'), validate(idVaildationSchema), deleteBrand)

export default brandRouter
