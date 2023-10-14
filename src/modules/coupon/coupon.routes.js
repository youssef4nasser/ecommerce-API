import express from "express"
import { validate } from "../../middleware/validate.js"
import { protectedRoutes } from "../../middleware/protectedRoutes.js"
import { allowedTo } from "../../middleware/authorize.js"
import { idVaildationSchema, validationUpdateCoupon, validationaAddCoupon } from "./coupon.vaildation.js"
import { addCoupon, deleteCoupon, getAllCoupons, getCoupon, updateCoupon } from "./coupon.controller.js"

const couponRouter = express.Router()

couponRouter.route('/')
    .post(protectedRoutes, allowedTo('admin'), validate(validationaAddCoupon), addCoupon)
    .get(getAllCoupons)

couponRouter.route('/:id')
    .get(validate(idVaildationSchema), getCoupon)
    .put(protectedRoutes, allowedTo('admin'), validate(validationUpdateCoupon), updateCoupon)
    .delete(protectedRoutes, allowedTo('admin'), validate(idVaildationSchema), deleteCoupon)

export default couponRouter
