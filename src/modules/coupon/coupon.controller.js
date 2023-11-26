import { couponModel } from "../../../DataBase/models/coupon.model.js";
import { ApiFeatures } from "../../utils/ApiFeature.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";

export const addCoupon = catchError(
    async (req, res, next)=>{
        // check date 
        if(req.body.expire < Date.now().toString()){
            return next(new AppError('Expiration Date must be greater than current date', 403));
        }
        // check if coupon already exist or no
        const isExist = await couponModel.findOne({code: req.body.code})
        if(isExist) return next(new AppError("This Coupon already exist", 409))
        // create new coupon and save on DB
        const coupon = new couponModel(req.body)
        await coupon.save()
        res.status(201).json({message: "Success", coupon})
    }
)

export const getAllCoupons = catchError(
    async (req, res, next)=>{
        let apiFeatures = new ApiFeatures(couponModel.find({}), req.query)
        .paginate().filter().select().search().sort()
        // execute query
        const coupons = await apiFeatures.mongooseQuery
        return res.status(200).json({message: "Success",
        page: apiFeatures.page,
        resulte: coupons.length,
        coupons})
    }
)

export const getCoupon = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        const coupon = await couponModel.findById(id)
        !coupon && next(new AppError("Not found this Coupon", 409))
        coupon && res.status(200).json({message: "Success", coupon})
    }
)

export const updateCoupon = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        const {code, expires, discount} = req.body
        // check date
        if(req.body.expire < date.now()){
            return next(new AppError('Expiration Date must be greater than current date', 403));
        }
        // get coupon by id
        let coupon = await couponModel.findById(id)
        // check this coupon found or no
        !coupon && next(new AppError("Not found this Coupon", 409))
        // check if coupon code already exist and update
        const updateCoupon = await couponModel.findOneAndUpdate(
            {name: req.body.name},
            {code, expires, discount},
            {new: true})
        !updateCoupon && next(new AppError("This Coupon already exist", 409))
        updateCoupon && res.status(200).json({message: "Success", coupon:updateCoupon})
    }
)

export const deleteCoupon = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        let coupon = await couponModel.findByIdAndDelete(id)
        !coupon && next(new AppError("Not found this coupon", 409))
        coupon && res.status(200).json({message: "Success"})
    }
)
