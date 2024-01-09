import express from "express"
import { authenticate } from "../../middleware/authenticate.js"
import { allowedTo } from "../../middleware/authorize.js"
import { addProductToCart, applyCoupon, clearCartItems, getLogedUserCart, removeProductFromCart, updateQuantity } from "./cart.controller.js"
import { validationCoupon, validationRemoveProduct, validationaAddToCart, validationaupdateQuantity } from "./cart.vaildation.js"
import { validate } from "../../middleware/validate.js"

const cartRouter = express.Router()

cartRouter.route('/')
    .post(authenticate, allowedTo('user'), validate(validationaAddToCart), addProductToCart)
    .get(authenticate, allowedTo('user'), getLogedUserCart)
    .delete(authenticate, allowedTo('user'), clearCartItems)

cartRouter.post("/coupons", authenticate, allowedTo('user'), validate(validationCoupon), applyCoupon)

cartRouter.route('/:id')
    .patch(authenticate, allowedTo('user'), validate(validationRemoveProduct), removeProductFromCart)
    .put(authenticate, allowedTo('user'), validate(validationaupdateQuantity), updateQuantity)

export default cartRouter
