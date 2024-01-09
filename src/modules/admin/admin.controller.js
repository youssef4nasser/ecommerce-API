import userModel from "../../../database/models/user.model.js"
import { ApiFeatures } from "../../utils/ApiFeatures.js"
import { AppError } from "../../utils/AppError.js"
import { catchError } from "../../utils/catchError.js"

export const addUser = catchError(
    async(req, res, next)=>{
        const isUser = userModel.findOne({email: req.body.email})
        if(isUser) return next(new AppError("Email already in use", 409))
        // Create a new User using the User model and save it to the database
        req.body.isVerified = true
        const user = new userModel(req.body)
        await user.save()
        return res.status(201).json({message: "success", user})
    }
)

export const getAllUsers = catchError(
    async(req, res, next)=>{
        let apiFeatures = new ApiFeatures(userModel.find(), req.query)
        .paginate().fields().filter().sort().search()
        
        // exeute query
        const user = await apiFeatures.mongooseQuery
        
        return res.status(201).json({ message: "success",
        page: apiFeatures.page,
        resulte: user.length,
        user})
    }
)

export const getUser = catchError (
    async(req,res,next)=> {
        const {id} = req.params
        const user = await userModel.findById(id)
        return res.status(201).json({message: "success", user})
    }
)

export const updateUser = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        const user = await userModel.findByIdAndUpdate(id, req.body, {new: true})
    
        !user && next(new AppError("User not found", 404))
        user && res.status(201).json({message: "success", user})
    }
)

export const deleteUser = catchError(
    async(req, res, next)=>{
        const {id} = req.params
        const user = await userModel.findByIdAndDelete(id)
        !user && next(new AppError("User not found", 404))
        user && res.status(201).json({message: "success"})
    }
)
