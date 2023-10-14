import express from "express"
import { confirmEmail, signIn, signUp } from "./auth.controller.js"
import { validate } from "../../middleware/validate.js"
import { confirmValidation, signInValidationa, signUpValidationa } from "./auth.vaildation.js"

const authRouter = express.Router()

authRouter.post('/signUp', validate(signUpValidationa), signUp)
authRouter.post('/signIn', validate(signInValidationa), signIn)
authRouter.post('/confirmEmail', validate(confirmValidation), confirmEmail)

export default authRouter
