import express from 'express'
import * as controller from './wishlist.controller.js'
import { validate } from '../../middleware/validate.js'
import { authenticate } from '../../middleware/authenticate.js'
import { allowedTo } from '../../middleware/authorize.js'
import { idValidate } from './wishlist.validation.js'

const wishlistRouter = express.Router()

wishlistRouter.route('/')
    .patch(authenticate, allowedTo("user"), validate(idValidate), controller.addToWishlist)
    .delete(authenticate, allowedTo("user"), validate(idValidate), controller.removeFromWishlist)
    .get(authenticate, allowedTo("user"), controller.getUserWishlist)

export default wishlistRouter
