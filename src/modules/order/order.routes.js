import express from "express"
import { protectedRoutes } from "../../middleware/protectedRoutes.js"
import { allowedTo } from "../../middleware/authorize.js"
import { cashOrder, checkoutSession, getAllOrders, getSpecificOrder } from "./order.controller.js"

const orderRouter = express.Router()

orderRouter.route('/')
    .get(protectedRoutes, allowedTo('user'), getSpecificOrder)
    orderRouter.get('/all', protectedRoutes, allowedTo('admin'), getAllOrders)

orderRouter.route('/:id')
    .post(protectedRoutes, allowedTo('user'), cashOrder)
    orderRouter.post("/checkOut/:id", protectedRoutes, allowedTo('user'), checkoutSession)

export default orderRouter
