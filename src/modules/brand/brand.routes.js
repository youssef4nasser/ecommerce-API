import express from "express"
import { addBrand, deleteBrand, getAllBrands, updateBrand } from "./brand.controller.js"

const brandRouter = express.Router()

brandRouter.route('/')
    .post(addBrand)
    .get(getAllBrands)

brandRouter.route('/:id')
    .put(updateBrand)
    .delete(deleteBrand)


export default brandRouter