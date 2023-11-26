import express from 'express'
import * as controller from './coupon.controller.js'
import { validate } from '../../middleware/validate.js'
import { addCouponValidaion, idValidate, updateCouponValidation } from './coupon.validation.js'
import { authenticate } from '../../middleware/authenticate.js'
import { allowedTo } from '../../middleware/authorize.js'

const couponRouter = express.Router()

couponRouter.route('/')
    .post(authenticate, allowedTo("admin"), validate(addCouponValidaion), controller.addCoupon)
    .get(authenticate, allowedTo("admin"), controller.getAllCoupons)

couponRouter.route('/:id')
    .get(authenticate, allowedTo("admin"), validate(idValidate), controller.getCoupon)
    .put(authenticate, allowedTo("admin"), validate(updateCouponValidation), controller.updateCoupon)
    .delete(authenticate, allowedTo("admin"), validate(idValidate), controller.deleteCoupon)

export default couponRouter
