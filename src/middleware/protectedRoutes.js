import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { catchError } from "../utils/catchError.js";
import { userModel } from "../../database/models/user.model.js";

export const protectedRoutes = catchError(
    async (req, res, next)=>{
        const {token} = req.headers
        // check fi token not provide
        if(!token) return next(new AppError("Token is required", 401))
        // verify the token
        const decoded = jwt.verify(token, process.env.JWT_SEC)
        // check if user exist
        if(!decoded?.id){
            return next(new AppError('Invalid token', 403))
        }
        // Verifiy Finding User
        const user = await userModel.findById(decoded?.id)
        if(!user){
            return next(new AppError('In-valid token user not found', 401))
        }
        // check token after change password
        if(user.passwordChangeAt){
            const changePasswordDate = parseInt(user.passwordChangeAt.getTime() / 1000)
            if(changePasswordDate > decoded.iat) return next(new AppError('In-valid token! you changed your password', 401))    
        }
        req.user = user
        next()
    }
)