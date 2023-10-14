import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { catchError } from "../utils/catchError.js";
import { userModel } from "../../database/models/user.model.js";

export const protectedRoutes = catchError(
    async (req, res, next)=>{
        const {token} = req.headers
        if(!token) return next(new AppError('TOKEN NOT PROVIDED', 401))

        const decoded = jwt.verify(token, "ILoveWebDevelopment")

        const user = await userModel.findById(decoded.id)
        if(!user)  return next(new AppError('Invalid token user not found', 401))

        if(user.passwordChangeAt){
            const changePasswordDate = parseInt(user.passwordChangeAt.getTime() / 1000)
            if(changePasswordDate > decoded.iat) return next(new AppError('Invalid token!', 401))    
        }
    
        req.user = user
        next()
    }
)