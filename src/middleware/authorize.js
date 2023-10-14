import { AppError } from "../utils/AppError.js"
import { catchError } from "../utils/catchError.js"

export const allowedTo = (...roles) =>{
    return catchError(
        async (req, res, next) =>{
            if(!roles.includes(req.user.role))
                return next(new AppError("You are not authorized to access this page.", 401))
            next()
        }
    )
}