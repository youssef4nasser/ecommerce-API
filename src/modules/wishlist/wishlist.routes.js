import express from "express"
import { protectedRoutes } from "../../middleware/protectedRoutes.js"
import { allowedTo } from "../../middleware/authorize.js"
import { addToWishlist, getUserWishlist, removeFromWishlist } from "./wishlist.controller.js"
import { validate } from "../../middleware/validate.js"
import { validationaAddToWishlist, validationaRemoveFromWishlist } from "./wishlist.vaildation.js"

const wishlistRouter = express.Router()

wishlistRouter.route('/')
    .patch(protectedRoutes, allowedTo('user'), validate(validationaAddToWishlist), addToWishlist)
    .delete(protectedRoutes, allowedTo('user'), validate(validationaRemoveFromWishlist), removeFromWishlist)
    .get(protectedRoutes, allowedTo('user'), getUserWishlist)

export default wishlistRouter
