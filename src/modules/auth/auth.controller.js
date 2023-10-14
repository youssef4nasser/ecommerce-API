import jwt from "jsonwebtoken";
import { userModel } from "../../../database/models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import bcrypt from 'bcrypt'
import { nanoid } from "nanoid";
import { htmlEmailTemplate } from "../../utils/htmlEmailCode.js";
import { sendEmail } from "../../utils/email.js";

export const signUp = catchError(
    async (req, res, next) => {
        const codeConfirm = nanoid(6)
        // create a new user and save it to the database
        req.body.codeConfirmEmail = codeConfirm
        const user = userModel(req.body)
        await user.save()

        // Send email for user to confirm his email
        sendEmail(req.body.email, "Confirm your Email", htmlEmailTemplate(codeConfirm))

        res.status(201).json({message: 'success', user})
    }
)

export const confirmEmail = catchError(
    async (req, res, next) => {
        const {email, code} = req.body
        // find the user by id in params
        const user = await userModel.findOne({email});
        // if user confirm his email before
        if(user.isVerified) return next(new AppError("this email confirmed"))
        
        if(code != user.codeConfirmEmail) return next(new AppError("In vaild code"))

        const newCode = nanoid(6)

        await userModel.findOneAndUpdate({_id: user._id}, {isVerified: true, codeConfirmEmail: newCode})

        res.status(201).json({message: 'success'})
    }
)

export const signIn = catchError(
    async (req, res, next) => {
        const {email, password} = req.body

        // get the user by email address in the request body
        const user = await userModel.findOne({email});
        if(!user || !bcrypt.compareSync(password, user.password))
            return next(new AppError('Incorrect email or password', 401))

            // generate an access token
            const token = jwt.sign({email: user.email, name: user.name, id: user._id, role: user.role}, "ILoveWebDevelopment")
            res.status(201).json({message: 'success', token})
    }
)