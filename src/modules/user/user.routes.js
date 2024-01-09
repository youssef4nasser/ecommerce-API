import express from 'express'
import { confirmNewEmail, getProfile, profileImage, updateProfile } from './user.controller.js'
import { fileUpload, fileValidation } from '../../utils/multer.cloud.js'
import { validate } from '../../middleware/validate.js'
import { confirmValidation, updateProfileValidation } from './user.validation.js'
import { authenticate } from '../../middleware/authenticate.js'

const userRouter = express.Router()

userRouter.route('/')
    .get(authenticate, getProfile)
    .put(authenticate, validate(updateProfileValidation), updateProfile)

userRouter.patch('/confirm', authenticate,validate(confirmValidation), confirmNewEmail)
userRouter.patch('/profileImage', authenticate, fileUpload(fileValidation.image).single('image'), profileImage)

export default userRouter
