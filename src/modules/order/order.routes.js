import express from "express"
import { authenticate } from "../../middleware/authenticate.js"
import { allowedTo } from "../../middleware/authorize.js"
import { cashOrder, createCheckoutSession, getAllOrders, getSpecificOrder } from "./order.controller.js"
import { validate } from "../../middleware/validate.js"
import { validationashippingAddres } from "./order.vaildation.js"

const orderRouter = express.Router()

orderRouter.route('/')
    .get(authenticate, allowedTo('user'), getSpecificOrder)
    orderRouter.get('/all', authenticate, allowedTo('admin'), getAllOrders)

orderRouter.route('/:id')
    .post(authenticate, allowedTo('user'), validate(validationashippingAddres), cashOrder)
    orderRouter.post("/checkOut/:id", authenticate, allowedTo('user'), validate(validationashippingAddres), createCheckoutSession)

export default orderRouter
