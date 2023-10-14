import express from "express"
import { protectedRoutes } from "../../middleware/protectedRoutes.js"
import { allowedTo } from "../../middleware/authorize.js"
import { validate } from "../../middleware/validate.js"
import { validationaAddToAddress, validationaRemoveAddress } from "./address.vaildation.js"
import { addAddress, getUserAddress, removeAddress } from "./address.controller.js"

const addressRouter = express.Router()

addressRouter.route('/')
    .patch(protectedRoutes, allowedTo('user'), validate(validationaAddToAddress), addAddress)
    .delete(protectedRoutes, allowedTo('user'), validate(validationaRemoveAddress), removeAddress)
    .get(protectedRoutes, allowedTo('user'), getUserAddress)

export default addressRouter
