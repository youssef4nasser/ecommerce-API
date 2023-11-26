import express from 'express'
import * as controller from './review.controller.js'
import { validate } from '../../middleware/validate.js'
import { idValidate, validationAddReview, validationUpdateReview } from './review.validation.js'
import { authenticate } from '../../middleware/authenticate.js'
import { allowedTo } from '../../middleware/authorize.js'

const reviewRouter = express.Router()

reviewRouter.route('/')
    .post(authenticate, allowedTo("user"), validate(validationAddReview), controller.addReview)
    .get(controller.getAllReviews)

reviewRouter.route('/:id')
    .get(validate(idValidate), controller.getReview)
    .put(authenticate, allowedTo("user"), validate(validationUpdateReview), controller.updateReview)
    .delete(authenticate, allowedTo("user", "admin"), validate(idValidate), controller.deleteReview)

export default reviewRouter
