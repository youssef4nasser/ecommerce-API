import { AppError } from "../../utils/AppError.js"
import { htmlEmailTemplate } from "../../utils/htmlEmailCode.js"
import { sendEmail } from "../../utils/email.js"
import { nanoid } from "nanoid"
import bcrypt from 'bcrypt'
import cloudinary from "../../utils/cloudinary.js"
import { catchError } from "../../utils/catchError.js"
import userModel from "../../../database/models/user.model.js"

// get user profile
export const getProfile = catchError(
    async (req, res, next) => {
        const user = await userModel.findById(req.user.id).select("-codeConfirmEmail");
        return res.status(200).json({message:"success", user})
    }
)

// update user profile
export const updateProfile = catchError(
    async (req, res, next) => {
        const {name, email, newPassword} = req.body
        // get user
        // const user = await userModel.findById(req.user.id)
        // // if user not found
        // if (!user) return next(new AppError("User not found", 404))
        // check if name changed
        // if(name){
        //     user.name = name
        // }
        // check if email is changed
        if(email){
            // message for user if new email is Exists
            const isExists = await userModel.findOne({email: email})
            if (isExists) return next(new AppError("Email already exists", 401))
            // generate conde  confirm
            const codeConfirm = nanoid(6)
            // Send email for user to confirm his email
            sendEmail(email, "Confirm your Email", htmlEmailTemplate(codeConfirm))
            // update model and save it
            req.body.isVerified = false
            req.body.codeConfirmEmail = codeConfirm
            req.body.email = email
        } 
        // check if password changed
        if(newPassword){
            // compare the new password with the current password
            // const isMatch = bcrypt.compareSync(newPassword, user.password)
            // if(isMatch){
            //     return next(new AppError("New password must be different from current password", 401))
            // }
            // req.body.passwordChangeAt = Date.now()
        }

        const user = await userModel.findByIdAndUpdate(req.user.id, req.body, {new: true})
        !user && next(new AppError('user not found', 404))
        user && res.status(201).json({message: 'success', user})

        // Save the updated User info in DB
        // const updatedUser = await user.save()
        // Return response with success status and data of Updated User
        // return res.status(200).json({message: 'success', user: updatedUser})
    }
)

// confirm new email
export const confirmNewEmail = catchError(
    async (req, res, next) => {
        const {codeConfirm} = req.body
        // get user
        const user = await userModel.findOne({email: req.user.email})
        // code not same (Invalid code)
        if(user.codeConfirm !== codeConfirm) return next(new AppError('Invalid code', 401))
        // update model and save it
        await userModel.findByIdAndUpdate(req.user.id, {
            confirmEmail: true,
            codeConfirm: null
            }, {new: true})
        return res.status(201).json({message: "success"})
    }
)

// add or update profile picture 
export const profileImage = catchError(
    async (req, res, next) => {           
        const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, 
              {folder: `/Exam/profile picture`});
        // Destroy the old image
        if (req.user.profileImage) {
            await cloudinary.uploader.destroy(req.user.profileImage.public_id);
        }
        // Update the user's profile image
        await userModel.findByIdAndUpdate(req.user.id,
                {profileImage: {secure_url, public_id}});

        return res.json({message: "success", image: secure_url});
    }
)

// delete user profile
export const deleteProfile = catchError(
    async (req, res, next) => {
        let user = await userModel.findById(req.user.id)
        // check if this account has been deleted before
        if(!user){
            return next(new AppError('This account is already deleted!', 404));
        }
        // remove the user from the database
        await userModel.findByIdAndDelete(user.id)

        return res.status(204).json({message:'User Deleted!'})
})

// update password
// export const updatePassword = catchError(
//     async (req, res, next) => {
//         const { newPassword} = req.body
//         // get user
//         const user = await userModel.findById(req.user.id)
//         // if user not found
//         if (!user) return next(new AppError("User not found", 404))
//         // check if password is changed
//         const isMatch = await bcrypt.compare(newPassword, user.password)
//         if (isMatch) return next(new AppError("new password must be different", 401))
//         // update model and save it
//         user.password = await bcrypt.hash(newPassword, +process.env.SALT_ROUND) 
//         user.save()
//         return res.status(200).json({message: "success", user})
//     }
// )

// update pass
// export const changeUserPassword = catchError(
//     async (req, res, next) =>{
//         const {id} = req.params;
//         req.body.passwordChangeAt = Date.now()
//         const user = await userModel.findByIdAndUpdate(id, req.body, {new: true})
//         !user && next(new AppError('user not found', 404))
//         user && res.status(201).json({message: 'success', user})
//     }
// )