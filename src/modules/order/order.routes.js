import express from "express"
import { protectedRoutes } from "../../middleware/protectedRoutes.js"
import { allowedTo } from "../../middleware/authorize.js"
import { cashOrder, createCheckoutSession, getAllOrders, getSpecificOrder } from "./order.controller.js"
import { validate } from "../../middleware/validate.js"
import { validationashippingAddres } from "./order.vaildation.js"

const orderRouter = express.Router()

orderRouter.route('/')
    .get(protectedRoutes, allowedTo('user'), getSpecificOrder)
    orderRouter.get('/all', protectedRoutes, allowedTo('admin'), getAllOrders)

orderRouter.route('/:id')
    .post(protectedRoutes, allowedTo('user'), validate(validationashippingAddres), cashOrder)
    orderRouter.post("/checkOut/:id", protectedRoutes, allowedTo('user'), validate(validationashippingAddres), createCheckoutSession)

export default orderRouter
