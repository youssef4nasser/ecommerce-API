import { userModel } from "../../../database/models/user.model.js"
import { AppError } from "../../utils/AppError.js"
import { catchError } from "../../utils/catchError.js"

export const addToWishlist = catchError(
    async(req, res, next)=>{
        const {product} = req.body
        const result = await userModel.findByIdAndUpdate(req.user._id, {$addToSet: {wishlist: product}}, {new: true })
        !result && next(new AppError('not found'))
        result && res.json({message: "success", wishlist: result.wishlist})
    }
)

export const removeFromWishlist = catchError(
    async(req, res, next)=>{
        const {product} = req.body
        const result = await userModel.findByIdAndUpdate(req.user._id, {$pull: {wishlist: product}}, {new: true })
        !result && next(new AppError('not found'))
        result && res.json({message: "success", wishlist: result.wishlist})
    }
)

export const getUserWishlist = catchError(
    async(req, res, next)=>{
        const result = await userModel.findOne({_id: req.user._id}).populate('wishlist')
        !result && next(new AppError('not found'))
        result && res.json({message: "success", wishlist: result.wishlist})
    }
)
