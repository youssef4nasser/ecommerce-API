import express from "express"
import { validate } from "../../middleware/validate.js"
import { protectedRoutes } from "../../middleware/protectedRoutes.js"
import { allowedTo } from "../../middleware/authorize.js"
import { addReview, deleteReview, getAllReviews, getReview, updateReview } from "./review.controller.js"
import { idVaildationSchema, validationAddReview, validationUpdateReview } from "./review.vaildation.js"

const reviewRouter = express.Router()

reviewRouter.route('/')
    .post(protectedRoutes, allowedTo('user'), validate(validationAddReview), addReview)
    .get(getAllReviews)

reviewRouter.route('/:id')
    .get(validate(idVaildationSchema), getReview)
    .put(protectedRoutes, allowedTo('user'), validate(validationUpdateReview), updateReview)
    .delete(protectedRoutes, allowedTo('admin', 'user'), validate(idVaildationSchema), deleteReview)

export default reviewRouter
