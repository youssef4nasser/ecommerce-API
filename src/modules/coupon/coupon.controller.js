import { couponModel } from "../../../database/models/coupon.model.js"
import { ApiFeatures } from "../../utils/ApiFeatures.js"
import { catchError } from "../../utils/catchError.js"
import qrcode from 'qrcode'

export const addCoupon = catchError(
    async(req, res, next)=>{
        let coupon = new couponModel(req.body)
        await coupon.save()
        return res.json({message:"success", coupon})
    }
)

export const getAllCoupons = catchError(
    async(req, res, next)=>{
        let apiFeatures = new ApiFeatures(couponModel.find(), req.query)
        .paginate().fields().filter().sort().search()
        
        // exeute query
        const coupons = await apiFeatures.mongooseQuery
        
        return res.status(201).json({ message: "success",
        pageNumber: apiFeatures.pageNumber,
        resulte: coupons.length,
        coupons})
    }
)

export const getCoupon = catchError(
    async(req,res,next)=> {
        const {id} = req.params
        const coupon = await couponModel.findById(id)
        const urlQrcode = await qrcode.toDataURL(coupon.code)
        return res.status(201).json({message: "success", coupon, urlQrcode})
    }
)

export const updateCoupon = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        const coupon = await couponModel.findByIdAndUpdate(id, req.body, {new: true})
    
        !coupon && next(new AppError("coupon not found", 404))
        coupon && res.status(201).json({message: "success", coupon})
    }
)

export const deleteCoupon = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        const coupon = await couponModel.findByIdAndDelete(id)
        !coupon && next(new AppError("coupon not found", 404))
        coupon && res.status(201).json({message: "success"})
    }
)
