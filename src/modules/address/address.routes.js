import express from 'express'
import * as controller from './address.controller.js'
import { validate } from '../../middleware/validate.js'
import { authenticate } from '../../middleware/authenticate.js'
import { allowedTo } from '../../middleware/authorize.js'
import { validationaAddToAddress, validationaRemoveAddress } from './address.validation.js'

const addressRouter = express.Router()

addressRouter.route('/')
    .patch(authenticate, allowedTo("user"), validate(validationaAddToAddress), controller.addToAddress)
    .delete(authenticate, allowedTo("user"), validate(validationaRemoveAddress), controller.removeFromAddress)
    .get(authenticate, allowedTo("user"), controller.getUserAddress)

export default addressRouter
