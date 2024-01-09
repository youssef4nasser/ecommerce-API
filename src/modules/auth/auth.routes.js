import express from "express"
import { confirmEmail, forgetPassword, loginFacebook, loginGoogle, resetPassword, signIn, signUp } from "./auth.controller.js"
import { validate } from "../../middleware/validate.js"
import { VerifyCodeValidationa, confirmValidation, forgetPasswordValidation, signInGoogleValidationa, signInValidationa, signUpValidationa } from "./auth.vaildation.js"

const authRouter = express.Router()

authRouter.post('/signUp', validate(signUpValidationa), signUp)
authRouter.post('/signIn', validate(signInValidationa), signIn)

authRouter.post('/confirmEmail', validate(confirmValidation), confirmEmail)

authRouter.post('/forgetPassword', validate(forgetPasswordValidation), forgetPassword)
authRouter.post('/Verify', validate(VerifyCodeValidationa), resetPassword)

authRouter.post('/signInGoogle', validate(signInGoogleValidationa), loginGoogle)
authRouter.post('/signInFacebook', validate(), loginFacebook)

export default authRouter
