import { userModel } from "../../../DataBase/models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";

export const addToAddress = catchError(
    async(req, res, next)=>{
        const userAddress = await userModel.findByIdAndUpdate(req.user.id, {$addToSet: {address: req.body}}, {new: true})
        !userAddress && next(new AppError("Not found", 409))
        userAddress && res.status(200).json({message: "Success", address:userAddress.address})
    }
)

export const removeFromAddress = catchError(
    async(req, res, next)=>{
        const userAddress = await userModel.findByIdAndUpdate(req.user.id, {$pull: {address: {_id: req.body.address}}}, {new: true})
        !userAddress && next(new AppError("Not found", 409))
        userAddress && res.status(200).json({message: "Success", address:userAddress.address})
    }
)

export const getUserAddress = catchError(
    async (req, res, next)=>{
        const userAddress =  await userModel.findById(req.user.id)
        return res.status(200).json({message: "Success", address:userAddress.address})
    }
)
