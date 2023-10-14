import { userModel } from "../../../database/models/user.model.js"
import { AppError } from "../../utils/AppError.js"
import { catchError } from "../../utils/catchError.js"

export const addAddress = catchError(
    async(req, res, next)=>{
        const result = await userModel.findByIdAndUpdate(req.user._id, {$addToSet: {address: req.body}}, {new: true })
        !result && next(new AppError('not found'))
        result && res.json({message: "success", address: result.address})
    }
)

export const removeAddress = catchError(
    async(req, res, next)=>{
        const result = await userModel.findByIdAndUpdate(req.user._id, {$pull: {address: {_id: req.body.address}}}, {new: true })
        !result && next(new AppError('not found'))
        result && res.json({message: "success", address: result.address})
    }
)

export const getUserAddress = catchError(
    async(req, res, next)=>{
        const result = await userModel.findOne({_id: req.user._id})
        !result && next(new AppError('not found'))
        result && res.json({message: "success", address: result.address})
    }
)
