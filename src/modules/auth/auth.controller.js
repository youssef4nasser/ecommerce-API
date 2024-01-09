import jwt from "jsonwebtoken";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import bcrypt from 'bcrypt'
import { nanoid } from "nanoid";
import { htmlEmailTemplate } from "../../utils/htmlEmailCode.js";
import { sendEmail } from "../../utils/email.js";
import userModel from "../../../database/models/user.model.js";
import axios from "axios";

export const signUp = catchError(
    async (req, res, next) => {
        const isUser = await userModel.findOne({email: req.body.email})
        if(isUser) return next(new AppError("This email has been registered", 409))
        // generate conde  confirm
        const codeConfirm = nanoid(6)
        // create a new user and save it to the database
        req.body.codeConfirmEmail = codeConfirm
        const user = userModel(req.body)
        await user.save()
        // Send email for user to confirm his email
        sendEmail(user.email, "Confirm your Email", htmlEmailTemplate(codeConfirm))
        res.status(201).json({message: 'Success', confirmEmail: "please check your email"})
    }
)

export const confirmEmail = catchError(
    async (req, res, next) => {
        const {email, code} = req.body
        // find the user by id in params
        const user = await userModel.findOne({email});
        // if user not found
        if(!user) return next(new AppError('Not found user'))
        // if user confirm his email before
        if(user.isVerified) return next(new AppError("this email confirmed before"))
        // compare the code with the one stored in the db
        if(code != user.codeConfirmEmail) return next(new AppError("In vaild code"))
        // update the user status of verification
        await userModel.findOneAndUpdate({_id: user._id}, {isVerified: true, codeConfirmEmail: null})
        
        res.status(201).json({message: 'Success'})
    }
)

export const signIn = catchError(
    async (req, res, next) => {
        const {email, password} = req.body
        // get the user by email address in the request body
        const user = await userModel.findOne({email}).select("-codeConfirmEmail");
        if(!user || !bcrypt.compareSync(password, user.password)) return next(new AppError('Incorrect email or password', 401))
        // generate an access token
        const token = jwt.sign({email: user.email, name: user.name, id: user._id, role: user.role}, process.env.JWT_SEC)
        return res.status(201).json({message: 'Success', token, user})
    }
)

// forget password
export const forgetPassword = catchError(
    async (req, res, next) => {
        const {email} = req.body
        const user = await userModel.findOne({email})
        // if user not found
        if (!user) return next(new AppError('User not found', 401))
        // generate code
        const codeConfirm = nanoid(6)
        // Time expire code
        const expireDateCode = Date.now() + 5 * 60 * 1000;
        // Send email for user to confirm his email
        sendEmail(user.email, "Your Password Reset Code (Valid 5 minutes)", htmlEmailTemplate(codeConfirm))
        // update model and save it
        user.expireDateCode = expireDateCode
        user.codeConfirmEmail = codeConfirm
        user.save()
        res.status(201).json({message: "Reset code sent to your email"})
    }
)

// Verify Code and update password
export const resetPassword = catchError(
    async (req, res, next) => {
        const {email, code, newPassword} = req.body
        // find user
        const user = await userModel.findOne({email})
        // if user not found
        if (!user) return next(new AppError('user not found', 401))
        // check codeConfirm
        if(user.codeConfirmEmail !== code || user.expireDateCode < Date.now()) return next(new AppError('Invalid reset code or expired', 401))
        // hash Password
        const hashedPassword = bcrypt.hashSync(newPassword, +process.env.SALT_ROUND);
        // update model and save it
        user.codeConfirmEmail = null
        user.password = hashedPassword
        user.save()
        res.status(201).json({message: "success", user})
    }
)

// Sinup or Login with google
export const loginGoogle= catchError(
    async(req,res,next)=>{
        const {idToken} = req.body
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            return payload
        }
        const {given_name, family_name, email_verified, picture, email} = await verify()
        
        if(!email_verified) return next(new AppError('Email not verified with Google', 409 ) )
        
        const user = await userModel.findOne({email,  provider: "Google"})
        // LoginUser
        if(user){
            const token = jwt.sign({
                name: user.name,
                email: user.email,
                id: user._id,
                role: user.role},
                process.env.JWT_SEC)

            return res.status(200).json({message:" Success", token})    
        }
        // SignupUser
        const SignupUser = await userModel.create({
            name: given_name,
            email,
            image: picture,
            isVerified: email_verified,
            password: bcrypt.hashSync(nanoid(6), +process.env.SALT_ROUND),
            provider: "Google"
        })
        const token = jwt.sign({
            name: SignupUser.name,
            email: SignupUser.email,
            id: SignupUser._id,
            role: SignupUser.role},
            process.env.JWT_SEC)

        return res.status(201).json({message: "Success", token})
    }
)

// Sinup or Login with Facebook
export const loginFacebook=catchError(
    async (req,res,next)=> {
        const {accessToken} = req.body;
            let profile = await axios.post(`https://graph.facebook.com/me?fields=first_name,last_name,email&format=json&access_token=${accessToken}`);
            console.log(profile);
            async function verify(){
                const {data}=await axios.get(`${process.env.FACEBOOK_URL}/verify`,
                {
                    params:{
                        accessToken,
                        id:profile.data.id
                    }
                });
                        return data;
            };
            const verifiedData=await verify();
            if(!verifiedData) throw new Error('Invalid Token')
                                            
            const existingUser=await userModel.findOne({provider:'Facebook',email:profile.data.email});
            if(existingUser){
                const token = jwt.sign({
                    name: existingUser.name,
                    email: existingUser.email,
                    id: existingUser._id,
                    role: existingUser.role},
                    process.env.JWT_SEC)
                    return res.status(200).send({message:"successful Login",token})
            }
            const SignupUser = await userModel.create({
                firstName: profile.data.first_name,
                lastName: profile.data.last_name,
                email: profile.data.email,
                password: 'password',
                isVerified: true,
                role:'user'
            })
            const token = jwt.sign({
                name: SignupUser.name,
                email: SignupUser.email,
                id: SignupUser._id,
                role:SignupUser.role},
                process.env.JWT_SEC)
                return res.status(201).send({message:"Successfully Registered and Logged In",token
            })
})
