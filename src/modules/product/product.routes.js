import express from "express"
import { addProduct, deleteProduct, getAllProducts, updateProduct } from "./product.controller.js"

const productRouter = express.Router()

productRouter.route('/')
    .post(addProduct)
    .get(getAllProducts)

productRouter.route('/:id')
    .put(updateProduct)
    .delete(deleteProduct)



export default productRouter