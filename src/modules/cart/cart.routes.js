import express from "express"
import { protectedRoutes } from "../../middleware/protectedRoutes.js"
import { allowedTo } from "../../middleware/authorize.js"
import { addProductToCart, applyCoupon, clearCartItems, getLogedUserCart, removeProductFromCart, updateQuantity } from "./cart.controller.js"
import { validationCoupon, validationRemoveProduct, validationaAddToCart, validationaupdateQuantity } from "./cart.vaildation.js"
import { validate } from "../../middleware/validate.js"

const cartRouter = express.Router()

cartRouter.route('/')
    .post(protectedRoutes, allowedTo('user'), validate(validationaAddToCart), addProductToCart)
    .get(protectedRoutes, allowedTo('user'), getLogedUserCart)
    .delete(protectedRoutes, allowedTo('user'), validate(), clearCartItems)

cartRouter.post("/coupons", protectedRoutes, allowedTo('user'), validate(validationCoupon), applyCoupon)

cartRouter.route('/:id')
    .patch(protectedRoutes, allowedTo('user'), validate(validationRemoveProduct), removeProductFromCart)
    .put(protectedRoutes, allowedTo('user'), validate(validationaupdateQuantity), updateQuantity)

export default cartRouter
