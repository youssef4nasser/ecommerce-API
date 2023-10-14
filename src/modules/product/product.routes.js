import express from "express"
import { addProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "./product.controller.js"
import { protectedRoutes } from "../../middleware/protectedRoutes.js"
import { allowedTo } from "../../middleware/authorize.js"
import { validate } from "../../middleware/validate.js"
import { addProductValidation, deleteProductValidation, getProductValidation, updateProductValidation } from "./product.vaildation.js"

const productRouter = express.Router()

productRouter.route('/')
    .post(protectedRoutes, allowedTo('admin'), validate(addProductValidation), addProduct)
    .get(getAllProducts)

productRouter.route('/:id')
    .get(validate(getProductValidation), getProduct)
    .put(protectedRoutes, allowedTo('admin'), validate(updateProductValidation), updateProduct)
    .delete(protectedRoutes, allowedTo('admin'), validate(deleteProductValidation), deleteProduct)

export default productRouter
